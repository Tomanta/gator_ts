import { Feed, User } from "../lib/db/schema";
import { getPostsForUser } from "../lib/db/queries/posts";

export async function handlerBrowse(cmdName: string, user: User, ...args: string[]): Promise<void> {
    let limit = 2;

    if (args.length === 1 && !isNaN(parseInt(args[0]))) {
        limit = parseInt(args[0]);
    }

    const posts = await getPostsForUser(user, limit);

    for (const post of posts) {
        console.log(post.posts.title);
        console.log(post.posts.url);
        console.log(post.posts.description);
        console.log();
    }
}