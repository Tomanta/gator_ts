import { pgTable, timestamp, uuid, text, unique } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    name: text("name").notNull().unique(),
});

export type User = typeof users.$inferSelect;

export const feeds = pgTable("feeds", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    name: text("name").notNull(),
    url: text("url").notNull().unique(),
    user_id: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: 'cascade'}),
    lastFetchedAt: timestamp("last_fetched_at")
});

export type Feed = typeof feeds.$inferSelect;

export const feed_follow = pgTable("feed_follow", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    user_id: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: 'cascade'}),
    feed_id: uuid("feed_id")
        .notNull()    
        .references(() => feeds.id, { onDelete: 'cascade'}),
}, (t) => [
    unique().on(t.user_id, t.feed_id)
]);

export const posts = pgTable("posts", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    title: text("title"),
    url: text("url").notNull(),
    description: text("description"),
    publishedAt: timestamp("published_at"),
    feedID: uuid("feed_id")
        .notNull()
        .references(() => feeds.id, { onDelete: 'cascade'}),
}, (t) => [
    unique().on(t.url)
]);

export type Post = typeof posts.$inferSelect;