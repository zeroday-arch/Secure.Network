# 📝 Changelog

## [1.1.0] - 2026-04-14

### ✨ Neu hinzugefügt

#### E-Mail-Service
- **Vollständiger E-Mail-Service** für Kontaktformular
  - Automatischer Versand an Support-Team (secure-supp@hotmail.com)
  - Automatische Antwort an Kunden mit personalisierter Nachricht
  - Link zur Erklärung automatisierter Nachrichten: https://zeroday-arch.github.io/Automatisierte-Nachrichten-Erkl-rung/

#### Discord OAuth
- **Feste Redirect URI** konfiguriert für Produktions-Umgebung
  - `https://secnetcheck-xzlirhnw.manus.space/api/oauth/discord/callback`
  - Keine dynamische URL-Generierung mehr
  - Konsistent zwischen Frontend und Backend

#### Dokumentation
- `.env.example` - Beispiel-Umgebungsvariablen mit E-Mail-Zugangsdaten
- `SETUP_README.md` - Detaillierte Setup-Anleitung
- `DEPLOYMENT.md` - Schritt-für-Schritt Deployment-Guide
- `CHANGELOG.md` - Diese Datei

### 🔧 Geändert

#### Frontend
**`client/src/const.ts`**
```typescript
// Vorher: Dynamische redirect_uri
const redirectUri = `${window.location.origin}/api/oauth/discord/callback`;

// Nachher: Feste redirect_uri
const redirectUri = "https://secnetcheck-xzlirhnw.manus.space/api/oauth/discord/callback";
```

#### Backend
**`server/_core/discordOAuth.ts`**
```typescript
// Vorher: Parameter redirectUri wurde direkt verwendet
redirect_uri: redirectUri,

// Nachher: Feste redirect_uri
const finalRedirectUri = "https://secnetcheck-xzlirhnw.manus.space/api/oauth/discord/callback";
redirect_uri: finalRedirectUri,
```

### 📧 E-Mail-Template

Die automatische Antwort-E-Mail verwendet folgende Vorlage:

```
Betreff: Automatische Bestätigung: Wir haben deine Nachricht erhalten

Hallo <customer-email>,

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
geschrieben. Du fragst dich warum? Guck doch gerne hier vorbei:
https://zeroday-arch.github.io/Automatisierte-Nachrichten-Erkl-rung/
```

### 🔐 Konfiguration

#### Benötigte Umgebungsvariablen

**E-Mail (bereits konfiguriert):**
```env
SUPPORT_EMAIL=secure-supp@hotmail.com
SUPPORT_EMAIL_PASSWORD=Networksecurity2112
```

**Discord OAuth (Client ID bereits konfiguriert):**
```env
DISCORD_CLIENT_ID=1493311480269897878
DISCORD_CLIENT_SECRET=<MUSS_ERGÄNZT_WERDEN>
DISCORD_GUILD_ID=<MUSS_ERGÄNZT_WERDEN>
DISCORD_VIP_ROLE_ID=<MUSS_ERGÄNZT_WERDEN>
DISCORD_BOT_TOKEN=<MUSS_ERGÄNZT_WERDEN>
```

### 📊 Dateistruktur

```
Geänderte Dateien:
├── client/src/const.ts                    [GEÄNDERT]
├── server/_core/discordOAuth.ts           [GEÄNDERT]
└── .env.example                           [NEU]

Bereits implementierte Dateien (keine Änderung nötig):
├── server/_core/emailService.ts           [BEREITS OK]
├── server/routers.ts                      [BEREITS OK]
├── client/src/pages/Contact.tsx           [BEREITS OK]
└── server/_core/oauth.ts                  [BEREITS OK]

Neue Dokumentation:
├── SETUP_README.md                        [NEU]
├── DEPLOYMENT.md                          [NEU]
└── CHANGELOG.md                           [NEU]
```

### 🧪 Testing

#### Kontaktformular testen:
1. Gehe zu `/contact`
2. Fülle alle Felder aus
3. Sende ab
4. Prüfe beide E-Mail-Postfächer

#### Discord OAuth testen:
1. Klicke auf "Login with Discord"
2. Autorisiere die App
3. Prüfe Weiterleitung

### 🔗 Wichtige URLs

**Discord OAuth Authorization URL:**
```
https://discord.com/oauth2/authorize?client_id=1493311480269897878&response_type=code&redirect_uri=https%3A%2F%2Fsecnetcheck-xzlirhnw.manus.space%2Fapi%2Foauth%2Fdiscord%2Fcallback&scope=identify+guilds.members.read+guilds
```

**Discord Developer Portal:**
```
https://discord.com/developers/applications/1493311480269897878
```

**Automatisierte Nachrichten Erklärung:**
```
https://zeroday-arch.github.io/Automatisierte-Nachrichten-Erkl-rung/
```

### 🚀 Deployment-Checkliste

- [ ] `.env` Datei erstellt und ausgefüllt
- [ ] Discord Redirect URI im Developer Portal hinzugefügt
- [ ] `pnpm install` ausgeführt
- [ ] Datenbank-Migrationen durchgeführt
- [ ] E-Mail-Service getestet
- [ ] Discord OAuth getestet
- [ ] Production-Build erstellt
- [ ] Server gestartet

### 📦 Dependencies

Keine neuen Dependencies hinzugefügt. Alle Funktionen nutzen bereits vorhandene Pakete:
- `nodemailer` - Für E-Mail-Versand
- `axios` - Für Discord API Calls
- Alle anderen Dependencies unverändert

### 🐛 Bekannte Probleme

Keine bekannten Probleme.

### 💡 Hinweise

1. **E-Mail-Provider:** Verwendet Hotmail/Outlook SMTP
2. **Rate Limiting:** Hotmail hat E-Mail-Versandlimits, beachte dies bei vielen Anfragen
3. **Discord OAuth:** Redirect URI muss exakt übereinstimmen (inklusive https://)
4. **VIP-Status:** Wird über Discord Guild Roles verwaltet

---

## [1.0.0] - Vorherige Version

### Ursprüngliche Features
- Discord Server Cloning Service
- Pricing-Seiten
- VIP-Bereich
- Checkout-System
- PayPal Integration
- Story-Seite
- Grundlegende Discord OAuth Integration

---

**Versionsnummern:**
- **1.0.0** - Ursprüngliche Version
- **1.1.0** - E-Mail-Service + Discord OAuth Fixes (aktuell)
