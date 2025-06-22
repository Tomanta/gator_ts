import { createFeed, getFeedList, createFeedFollow, getFeedFollowsForUser } from "../lib/db/queries/feeds";
import { Feed, User } from "../lib/db/schema";

export async function handlerAddFeed(cmdName: string, user: User, ...args: string[]): Promise<void> {
    if (args.length !== 2) {
        throw new Error(`Usage: ${cmdName} <feed name> <feed url>`);
    }

    const feedName = args[0];
    const feedUrl = args[1];

    const feed = await createFeed(feedName, feedUrl, user.id);
    if (!feed) {
        throw new Error(`Failed to create feed`);
    }
    
    console.log("Feed created successfully:");

    const feedFollow = await createFeedFollow(user.name, feed.url);

    if (!feedFollow) {
        throw new Error(`Could not follow feed ${feed.url}`);
    }

    printFeed(feed, user);
}

export async function handlerListFeeds(cmdName: string, ...args: string[]): Promise<void> {
    const feeds =  await getFeedList();

    if (feeds.length === 0) {
        console.log("No feeds found.");
        return;
    }

    console.log(`Found ${feeds.length} feeds:`);
    for (const feed of feeds) {
        console.log(`* ${feed.name} - ${feed.url} - Created by: ${feed.userName}`);
    }
}

export async function handlerFollow(cmdName: string, user: User, ...args: string[]): Promise<void> {
    if (args.length !== 1) {
        throw new Error(`Usage: ${cmdName} <feed url>`);
    }
    const urlToFollow = args[0];

    const feedFollow = await createFeedFollow(user.name, urlToFollow);

    if (!feedFollow) {
        throw new Error(`Could not follow: ${urlToFollow}`);
    }

    console.log(`${feedFollow.userName} is now following ${feedFollow.feedName}`)
}

export async function handlerFollowing(cmdName: string, user: User, ...args: string[]): Promise<void> {
    const feeds = await getFeedFollowsForUser(user.name);

    if (!feeds || feeds.length === 0) {
        console.log(`No feeds found for user ${user.name}`);
    }

    for (const feed of feeds) {
        console.log(`* ${feed.feedName}`);
    }

}

function printFeed(feed: Feed, user: User) {
  console.log(`* ID:            ${feed.id}`);
  console.log(`* Created:       ${feed.createdAt}`);
  console.log(`* Updated:       ${feed.updatedAt}`);
  console.log(`* name:          ${feed.name}`);
  console.log(`* URL:           ${feed.url}`);
  console.log(`* User:          ${user.name}`);
}