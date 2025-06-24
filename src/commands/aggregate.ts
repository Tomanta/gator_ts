import { fetchFeed } from "../lib/rss";
import { getNextFeedToFetch, markFeedFetched } from "../lib/db/queries/feeds"
import { Feed } from "../lib/db/schema";
import { parseDuration } from "../lib/time";

export async function handlerAgg(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length !== 1) {
        throw new Error(`Usage: ${cmdName} <time_between_reqs>`);
    }
    
    const timeArg = args[0];
    const timeBetweenReqs = parseDuration(timeArg);
    
    if (!timeBetweenReqs) {
        throw new Error(`Invalid time: ${timeArg}`);
    }

    console.log(`Collecting feeds every ${timeArg}...`);

    // run the first scrape immediately
    scrapeFeeds().catch(handleError);

    // Run new feeds
    const interval = setInterval(() => {
        scrapeFeeds().catch(handleError);
    }, timeBetweenReqs)

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
    console.log(`Found a feed to fetch!`);
    await scrapeFeed(next_feed);
}

async function scrapeFeed(feed: Feed) {
    await markFeedFetched(feed.id)

    const feedData = await fetchFeed(feed.url);

    console.log(
        `Feed ${feed.name} collected, ${feedData.length} posts found`
    );

}