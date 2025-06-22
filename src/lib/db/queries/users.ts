import { db } from "..";
import { users } from "../schema";
import { eq } from "drizzle-orm";
import { firstOrUndefined } from "./utils.js";
import { User } from "../schema";

export async function createUser(name: string): Promise<User> {
    const userCheck = await getUserByName(name);

    if (userCheck) {
        throw Error(`User ${name} already exists!`);
    }

    const [result] = await db.insert(users).values({ name: name }).returning();
    return result;
}

export async function getUserByName(name: string): Promise<User | undefined> {
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

export async function getUsers(): Promise<User[]> {
    const result = await db.select({
             id: users.id,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt,
            name: users.name,
       
    }).from(users)
    return result;
}

export async function deleteUsers() {
    await db.delete(users);
}