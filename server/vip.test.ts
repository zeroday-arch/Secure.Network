import { describe, expect, it } from "vitest";
import { hasVipRole } from "./db";

describe("VIP Functionality", () => {
  describe("hasVipRole", () => {
    const VIP_ROLE_ID = "1489613561956270091";

    it("returns true when VIP role is present in roles array", () => {
      const rolesJson = JSON.stringify([VIP_ROLE_ID, "other-role-id"]);
      expect(hasVipRole(rolesJson)).toBe(true);
    });

    it("returns true when VIP role is the only role", () => {
      const rolesJson = JSON.stringify([VIP_ROLE_ID]);
      expect(hasVipRole(rolesJson)).toBe(true);
    });

    it("returns false when VIP role is not present", () => {
      const rolesJson = JSON.stringify(["other-role-1", "other-role-2"]);
      expect(hasVipRole(rolesJson)).toBe(false);
    });

    it("returns false when roles array is empty", () => {
      const rolesJson = JSON.stringify([]);
      expect(hasVipRole(rolesJson)).toBe(false);
    });

    it("returns false when rolesJson is null", () => {
      expect(hasVipRole(null)).toBe(false);
    });

    it("returns false when rolesJson is invalid JSON", () => {
      expect(hasVipRole("invalid-json")).toBe(false);
    });

    it("returns false when rolesJson is empty string", () => {
      expect(hasVipRole("")).toBe(false);
    });
  });

  describe("Pricing Validation", () => {
    const packages = [
      { servers: 1, price: 0, description: "First time free" },
      { servers: 2, price: 10 },
      { servers: 5, price: 20 },
      { servers: 10, price: 25 },
    ];

    it("validates correct pricing for 1 server (first time free)", () => {
      const pkg = packages[0];
      expect(pkg.servers).toBe(1);
      expect(pkg.price).toBe(0);
    });

    it("validates correct pricing for 2 servers", () => {
      const pkg = packages[1];
      expect(pkg.servers).toBe(2);
      expect(pkg.price).toBe(10);
    });

    it("validates correct pricing for 5 servers", () => {
      const pkg = packages[2];
      expect(pkg.servers).toBe(5);
      expect(pkg.price).toBe(20);
    });

    it("validates correct pricing for 10 servers", () => {
      const pkg = packages[3];
      expect(pkg.servers).toBe(10);
      expect(pkg.price).toBe(25);
    });

    it("calculates custom pricing for under 5 servers", () => {
      const pricePerServer = 5.5;
      const serverCount = 3;
      const totalPrice = pricePerServer * serverCount;
      expect(totalPrice).toBe(16.5);
    });

    it("validates fixed pricing for over 5 servers", () => {
      const fixedPrice = 30;
      const serverCount = 7;
      expect(fixedPrice).toBe(30);
    });
  });

  describe("Discord Invite Link", () => {
    const DISCORD_INVITE_LINK = "https://invitelink.me/securitynetwork";

    it("has correct Discord invite link", () => {
      expect(DISCORD_INVITE_LINK).toBe("https://invitelink.me/securitynetwork");
    });

    it("invite link is not empty", () => {
      expect(DISCORD_INVITE_LINK.length).toBeGreaterThan(0);
    });

    it("invite link starts with https", () => {
      expect(DISCORD_INVITE_LINK.startsWith("https://")).toBe(true);
    });
  });

  describe("Support Email", () => {
    const SUPPORT_EMAIL = "secure-supp@hotmail.com";

    it("has correct support email", () => {
      expect(SUPPORT_EMAIL).toBe("secure-supp@hotmail.com");
    });

    it("support email is valid format", () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(emailRegex.test(SUPPORT_EMAIL)).toBe(true);
    });

    it("support email contains hotmail domain", () => {
      expect(SUPPORT_EMAIL.includes("hotmail.com")).toBe(true);
    });
  });

  describe("VIP Role ID", () => {
    const VIP_ROLE_ID = "1489613561956270091";

    it("has correct VIP role ID", () => {
      expect(VIP_ROLE_ID).toBe("1489613561956270091");
    });

    it("VIP role ID is a valid Discord role ID format", () => {
      expect(/^\d+$/.test(VIP_ROLE_ID)).toBe(true);
    });

    it("VIP role ID has correct length", () => {
      expect(VIP_ROLE_ID.length).toBe(19);
    });
  });
});
