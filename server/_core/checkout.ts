import axios from "axios";
import { nanoid } from "nanoid";

// Simulierte Datenbank von gültigen PayPal-Guthabencodes
// In Produktion würde dies mit einer echten PayPal-API oder Datenbank verbunden
const VALID_PAYPAL_CODES: Record<string, { amount: number; used: boolean }> = {
  "PAYPAL-TEST-001": { amount: 9.99, used: false },
  "PAYPAL-TEST-002": { amount: 19.99, used: false },
  "PAYPAL-TEST-003": { amount: 49.99, used: false },
  "PAYPAL-PREMIUM-001": { amount: 99.99, used: false },
};

export interface CheckoutRequest {
  email: string;
  paypalCode: string;
  productName: string;
  productPrice: number;
}

export interface CheckoutResponse {
  success: boolean;
  orderNumber?: string;
  message?: string;
  error?: string;
}

/**
 * Validiert einen PayPal-Guthabencode
 */
export function validatePayPalCode(code: string): {
  valid: boolean;
  amount?: number;
  error?: string;
} {
  const trimmedCode = code.trim().toUpperCase();

  if (!trimmedCode) {
    return { valid: false, error: "Code darf nicht leer sein" };
  }

  if (trimmedCode.length < 5) {
    return { valid: false, error: "Code ist zu kurz" };
  }

  const codeData = VALID_PAYPAL_CODES[trimmedCode];

  if (!codeData) {
    return { valid: false, error: "Code ist ungültig oder nicht vorhanden" };
  }

  if (codeData.used) {
    return { valid: false, error: "Code wurde bereits verwendet" };
  }

  return { valid: true, amount: codeData.amount };
}

/**
 * Generiert eine eindeutige Bestellnummer
 */
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomId = nanoid(6).toUpperCase();
  return `ORD-${timestamp}-${randomId}`;
}

/**
 * Sendet eine Benachrichtigung an den Discord-Webhook
 */
export async function sendDiscordNotification(
  orderNumber: string,
  email: string,
  productName: string,
  productPrice: number,
  paypalCode: string
): Promise<void> {
  // Webhook-URL aus Umgebungsvariablen laden (dynamisch)
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL || "";

  // Webhook-URL nicht konfiguriert - Benachrichtigung wird nicht gesendet
  if (!webhookUrl) {
    console.warn(
      "[Checkout] Discord Webhook URL nicht konfiguriert, Benachrichtigung wird übersprungen"
    );
    return;
  }

  try {
    const embed = {
      title: "🛍️ Neue Bestellung erhalten!",
      color: 3447003, // Blau
      fields: [
        {
          name: "Bestellnummer",
          value: `\`${orderNumber}\``,
          inline: false,
        },
        {
          name: "Produkt",
          value: productName,
          inline: true,
        },
        {
          name: "Preis",
          value: `$${productPrice.toFixed(2)}`,
          inline: true,
        },
        {
          name: "Kundenmail",
          value: email,
          inline: false,
        },
        {
          name: "PayPal-Code",
          value: `\`${paypalCode}\``,
          inline: false,
        },
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: "Security Network Checkout System",
      },
    };

    await axios.post(webhookUrl, {
      embeds: [embed],
      username: "Security Network Bot",
      avatar_url:
        "https://cdn.discordapp.com/avatars/1493337293921062964/a_1234567890.gif",
    });
  } catch (error) {
    console.error("Fehler beim Senden der Discord-Benachrichtigung:", error);
    // Fehler nicht werfen, da die Bestellung trotzdem erfolgreich sein sollte
  }
}

/**
 * Verarbeitet einen Checkout-Request
 */
export async function processCheckout(
  request: CheckoutRequest
): Promise<CheckoutResponse> {
  try {
    // Validiere E-Mail
    if (!request.email || !request.email.includes("@")) {
      return {
        success: false,
        error: "Bitte gib eine gültige E-Mail-Adresse ein",
      };
    }

    // Validiere PayPal-Code
    const codeValidation = validatePayPalCode(request.paypalCode);
    if (!codeValidation.valid) {
      return {
        success: false,
        error: codeValidation.error || "Code-Validierung fehlgeschlagen",
      };
    }

    // Generiere Bestellnummer
    const orderNumber = generateOrderNumber();

    // Markiere Code als verwendet
    const trimmedCode = request.paypalCode.trim().toUpperCase();
    if (VALID_PAYPAL_CODES[trimmedCode]) {
      VALID_PAYPAL_CODES[trimmedCode].used = true;
    }

    // Sende Discord-Benachrichtigung
    await sendDiscordNotification(
      orderNumber,
      request.email,
      request.productName,
      request.productPrice,
      request.paypalCode
    );

    return {
      success: true,
      orderNumber,
      message: `Bestellung erfolgreich erstellt! Deine Bestellnummer: ${orderNumber}`,
    };
  } catch (error) {
    console.error("Fehler bei der Checkout-Verarbeitung:", error);
    return {
      success: false,
      error: "Ein Fehler ist bei der Verarbeitung deiner Bestellung aufgetreten",
    };
  }
}

/**
 * Gibt eine Liste von Test-Codes zurück (nur für Entwicklung)
 */
export function getTestCodes(): string[] {
  return Object.keys(VALID_PAYPAL_CODES).filter(
    (code) => !VALID_PAYPAL_CODES[code].used
  );
}
