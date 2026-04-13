# 📧 E-Mail-Template Dokumentation

## Übersicht

Das System versendet bei jeder Kontaktformular-Absendung **zwei E-Mails automatisch**:

1. **An das Support-Team** → Interne Benachrichtigung
2. **An den Kunden** → Automatische Bestätigung

---

## 1️⃣ E-Mail an Support-Team

### Empfänger
- **An:** secure-supp@hotmail.com
- **Von:** secure-supp@hotmail.com

### Betreff
```
Neue Kontaktanfrage: <Betreff aus Formular>
```

### Inhalt (HTML)
```html
<h2>Neue Kontaktanfrage</h2>
<p><strong>Name:</strong> <Name aus Formular></p>
<p><strong>E-Mail:</strong> <E-Mail aus Formular></p>
<p><strong>Betreff:</strong> <Betreff aus Formular></p>
<p><strong>Nachricht:</strong></p>
<p><Nachricht aus Formular mit Zeilenumbrüchen></p>
```

### Beispiel
```
Betreff: Neue Kontaktanfrage: Frage zu VIP-Paket

────────────────────

Neue Kontaktanfrage

Name: Max Mustermann
E-Mail: max@example.com
Betreff: Frage zu VIP-Paket
Nachricht:
Hallo,
ich interessiere mich für das VIP-Paket.
Können Sie mir mehr Infos geben?

Danke!
```

---

## 2️⃣ Automatische Antwort an Kunden

### Empfänger
- **An:** <E-Mail aus Formular>
- **Von:** secure-supp@hotmail.com

### Betreff
```
Automatische Bestätigung: Wir haben deine Nachricht erhalten
```

### Inhalt (HTML mit exakter Vorlage)

```html
<p>Hallo <E-Mail des Kunden>,</p>

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
```

### Beispiel (wie der Kunde es sieht)

```
Von: secure-supp@hotmail.com
An: max@example.com
Betreff: Automatische Bestätigung: Wir haben deine Nachricht erhalten

────────────────────

Hallo max@example.com,

vielen Dank für deine Nachricht.

Wir haben deine E-Mail erhalten und kümmern uns so schnell wie möglich darum. 
Bitte habe ein wenig Geduld wir melden uns in Kürze wieder bei dir.

Falls du zwischenzeitlich noch zusätzliche Informationen hast, kannst du sie 
uns jederzeit gerne schicken.

Vielen Dank für dein Verständnis und deine Geduld.

Viele Grüße
Dein Security Network Team

────────────────────────────────────────────────────────────────────────

Dies ist eine automatisierte Nachricht und wurde von keiner echten Person 
geschrieben. Du fragst dich warum? Guck doch gerne hier vorbei
                                      └─────────────┬─────────────┘
                                            (Link zur Erklärung)
```

---

## 🔧 Code-Implementation

### Datei: `server/_core/emailService.ts`

#### Funktion 1: Support-E-Mail senden
```typescript
export async function sendContactEmail(data: ContactFormData): Promise<void> {
  const transporter = createEmailTransporter();

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
}
```

#### Funktion 2: Automatische Antwort senden
```typescript
export async function sendAutoReplyEmail(customerEmail: string): Promise<void> {
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
}
```

---

## 🎨 Template anpassen

### Text ändern
Bearbeite die Datei: `server/_core/emailService.ts`

Suche nach `sendAutoReplyEmail` und ändere den HTML-String:

```typescript
const autoReplyHtml = `
  <p>Hallo ${escapeHtml(customerEmail)},</p>
  
  <!-- HIER KANNST DU DEN TEXT ÄNDERN -->
  <p>Dein eigener Text...</p>
  
  <p>Viele Grüße<br>
  Dein Security Network Team</p>
`;
```

### Link ändern
Suche nach:
```html
<a href="https://zeroday-arch.github.io/Automatisierte-Nachrichten-Erkl-rung/" ...>
```

Ersetze die URL durch deine eigene.

### Styling ändern
Du kannst inline CSS verwenden:

```html
<p style="font-size: 14px; color: #333; margin: 10px 0;">
  Dein Text
</p>
```

---

## ✅ Sicherheitshinweise

### HTML-Escaping
Alle Benutzereingaben werden mit `escapeHtml()` gesichert:

```typescript
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
```

Das verhindert XSS-Angriffe durch böswillige Eingaben.

---

## 🧪 E-Mail-Versand testen

### Manueller Test

```typescript
// Test-Script (kannst du in einer separaten Datei erstellen)
import { sendAutoReplyEmail } from './server/_core/emailService';

async function test() {
  await sendAutoReplyEmail('deine-test-email@gmail.com');
  console.log('Test-E-Mail versendet!');
}

test();
```

### Über das Kontaktformular

1. Öffne: `http://localhost:5000/contact`
2. Fülle alle Felder aus
3. Sende ab
4. Prüfe beide E-Mail-Postfächer

---

## 📊 E-Mail-Versand-Flow

```
Benutzer füllt Formular aus
         ↓
Klickt "Nachricht senden"
         ↓
Frontend sendet Daten an Backend (tRPC)
         ↓
Backend validiert Eingaben (Zod-Schema)
         ↓
┌────────────────────────────────────┐
│  sendContactEmail()                │
│  → E-Mail an Support-Team          │
└────────────────────────────────────┘
         ↓
┌────────────────────────────────────┐
│  sendAutoReplyEmail()              │
│  → Automatische Antwort an Kunde   │
└────────────────────────────────────┘
         ↓
Erfolgsbestätigung an Frontend
         ↓
Toast-Nachricht: "Nachricht versendet!"
```

---

## 🔑 Login-Daten

**E-Mail-Account:**
- Adresse: `secure-supp@hotmail.com`
- Passwort: `Networksecurity2112`
- Provider: Hotmail/Outlook
- SMTP-Server: Wird automatisch von `nodemailer` erkannt

**Wichtig:** Diese Daten sind in der `.env` Datei gespeichert und sollten NIEMALS in Git committed werden!

---

## 🚨 Fehlerbehebung

### E-Mails kommen nicht an?

1. **Prüfe SMTP-Verbindung:**
   ```bash
   # Server-Logs prüfen
   tail -f logs/server.log | grep "Email Service"
   ```

2. **Prüfe Hotmail-Login:**
   - Logge dich manuell bei Hotmail ein
   - Stelle sicher, dass "Weniger sichere Apps" aktiviert ist (falls nötig)

3. **Prüfe Spam-Ordner:**
   - Automatische E-Mails landen oft im Spam

4. **Prüfe Rate-Limits:**
   - Hotmail hat Versandlimits
   - Zu viele E-Mails in kurzer Zeit → temporäre Sperre

### E-Mails werden als Spam markiert?

- Füge SPF/DKIM Records hinzu (erfordert Domain-Zugriff)
- Verwende eine eigene Domain statt Hotmail
- Reduziere "spammy" Wörter im Text

---

## 📝 Checkliste

- [x] E-Mail-Service implementiert
- [x] Support-E-Mail-Vorlage fertig
- [x] Automatische Antwort-Vorlage fertig
- [x] HTML-Escaping für Sicherheit
- [x] Error-Handling implementiert
- [x] Logging aktiviert
- [x] Link zur Erklärung eingebaut
- [x] Testbar über Kontaktformular

---

**Version:** 1.1.0  
**Letzte Aktualisierung:** 14. April 2026  
**Dokumentiert von:** Claude (Anthropic)
