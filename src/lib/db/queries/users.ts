import { db } from "..";
import { users } from "../schema";
import { eq } from "drizzle-orm";
import { firstOrUndefined } from "./utils.js";

export async function createUser(name: string) {
    const userCheck = await getUserByName(name);

    if (userCheck) {
        throw Error(`User ${name} already exists!`);
    }

    const [result] = await db.insert(users).values({ name: name }).returning();
    return result;
}

export async function getUserByName(name: string) {
    const result = await db.select(
        {
            id: users.id,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt,
            name: users.name,
        })
        .from(users)
        .where(eq(users.name, name));
    return firstOrUndefined(result);
}

export async function deleteUsers() {
    await db.delete(users);
}