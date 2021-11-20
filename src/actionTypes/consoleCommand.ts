import { ActionType, ActionTypePayload } from "../types";
import * as SteamId from "steamid";

interface ConsoleCommandData {
    cmd: string;
    expire_cmd: string;
}

export default class ConsoleCommand implements ActionType {
    public name = 'console_command';

    public async handleAction(payload: ActionTypePayload): Promise<boolean> {
        const data = payload.action.data as ConsoleCommandData;
        const cmd = this.replaceVariables(data.cmd, payload);

        ExecuteCommand(cmd);

        return true;
    }

    public async handleExpiredAction(payload: ActionTypePayload): Promise<boolean> {
        const data = payload.action.data as ConsoleCommandData;
        const cmd = this.replaceVariables(data.expire_cmd, payload);

        ExecuteCommand(cmd);

        return true;
    }

    private replaceVariables(cmd: string, payload: ActionTypePayload) {
        const steamId = new SteamId(payload.action.receiver);

        return cmd.replace(":sid64", payload.order.receiver)
            .replace(":sid", steamId.getSteam2RenderedID())
            .replace(":nick", GetPlayerName(payload.playerSource));
    }
}