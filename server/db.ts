import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, discordProfiles, InsertDiscordProfile } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function upsertDiscordProfile(profile: InsertDiscordProfile): Promise<void> {
  if (!profile.userId || !profile.discordId) {
    throw new Error("userId and discordId are required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert discord profile: database not available");
    return;
  }

  try {
    await db.insert(discordProfiles).values(profile).onDuplicateKeyUpdate({
      set: {
        discordUsername: profile.discordUsername,
        discordAvatar: profile.discordAvatar,
        roles: profile.roles,
        isVip: profile.isVip,
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("[Database] Failed to upsert discord profile:", error);
    throw error;
  }
}

export async function getDiscordProfileByUserId(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get discord profile: database not available");
    return undefined;
  }

  const result = await db.select().from(discordProfiles).where(eq(discordProfiles.userId, userId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function checkVipStatus(userId: number): Promise<boolean> {
  const profile = await getDiscordProfileByUserId(userId);
  return profile?.isVip === 1;
}

const VIP_ROLE_ID = "1489613561956270091";

export function hasVipRole(rolesJson: string | null): boolean {
  if (!rolesJson) return false;
  try {
    const roles = JSON.parse(rolesJson) as string[];
    return roles.includes(VIP_ROLE_ID);
  } catch {
    return false;
  }
}

// TODO: add feature queries here as your schema grows.
