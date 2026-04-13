# Security Network - E-Mail & Discord OAuth Konfiguration

## ✅ Implementierte Features

### 1. Automatische E-Mail-Antworten
Das Kontaktformular sendet jetzt **automatisch** zwei E-Mails:

1. **An das Support-Team** (secure-supp@hotmail.com)
   - Enthält alle Formular-Daten (Name, E-Mail, Betreff, Nachricht)

2. **Automatische Antwort an den Kunden**
   - Personalisierte Begrüßung mit der E-Mail-Adresse des Kunden
   - Bestätigung, dass die Nachricht eingegangen ist
   - Hinweis auf Bearbeitungszeit
   - Link zur Erklärung automatisierter Nachrichten

### 2. Discord OAuth Login
- Client ID: `1493311480269897878`
- Redirect URI: `https://secnetcheck-xzlirhnw.manus.space/api/oauth/discord/callback`
- Scopes: `identify guilds.members.read guilds`

## 🔧 Umgebungsvariablen

Füge folgende Variablen in deine `.env` Datei ein:

```env
# Support Email Configuration
SUPPORT_EMAIL=secure-supp@hotmail.com
SUPPORT_EMAIL_PASSWORD=Networksecurity2112

# Discord OAuth Configuration
DISCORD_CLIENT_ID=1493311480269897878
DISCORD_CLIENT_SECRET=<DEIN_CLIENT_SECRET>
DISCORD_REDIRECT_URI=https://secnetcheck-xzlirhnw.manus.space/api/oauth/discord/callback

# Optional: Discord Guild & VIP Role
DISCORD_GUILD_ID=<DEINE_GUILD_ID>
DISCORD_VIP_ROLE_ID=<DEINE_VIP_ROLE_ID>
DISCORD_BOT_TOKEN=<DEIN_BOT_TOKEN>
```

## 📧 E-Mail-Vorlage

Die automatische Antwort-E-Mail sieht so aus:

```
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

## 🔐 Discord OAuth URL

Die vollständige Discord OAuth URL lautet:
```
https://discord.com/oauth2/authorize?client_id=1493311480269897878&response_type=code&redirect_uri=https%3A%2F%2Fsecnetcheck-xzlirhnw.manus.space%2Fapi%2Foauth%2Fdiscord%2Fcallback&scope=identify+guilds.members.read+guilds
```

## 📝 Geänderte Dateien

1. **`.env`** - Neue Datei mit E-Mail und Discord Konfiguration
2. **`client/src/const.ts`** - Discord Login URL mit fester redirect_uri
3. **`server/_core/discordOAuth.ts`** - Discord OAuth mit fester redirect_uri
4. **`server/_core/emailService.ts`** - Bereits implementiert (keine Änderungen)
5. **`server/routers.ts`** - Bereits implementiert (keine Änderungen)
6. **`client/src/pages/Contact.tsx`** - Bereits implementiert (keine Änderungen)

## 🚀 Deployment

1. Stelle sicher, dass alle Umgebungsvariablen gesetzt sind
2. Installiere Dependencies: `pnpm install`
3. Baue das Projekt: `pnpm build`
4. Starte den Server: `pnpm start`

## ✨ Testen

### E-Mail-Funktion testen:
1. Gehe zu `/contact`
2. Fülle das Formular aus
3. Sende die Nachricht ab
4. Prüfe beide E-Mail-Adressen:
   - secure-supp@hotmail.com (sollte die Anfrage erhalten)
   - Deine Test-E-Mail (sollte automatische Antwort erhalten)

### Discord OAuth testen:
1. Klicke auf "Login with Discord" auf der Homepage
2. Autorisiere die App in Discord
3. Du solltest zum `/vip` Bereich weitergeleitet werden (wenn VIP) oder zur Homepage

## 📞 Support

Bei Fragen oder Problemen:
- E-Mail: secure-supp@hotmail.com
- Discord: https://invitelink.me/securitynetwork
