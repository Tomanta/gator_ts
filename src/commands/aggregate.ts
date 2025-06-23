import { fetchFeed } from "../lib/rss";
import { getNextFeedToFetch, markFeedFetched } from "../lib/db/queries/feeds"
import { User } from "../lib/db/schema";

export async function handlerAgg(cmdName: string, user: User, ...args: string[]): Promise<void> {
    if (args.length !== 1) {
        throw new Error(`Usage: ${cmdName} <time_between_reqs>`);
    }
    const timeBetweenReqs = parseInt(args[0]);
    if (!timeBetweenReqs) {
        throw new Error(`Invalid time: ${args[0]}`);
    }

    console.log(`Collecting feeds every ${timeBetweenReqs} seconds`);

    scrapeFeeds().catch(handleError);

    const interval = setInterval(() => {
        scrapeFeeds().catch(handleError);
    }, timeBetweenReqs * 100)

    await new Promise<void>((resolve) => {
        process.on("SIGINT", () => {
            console.log("Shutting down feed aggregator...");
            clearInterval(interval);
            resolve();
        });
    });
}

function handleError(err: unknown) {
    console.error(
        `Error scraping feeds: ${err instanceof Error ? err.message : err}`,
    );
}

async function scrapeFeeds() {
    const next_feed = await getNextFeedToFetch();
    if (!next_feed) {
         throw new Error(`No feed to fetch!`)
    }
    await markFeedFetched(next_feed.id)

    const feed = await fetchFeed(next_feed.url);

    console.log(
        `Feed ${next_feed.name} collected, ${feed.length} posts found`
    );
}