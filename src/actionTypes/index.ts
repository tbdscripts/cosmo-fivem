import { ActionType } from "../types";
import ConsoleCommand from "./consoleCommand";

const actionTypes: ActionType[] = [
    new ConsoleCommand(),
];

export function findActionTypeByName(name: string): ActionType | null {
    for (const actionType of actionTypes) {
        if (actionType.name === name) {
            return actionType;
        }
    }

    return null;
}

export default actionTypes;