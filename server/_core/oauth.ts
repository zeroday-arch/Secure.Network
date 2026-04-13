import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";
import { processDiscordOAuthCallback, exchangeDiscordCode, getDiscordUser } from "./discordOAuth";
import { ENV } from "./env";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

export function registerOAuthRoutes(app: Express) {
  // Discord OAuth callback
  app.get("/api/oauth/discord/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");

    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }

    try {
      // Decode state to get redirect URI
      const redirectUri = atob(state);

      // Exchange code for access token
      const accessToken = await exchangeDiscordCode(code, redirectUri);

      // Get Discord user info
      const discordUser = await getDiscordUser(accessToken);

      // Create a unique openId for this Discord user
      const openId = `discord_${discordUser.id}`;

      // Upsert user with Discord openId
      await db.upsertUser({
        openId,
        name: discordUser.username,
        email: discordUser.email || null,
        loginMethod: "discord",
        lastSignedIn: new Date(),
      });

      // Get the user to get their ID
      const user = await db.getUserByOpenId(openId);
      if (!user) {
        res.status(500).json({ error: "Failed to create user" });
        return;
      }

      // Process Discord profile and check VIP status
      const { isVip } = await processDiscordOAuthCallback(code, redirectUri, user.id);

      // Create session token
      const sessionToken = await sdk.createSessionToken(openId, {
        name: discordUser.username,
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.redirect(302, isVip ? "/vip" : "/");
    } catch (error) {
      console.error("[Discord OAuth] Callback failed", error);
      res.status(500).json({ error: "Discord OAuth callback failed" });
    }
  });

  // Original Manus OAuth callback (kept for backwards compatibility)
  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");

    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }

    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);

      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }

      await db.upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: new Date(),
      });

      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}
