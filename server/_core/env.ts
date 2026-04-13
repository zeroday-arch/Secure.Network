export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  // Discord OAuth Configuration
  discordClientId: process.env.DISCORD_CLIENT_ID ?? "",
  discordClientSecret: process.env.DISCORD_CLIENT_SECRET ?? "",
  discordGuildId: process.env.DISCORD_GUILD_ID ?? "",
  discordVipRoleId: process.env.DISCORD_VIP_ROLE_ID ?? "",
  discordBotToken: process.env.DISCORD_BOT_TOKEN ?? "",
  // Support Email Configuration
  supportEmail: process.env.SUPPORT_EMAIL ?? "",
  supportEmailPassword: process.env.SUPPORT_EMAIL_PASSWORD ?? "",
  supportEmailCallbackUrl: process.env.SUPPORT_EMAIL_CALLBACK_URL ?? "",
};
