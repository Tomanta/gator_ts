import { posts, User, feed_follow } from "../schema";
import { firstOrUndefined } from "./utils";
import { db } from "..";
import  { eq, desc } from "drizzle-orm";

export async function createPost(title: string, url: string, description: string, publishedAt: Date, feedID: string) {
        const existing_post = await getPostByUrl(url);
        
        // Post already exists, do not save
        if (existing_post) {
            return existing_post;
        }
    
        const postToInsert = {
            title: title,
            url: url,
            description: description,
            publishedAt: publishedAt,
            feedID: feedID
        }
        const result = await db.insert(posts).values(postToInsert).returning();
        return firstOrUndefined(result);
}

export async function getPostByUrl(url: string) {
    const result = await
        db.select()
          .from(posts)
          .where(eq(posts.url, url))
    return firstOrUndefined(result);
}

export async function getPostsForUser(user: User, limit: number) {
    const result = await
        db.select()
          .from(posts)
          .innerJoin(feed_follow, eq(posts.feedID,feed_follow.feed_id))
          .where(eq(feed_follow.user_id, user.id))
          .limit(limit)
          .orderBy(desc(posts.publishedAt));
    
    return result;
}