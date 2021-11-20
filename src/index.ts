import { findActionTypeByName } from "./actionTypes";
import { Configuration } from "./types";
import getPlayerIdentifier, { PlayerIdentifier } from "./utils/getPlayerIdentifier";
import HttpClient from "./utils/httpClient";

function getDefaultConfig(): Configuration {
    return {
        instanceUrl: "https://your.domain",
        serverToken: "<your token>",
        fetchInterval: 60,
    };
}

function findPlayerBySteamId(ref: string): string | null {
    const players = getPlayers();
    for (const playerSrc of players) {
        const hexId = getPlayerIdentifier(playerSrc, PlayerIdentifier.Steam);

        const sid64 = BigInt("0x" + hexId);
        if (sid64.toString() === ref) {
            return playerSrc;
        }
    }

    return null;
}

on("onResourceStart", async resourceName => {
    if (GetCurrentResourceName() !== resourceName) return;

    const rawConfig = LoadResourceFile(GetCurrentResourceName(), "config/config.json");
    let config = getDefaultConfig();

    if (rawConfig) {
        try {
            config = JSON.parse(rawConfig) as Configuration;
        } catch (e) {
            console.error("Invalid config.json file, reverting to default.");
            console.error("Details: " + e.message);
        }
    }

    const httpClient = new HttpClient(config);

    setInterval(async () => {
        const [pendingOrders, expiredActions] = await httpClient.getPendingOrdersAndExpiredActions();

        console.log(pendingOrders.length, expiredActions.length);

        for (const pendingOrder of pendingOrders) {
            if (!pendingOrder.actions) continue;

            const playerSrc = findPlayerBySteamId(pendingOrder.receiver);
            if (!playerSrc) continue;

            let success = true;

            for (const action of pendingOrder.actions) {
                const actionType = findActionTypeByName(action.name);
                if (!actionType) {
                    success = false;
                    continue;
                }

                const result = await actionType.handleAction({
                    order: pendingOrder,
                    action: action,
                    playerSource: playerSrc
                });

                if (!result) {
                    success = false;
                }

                await httpClient.completeAction(action.id);
            }

            if (!success) continue;

            await httpClient.deliverOrder(pendingOrder.id);
        }

        for (const expiredAction of expiredActions) {
            if (!expiredAction.order) continue;
            
            const actionType = findActionTypeByName(expiredAction.name);
            if (!actionType) continue;

            const playerSource = findPlayerBySteamId(expiredAction.receiver);
            if (!playerSource) continue;

            await actionType.handleExpiredAction({
                order: expiredAction.order,
                action: expiredAction,
                playerSource: playerSource,
            });

            await httpClient.expireAction(expiredAction.id);
        }
    }, config.fetchInterval * 1000);
});