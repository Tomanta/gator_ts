import { getUserByName } from "../lib/db/queries/users";
import { User } from "../lib/db/schema";
import { readConfig } from "../config";

type UserCommandHandler = (
    cmdName: string,
    user: User,
    ...args: string[]
) => Promise<void>;

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
    return async function (cmdName, ...args) {
        const cfg = readConfig();
   
        const user = await getUserByName(cfg.currentUserName);
        if (!user) {
            throw new Error(`User ${cfg.currentUserName} not found`);
        }

        await handler(cmdName, user, ...args);
    }
};

export type CommandsRegistry = Record<string, CommandHandler>;

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler): void {
    registry[cmdName] = handler;
}

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]): Promise<void> {
    const handler = registry[cmdName];
    
    if (!handler) {
        throw Error(`invalid command: ${cmdName}`);
    }
    
    await handler(cmdName, ...args);
}