export enum PlayerIdentifier {
    Steam,
}

const identifierPrefixes: Record<PlayerIdentifier, string> = {
    [PlayerIdentifier.Steam]: "steam",
};

export default function getPlayerIdentifier(playerSrc: string, identifier: PlayerIdentifier): string | null {
    const identifiers = getPlayerIdentifiers(playerSrc);

    const prefix = identifierPrefixes[identifier];
    if (!prefix) return null;

    for (const identifier of identifiers) {
        if (identifier.startsWith(prefix)) {
            return identifier.substring(prefix.length + 1);
        }
    }

    return null;
}