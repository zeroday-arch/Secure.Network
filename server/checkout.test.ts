import { describe, expect, it, beforeEach, vi } from "vitest";
import {
  validatePayPalCode,
  generateOrderNumber,
  processCheckout,
  sendDiscordNotification,
} from "./_core/checkout";

describe("Checkout System", () => {
  describe("validatePayPalCode", () => {
    it("sollte einen gültigen Code akzeptieren", () => {
      const result = validatePayPalCode("PAYPAL-TEST-001");
      expect(result.valid).toBe(true);
      expect(result.amount).toBe(9.99);
    });

    it("sollte einen ungültigen Code ablehnen", () => {
      const result = validatePayPalCode("INVALID-CODE");
      expect(result.valid).toBe(false);
      expect(result.error).toBe("Code ist ungültig oder nicht vorhanden");
    });

    it("sollte einen leeren Code ablehnen", () => {
      const result = validatePayPalCode("");
      expect(result.valid).toBe(false);
      expect(result.error).toBe("Code darf nicht leer sein");
    });

    it("sollte einen zu kurzen Code ablehnen", () => {
      const result = validatePayPalCode("ABC");
      expect(result.valid).toBe(false);
      expect(result.error).toBe("Code ist zu kurz");
    });

    it("sollte Code-Validierung case-insensitiv durchführen", () => {
      const result = validatePayPalCode("paypal-test-001");
      expect(result.valid).toBe(true);
      expect(result.amount).toBe(9.99);
    });

    it("sollte Code mit Whitespace trimmen", () => {
      const result = validatePayPalCode("  PAYPAL-TEST-001  ");
      expect(result.valid).toBe(true);
      expect(result.amount).toBe(9.99);
    });
  });

  describe("generateOrderNumber", () => {
    it("sollte eine eindeutige Bestellnummer generieren", () => {
      const order1 = generateOrderNumber();
      const order2 = generateOrderNumber();

      expect(order1).not.toBe(order2);
      expect(order1).toMatch(/^ORD-[A-Z0-9]+-[A-Z0-9_]+$/);
      expect(order2).toMatch(/^ORD-[A-Z0-9]+-[A-Z0-9_]+$/);
    });

    it("sollte Bestellnummern mit ORD- Präfix generieren", () => {
      const orderNumber = generateOrderNumber();
      expect(orderNumber.startsWith("ORD-")).toBe(true);
    });
  });

  describe("processCheckout", () => {
    it("sollte einen gültigen Checkout verarbeiten", async () => {
      const result = await processCheckout({
        email: "test@example.com",
        paypalCode: "PAYPAL-TEST-002",
        productName: "Test Product",
        productPrice: 19.99,
      });

      expect(result.success).toBe(true);
      expect(result.orderNumber).toBeDefined();
      expect(result.orderNumber).toMatch(/^ORD-[A-Z0-9]+-[A-Z0-9_-]+$/);
    });

    it("sollte ungültige E-Mail ablehnen", async () => {
      const result = await processCheckout({
        email: "invalid-email",
        paypalCode: "PAYPAL-TEST-001",
        productName: "Test Product",
        productPrice: 9.99,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe("Bitte gib eine gültige E-Mail-Adresse ein");
    });

    it("sollte ungültigen PayPal-Code ablehnen", async () => {
      const result = await processCheckout({
        email: "test@example.com",
        paypalCode: "INVALID-CODE",
        productName: "Test Product",
        productPrice: 9.99,
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain("Code ist ungültig");
    });

    it("sollte leere E-Mail ablehnen", async () => {
      const result = await processCheckout({
        email: "",
        paypalCode: "PAYPAL-TEST-001",
        productName: "Test Product",
        productPrice: 9.99,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe("Bitte gib eine gültige E-Mail-Adresse ein");
    });
  });

  describe("sendDiscordNotification", () => {
    it("sollte ohne Fehler ausgeführt werden, wenn Webhook-URL nicht konfiguriert ist", async () => {
      // Webhook-URL ist nicht konfiguriert, sollte nur warnen
      await expect(
        sendDiscordNotification(
          "ORD-TEST-123",
          "test@example.com",
          "Test Product",
          9.99,
          "PAYPAL-TEST-001"
        )
      ).resolves.toBeUndefined();
    });
  });
});
