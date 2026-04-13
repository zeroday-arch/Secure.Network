import nodemailer from "nodemailer";
import { ENV } from "./env";

/**
 * Konfiguriert den E-Mail-Transporter für die Support-E-Mail
 */
function createEmailTransporter() {
  return nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: ENV.supportEmail,
      pass: ENV.supportEmailPassword,
    },
  });
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Sendet die Kontakt-E-Mail an das Support-Team
 */
export async function sendContactEmail(data: ContactFormData): Promise<void> {
  if (!ENV.supportEmail || !ENV.supportEmailPassword) {
    console.warn(
      "[Email Service] Support-E-Mail-Anmeldedaten nicht konfiguriert"
    );
    return;
  }

  try {
    const transporter = createEmailTransporter();

    // E-Mail an das Support-Team
    await transporter.sendMail({
      from: ENV.supportEmail,
      to: ENV.supportEmail,
      subject: `Neue Kontaktanfrage: ${data.subject}`,
      html: `
        <h2>Neue Kontaktanfrage</h2>
        <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
        <p><strong>E-Mail:</strong> ${escapeHtml(data.email)}</p>
        <p><strong>Betreff:</strong> ${escapeHtml(data.subject)}</p>
        <p><strong>Nachricht:</strong></p>
        <p>${escapeHtml(data.message).replace(/\n/g, "<br>")}</p>
      `,
    });

    console.log(`[Email Service] Kontakt-E-Mail von ${data.email} versendet`);
  } catch (error) {
    console.error("[Email Service] Fehler beim Versand der Kontakt-E-Mail:", error);
    throw error;
  }
}

/**
 * Sendet die automatische Antwort-E-Mail an den Kunden
 * mit der exakten Nachrichtenvorlage
 */
export async function sendAutoReplyEmail(customerEmail: string): Promise<void> {
  if (!ENV.supportEmail || !ENV.supportEmailPassword) {
    console.warn(
      "[Email Service] Support-E-Mail-Anmeldedaten nicht konfiguriert"
    );
    return;
  }

  try {
    const transporter = createEmailTransporter();

    const autoReplyHtml = `
      <p>Hallo ${escapeHtml(customerEmail)},</p>
      
      <p>vielen Dank für deine Nachricht.</p>
      
      <p>Wir haben deine E-Mail erhalten und kümmern uns so schnell wie möglich darum. Bitte habe ein wenig Geduld wir melden uns in Kürze wieder bei dir.</p>
      
      <p>Falls du zwischenzeitlich noch zusätzliche Informationen hast, kannst du sie uns jederzeit gerne schicken.</p>
      
      <p>Vielen Dank für dein Verständnis und deine Geduld.</p>
      
      <p>Viele Grüße<br>
      Dein Security Network Team</p>
      
      <hr style="margin-top: 30px; border: none; border-top: 1px solid #ccc;">
      
      <p style="font-size: 12px; color: #999; margin-top: 20px;">
        Dies ist eine automatisierte Nachricht und wurde von keiner echten Person geschrieben. Du fragst dich warum? 
        <a href="https://zeroday-arch.github.io/Automatisierte-Nachrichten-Erkl-rung/" style="color: #0066cc; text-decoration: none;">Guck doch gerne hier vorbei</a>
      </p>
    `;

    await transporter.sendMail({
      from: ENV.supportEmail,
      to: customerEmail,
      subject: "Automatische Bestätigung: Wir haben deine Nachricht erhalten",
      html: autoReplyHtml,
    });

    console.log(
      `[Email Service] Automatische Antwort-E-Mail an ${customerEmail} versendet`
    );
  } catch (error) {
    console.error(
      "[Email Service] Fehler beim Versand der Antwort-E-Mail:",
      error
    );
    throw error;
  }
}

/**
 * Escapes HTML-Zeichen zur Sicherheit
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
