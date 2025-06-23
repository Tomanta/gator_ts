import { db } from "..";
import { feeds, users, feed_follow, User } from "../schema";
import { getUserByName } from "./users";
import { firstOrUndefined } from "./utils.js";
import { eq, and, sql } from "drizzle-orm";


export async function createFeed(name: string, url: string, userID: string) {
    const feedToInsert = {
        name: name,
        url: url,
        user_id: userID
    }
    const result = await db.insert(feeds).values(feedToInsert).returning();
    return firstOrUndefined(result);
}

export type Feed = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    url: string;
    userName: string;
}

export async function getFeedList(): Promise<Feed[]> {
    const result = await db.select({
        id: feeds.id,
        createdAt: feeds.createdAt,
        updatedAt: feeds.updatedAt,
        name: feeds.name,
        url: feeds.url,
        userName: users.name,
    }).from(feeds)
      .innerJoin(users, eq(feeds.user_id, users.id));
    return result;
}

export async function getFeedFromURL(url: string): Promise<Feed | undefined>  {
    const result = await db.select(
        {
            id: feeds.id,
            createdAt: feeds.createdAt,
            updatedAt: feeds.updatedAt,
            name: feeds.name,
            url: feeds.url,
            userName: users.name,
        })
        .from(feeds)
        .innerJoin(users, eq(feeds.user_id, users.id))
        .where(eq(feeds.url, url));
      return firstOrUndefined(result);
}

export async function createFeedFollow(userName: string, url: string) {
    const feed = await getFeedFromURL(url);
    if (!feed) {
        throw new Error(`Could not find feed: ${url}; is it registered?`);
    }

    const user = await getUserByName(userName);

    if (!user) {
        throw new Error(`Could not find user: ${userName}`);
    }

    const [newFeedFollow]=  await db.insert(feed_follow).values(
        {
            user_id: user.id,
            feed_id: feed.id,
        }
    ).returning();

    if (!newFeedFollow) {
        throw new Error(`Could not create feed_follow`);
    }

    const result = await db.select(
        {
            id: feed_follow.id,
            createdAt: feed_follow.createdAt,
            updatedAt: feed_follow.updatedAt,
            user_id: feed_follow.user_id,
            feed_id: feed_follow.feed_id,
            feedName: feeds.name,
            userName: users.name,
        })
        .from(feed_follow)
        .innerJoin(feeds, eq(feeds.id,newFeedFollow.feed_id))
        .innerJoin(users, eq(users.id,newFeedFollow.user_id ))
    
    return firstOrUndefined(result);
}

export async function deleteFeedFollow(user: User, feedURL: string) {
    const feed = await getFeedFromURL(feedURL);
    if (!feed) {
        throw new Error(`Feed ${feedURL} does not exist`);
    }
    
    console.log(`DEBUG: user: ${user.id} - feed: ${feed.id}`);
    await db.delete(feed_follow)
            .where(and(eq(feed_follow.user_id,user.id),
                       eq(feed_follow.feed_id,feed.id))
                  );
}

export async function getFeedFollowsForUser(userName: string) {
    const result = await db.select(
        {
        userName: users.name,
        feedName: feeds.name,
        feedURL: feeds.url,
        })
        .from(feed_follow)
        .innerJoin(feeds, eq(feeds.id,feed_follow.feed_id))
        .innerJoin(users, eq(users.id,feed_follow.user_id))
        .where(eq(users.name, userName));
    return result;
}

export async function markFeedFetched(feedID: string) {
    await db.update(feeds)
            .set({ lastFetchedAt: sql`NOW()`})
            .where(eq(feeds.id, feedID));
}

export async function getNextFeedToFetch() {
    const result = await db.select()
                .from(feeds)
                .orderBy(sql`${feeds.lastFetchedAt} asc nulls first`)
                .limit(1);
    return firstOrUndefined(result);
}