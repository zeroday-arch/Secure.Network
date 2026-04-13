import { describe, expect, it, vi, beforeEach } from "vitest";
import nodemailer from "nodemailer";
import { sendContactEmail, sendAutoReplyEmail } from "./_core/emailService";

vi.mock("nodemailer");

describe("Email Service", () => {
  const mockSendMail = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (nodemailer.createTransport as any).mockReturnValue({
      sendMail: mockSendMail,
    });
  });

  describe("sendContactEmail", () => {
    it("sollte Kontakt-E-Mail an Support-Team versenden", async () => {
      mockSendMail.mockResolvedValueOnce({ messageId: "123" });

      await sendContactEmail({
        name: "Max Mustermann",
        email: "max@example.com",
        subject: "Frage zum Server-Clone",
        message: "Ich habe eine Frage...",
      });

      expect(mockSendMail).toHaveBeenCalled();
      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.subject).toContain("Frage zum Server-Clone");
      expect(callArgs.html).toContain("Max Mustermann");
      expect(callArgs.html).toContain("max@example.com");
    });

    it("sollte Fehler graceful handhaben", async () => {
      mockSendMail.mockRejectedValueOnce(new Error("SMTP error"));

      await expect(
        sendContactEmail({
          name: "Test",
          email: "test@example.com",
          subject: "Test",
          message: "Test",
        })
      ).rejects.toThrow();
    });
  });

  describe("sendAutoReplyEmail", () => {
    it("sollte automatische Antwort-E-Mail mit exakter Vorlage versenden", async () => {
      mockSendMail.mockResolvedValueOnce({ messageId: "456" });

      await sendAutoReplyEmail("customer@example.com");

      expect(mockSendMail).toHaveBeenCalled();
      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.to).toBe("customer@example.com");
      
      // Überprüfe die exakte Nachrichtenvorlage
      expect(callArgs.html).toContain("Hallo customer@example.com,");
      expect(callArgs.html).toContain("vielen Dank für deine Nachricht.");
      expect(callArgs.html).toContain("Wir haben deine E-Mail erhalten und kümmern uns so schnell wie möglich darum");
      expect(callArgs.html).toContain("Bitte habe ein wenig Geduld wir melden uns in Kürze wieder bei dir");
      expect(callArgs.html).toContain("Falls du zwischenzeitlich noch zusätzliche Informationen hast");
      expect(callArgs.html).toContain("Vielen Dank für dein Verständnis und deine Geduld");
      expect(callArgs.html).toContain("Viele Grüße");
      expect(callArgs.html).toContain("Dein Security Network Team");
    });

    it("sollte Link zur Erklärung in Antwort enthalten", async () => {
      mockSendMail.mockResolvedValueOnce({ messageId: "456" });

      await sendAutoReplyEmail("customer@example.com");

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.html).toContain(
        "https://zeroday-arch.github.io/Automatisierte-Nachrichten-Erkl-rung/"
      );
      expect(callArgs.html).toContain("Guck doch gerne hier vorbei");
      expect(callArgs.html).toContain("Dies ist eine automatisierte Nachricht");
    });

    it("sollte Fehler graceful handhaben", async () => {
      mockSendMail.mockRejectedValueOnce(new Error("SMTP error"));

      await expect(sendAutoReplyEmail("test@example.com")).rejects.toThrow();
    });

    it("sollte E-Mail-Adresse in Begrüßung verwenden", async () => {
      mockSendMail.mockResolvedValueOnce({ messageId: "456" });

      await sendAutoReplyEmail("test.user@example.com");

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.html).toContain("Hallo test.user@example.com,");
    });
  });
});
