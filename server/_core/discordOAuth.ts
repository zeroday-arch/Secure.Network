import axios from "axios";
import { ENV } from "./env";
import * as db from "../db";
import type { InsertDiscordProfile } from "../../drizzle/schema";

const DISCORD_API_BASE = "https://discord.com/api/v10";

export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  email: string;
}

export interface DiscordGuildMember {
  user: DiscordUser;
  roles: string[];
}

/**
 * Exchange Discord authorization code for access token
 */
export async function exchangeDiscordCode(code: string, redirectUri: string): Promise<string> {
  try {
    // Use the fixed redirect URI for production
    const finalRedirectUri = "https://secnetcheck-xzlirhnw.manus.space/api/oauth/discord/callback";
    
    const response = await axios.post(
      `${DISCORD_API_BASE}/oauth2/token`,
      {
        client_id: ENV.discordClientId,
        client_secret: ENV.discordClientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: finalRedirectUri,
        scope: "identify guilds.members.read guilds",
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error("[Discord OAuth] Failed to exchange code:", error);
    throw new Error("Failed to exchange Discord authorization code");
  }
}

/**
 * Get Discord user information using access token
 */
export async function getDiscordUser(accessToken: string): Promise<DiscordUser> {
  try {
    const response = await axios.get(`${DISCORD_API_BASE}/users/@me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("[Discord OAuth] Failed to get user info:", error);
    throw new Error("Failed to fetch Discord user information");
  }
}

/**
 * Get Discord guild member information to check roles
 */
export async function getDiscordGuildMember(
  userId: string,
  guildId: string,
  accessToken: string
): Promise<DiscordGuildMember | null> {
  try {
    const response = await axios.get(
      `${DISCORD_API_BASE}/users/@me/guilds/${guildId}/member`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.warn(`[Discord OAuth] User ${userId} is not a member of guild ${guildId}`);
    return null;
  }
}

/**
 * Check if user has VIP role in the Discord server
 */
export function hasVipRole(roles: string[]): boolean {
  return roles.includes(ENV.discordVipRoleId);
}

/**
 * Process Discord OAuth callback and save user profile
 */
export async function processDiscordOAuthCallback(
  code: string,
  redirectUri: string,
  userId: number
): Promise<{ discordId: string; isVip: boolean }> {
  try {
    // Exchange code for access token
    const accessToken = await exchangeDiscordCode(code, redirectUri);

    // Get Discord user info
    const discordUser = await getDiscordUser(accessToken);

    // Check guild membership and roles
    let isVip = false;
    let roles: string[] = [];

    if (ENV.discordGuildId) {
      const guildMember = await getDiscordGuildMember(
        discordUser.id,
        ENV.discordGuildId,
        accessToken
      );

      if (guildMember) {
        roles = guildMember.roles;
        isVip = hasVipRole(roles);
      }
    }

    // Save Discord profile to database
    const profile: InsertDiscordProfile = {
      userId,
      discordId: discordUser.id,
      discordUsername: discordUser.username,
      discordAvatar: discordUser.avatar,
      roles: JSON.stringify(roles),
      isVip: isVip ? 1 : 0,
    };

    await db.upsertDiscordProfile(profile);

    return {
      discordId: discordUser.id,
      isVip,
    };
  } catch (error) {
    console.error("[Discord OAuth] Failed to process callback:", error);
    throw error;
  }
}

/**
 * Generate Discord OAuth authorization URL
 */
export function getDiscordOAuthUrl(redirectUri: string, state: string): string {
  const url = new URL("https://discord.com/oauth2/authorize");
  url.searchParams.set("client_id", ENV.discordClientId);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", "identify guilds.members.read guilds");
  url.searchParams.set("state", state);

  return url.toString();
}
