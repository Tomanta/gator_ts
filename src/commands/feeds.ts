import { createFeed } from "../lib/db/queries/feeds";
import { Feed, User } from "../lib/db/schema";
import { readConfig } from "../config";
import { getUserByName } from "../lib/db/queries/users";


export async function handlerAddFeed(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length !== 2) {
        throw new Error(`Usage: ${cmdName} <feed name> <feed url>`);
    }
    const cfg = readConfig();
    const user = await getUserByName(cfg.currentUserName);

    if (!user) {
        throw new Error(`Could not find current user: ${cfg.currentUserName}`);
    }

    const feedName = args[0];
    const feedUrl = args[1];

    const feed = await createFeed(feedName, feedUrl, user.id);
    if (!feed) {
        throw new Error(`Failed to create feed`);
    }
    
    console.log("Feed created successfully:");
    printFeed(feed, user);

}

export function printFeed(feed: Feed, user: User) {
  console.log(`* ID:            ${feed.id}`);
  console.log(`* Created:       ${feed.createdAt}`);
  console.log(`* Updated:       ${feed.updatedAt}`);
  console.log(`* name:          ${feed.name}`);
  console.log(`* URL:           ${feed.url}`);
  console.log(`* User:          ${user.name}`);
}