import { setUser } from "../config";
import { getUserByName, createUser, deleteUsers } from "../lib/db/queries/users";

export async function handlerLogin(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length !== 1) {
        throw new Error(`Usage: ${cmdName} <name>`);
    }
    const userName = args[0]

    const user = await getUserByName(userName);
    if (!user) {
        throw new Error(`User ${userName} not registered!`);
    }

    setUser(userName);
    console.log("User swtched successfully!");
}

export async function handlerRegister(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length !== 1) {
        throw new Error(`Usage: ${cmdName} <name>`);
    }

    const userName = args[0]
    const user = await createUser(userName);
    if (!user) {
        throw new Error(`User ${userName} not found`);
    }

    setUser(user.name);
    
    console.log(`User ${user.name} at ${user.createdAt}`);

}


export async function handlerResetUsers(cmdNAme: string, ...args: string[]): Promise<void> {
    await deleteUsers();
    console.log("Users table reset");
}