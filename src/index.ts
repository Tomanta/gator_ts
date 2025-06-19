import { type CommandsRegistry, registerCommand, runCommand} from "./commands/commands";
import { handlerLogin } from "./commands/users";
// import { readConfig, setUser } from "./config.js";

function main() {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log("usage: cli <command> [args...]");
        process.exit(1)
    }

    const cmdName = args[0];
    const cmdArgs = args.slice(1);

    const registry = {};
    registerCommand(registry, "login", handlerLogin);

    try {
        runCommand(registry, args[0], ...args.slice(1,));
    } catch (err) {
        if (err instanceof Error) {
            console.error(`Error running command ${cmdName}: ${err.message}`);
        } else {
            console.error(`Error running command ${cmdName}: ${err}`);
        }
        process.exit(1);
    }
    
}

main();