import { db } from "..";
import { feeds, users } from "../schema";
import { firstOrUndefined } from "./utils.js";
import { eq } from "drizzle-orm";


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