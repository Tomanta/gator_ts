import { db } from "..";
import { feeds } from "../schema";
import { firstOrUndefined } from "./utils";

// import { eq } from "drizzle-orm";


export async function createFeed(name: string, url: string, userID: string) {
    const feedToInsert = {
        name: name,
        url: url,
        user_id: userID
    }
    const result = await db.insert(feeds).values(feedToInsert).returning();
    return firstOrUndefined(result);
}

