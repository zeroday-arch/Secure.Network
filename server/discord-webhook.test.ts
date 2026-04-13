import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import axios from "axios";
import { sendDiscordNotification } from "./_core/checkout";

vi.mock("axios");

describe("Discord Webhook Integration", () => {
  const originalEnv = process.env.DISCORD_WEBHOOK_URL;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env.DISCORD_WEBHOOK_URL = originalEnv;
  });

  it("sollte Discord-Webhook mit korrektem Payload aufrufen", async () => {
    const mockAxios = axios as any;
    mockAxios.post.mockResolvedValueOnce({ status: 204 });

    // Webhook-URL ist bereits über die Umgebung konfiguriert
    // Die Funktion sollte sie verwenden
    await sendDiscordNotification(
      "ORD-TEST-123",
      "test@example.com",
      "Premium Package",
      99.99,
      "PAYPAL-TEST-001"
    );

    expect(mockAxios.post).toHaveBeenCalled();
    const callArgs = mockAxios.post.mock.calls[0];
    
    // Überprüfe, dass axios.post mit einer URL aufgerufen wurde
    expect(callArgs[0]).toContain("discord.com/api/webhooks");
    
    // Überprüfe den Payload
    expect(callArgs[1]).toHaveProperty("embeds");
    expect(callArgs[1].embeds).toHaveLength(1);
    
    const embed = callArgs[1].embeds[0];
    expect(embed.title).toBe("🛍️ Neue Bestellung erhalten!");
    expect(embed.fields).toHaveLength(5);
    
    // Überprüfe einzelne Felder
    const fields = embed.fields;
    expect(fields[0].name).toBe("Bestellnummer");
    expect(fields[0].value).toContain("ORD-TEST-123");
    
    expect(fields[1].name).toBe("Produkt");
    expect(fields[1].value).toBe("Premium Package");
    
    expect(fields[2].name).toBe("Preis");
    expect(fields[2].value).toBe("$99.99");
    
    expect(fields[3].name).toBe("Kundenmail");
    expect(fields[3].value).toBe("test@example.com");
    
    expect(fields[4].name).toBe("PayPal-Code");
    expect(fields[4].value).toContain("PAYPAL-TEST-001");
  });

  it("sollte Webhook-Fehler graceful handhaben", async () => {
    const mockAxios = axios as any;
    mockAxios.post.mockRejectedValueOnce(new Error("Network error"));

    // Sollte nicht werfen, sondern nur loggen
    await expect(
      sendDiscordNotification(
        "ORD-TEST-123",
        "test@example.com",
        "Premium Package",
        99.99,
        "PAYPAL-TEST-001"
      )
    ).resolves.toBeUndefined();
  });

  it("sollte Webhook-Versand überspringen, wenn URL nicht konfiguriert ist", async () => {
    const mockAxios = axios as any;
    process.env.DISCORD_WEBHOOK_URL = "";

    await sendDiscordNotification(
      "ORD-TEST-123",
      "test@example.com",
      "Premium Package",
      99.99,
      "PAYPAL-TEST-001"
    );

    // Webhook sollte nicht aufgerufen werden
    expect(mockAxios.post).not.toHaveBeenCalled();
  });
});
