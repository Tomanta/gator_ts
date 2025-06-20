import { CommandsRegistry, registerCommand, runCommand} from "./commands/commands";
import { handlerLogin, handlerRegister, handlerResetUsers } from "./commands/users";

async function main() {

    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log("usage: cli <command> [args...]");
        process.exit(1)
    }

    const cmdName = args[0];
    const cmdArgs = args.slice(1);

    const registry = {};
    registerCommand(registry, "login", handlerLogin);
    registerCommand(registry, "register", handlerRegister);
    registerCommand(registry, "reset", handlerResetUsers);

    try {
        await runCommand(registry, args[0], ...args.slice(1,));
    } catch (err) {
        if (err instanceof Error) {
            console.error(`Error running command ${cmdName}: ${err.message}`);
        } else {
            console.error(`Error running command ${cmdName}: ${err}`);
        }
        process.exit(1);
    }
    
    process.exit(0);

}

main();