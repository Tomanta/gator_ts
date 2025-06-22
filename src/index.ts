import { CommandsRegistry, registerCommand, runCommand} from "./commands/commands";
import { handlerLogin, handlerRegister, handlerResetUsers, handlerGetUsers } from "./commands/users";
import { handlerAgg } from "./commands/aggregate";
import { handlerAddFeed, handlerListFeeds, handlerFollow, handlerFollowing } from "./commands/feeds";

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
    registerCommand(registry, "users", handlerGetUsers);
    registerCommand(registry, "agg", handlerAgg);
    registerCommand(registry, "addfeed", handlerAddFeed);
    registerCommand(registry, "feeds", handlerListFeeds);
    registerCommand(registry, "follow", handlerFollow);
    registerCommand(registry, "following", handlerFollowing);

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