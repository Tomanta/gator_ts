import { XMLParser } from "fast-xml-parser";

export type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

export type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedURL: string) {
    const userAgent = "gator";

    const response = await fetch(feedURL, {
        method: "GET",
        headers: {
            "User-Agent": userAgent,
            accept: "application/rss+xml",
        },
    });

    if (!response.ok) {
        throw new Error(`Could not retrieve feed: ${response.status}: ${response.statusText}`);
    }

    const xml = await response.text();
    const parser = new XMLParser();
    const result = parser.parse(xml);

    const channel = result.rss?.channel;
    if (!channel) {
        throw new Error("Invalid RSS: channel not found");
    }

    if (
        !channel ||
        !channel.title ||
        !channel.link ||
        !channel.description ||
        !channel.item
    ) {
        throw new Error("failed to parse channel");
    }

    const items: any[] = Array.isArray(channel.item) ? channel.item : [channel.item];
    const rssItems: RSSItem[] = [];

    for (const item of items) {
        if (!item.title || !item.link || !item.description || !item.pubDate) {
            continue;
        }

        rssItems.push({
            title: item.title,
            link: item.link,
            description: item.description,
            pubDate: item.pubDate,
        });
    
    
    const rss: RSSFeed = {
        channel: {
            title: channel.title,
            link: channel.link,
            description: channel.description,
            item: rssItems,
        },
    }};

    return rssItems;
}