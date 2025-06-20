import { fetchFeed } from "../lib/rss";

export async function handlerAgg(cmdNAme: string, ...args: string[]): Promise<void> {
    const feedURL = "https://www.wagslane.dev/index.xml";

    const feedData = await fetchFeed(feedURL);
    const feedDataStr = JSON.stringify(feedData, null, 2);
    console.log(feedDataStr);

}