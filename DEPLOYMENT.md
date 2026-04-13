# 🚀 Security Network - Deployment Anleitung

## 📦 Was ist neu?

### 1. ✉️ Vollständiger E-Mail-Service
- **Automatischer E-Mail-Versand** bei Kontaktformular-Absendung
- **Zwei E-Mails werden versendet:**
  1. An Support-Team (secure-supp@hotmail.com) mit vollständigen Formular-Daten
  2. An Kunden mit personalisierter automatischer Antwort

### 2. 🔐 Discord OAuth Login - FEST KONFIGURIERT
- Client ID: `1493311480269897878`
- Redirect URI: `https://secnetcheck-xzlirhnw.manus.space/api/oauth/discord/callback`
- Diese Werte sind jetzt **fest im Code** eingebaut und ändern sich nicht mehr

---

## 🔧 SCHNELLSTART - 3 Schritte

### Schritt 1: Umgebungsvariablen setzen

Erstelle eine `.env` Datei im Hauptverzeichnis:

```bash
# Kopiere die Beispieldatei
cp .env.example .env

# Bearbeite die .env Datei
nano .env
```

**Pflichtfelder für E-Mail (bereits ausgefüllt):**
```env
SUPPORT_EMAIL=secure-supp@hotmail.com
SUPPORT_EMAIL_PASSWORD=Networksecurity2112
```

**Pflichtfelder für Discord OAuth (MUSST DU ERGÄNZEN):**
```env
DISCORD_CLIENT_ID=1493311480269897878
DISCORD_CLIENT_SECRET=<DEIN_SECRET_HIER>
DISCORD_GUILD_ID=<DEINE_GUILD_ID>
DISCORD_VIP_ROLE_ID=<DEINE_VIP_ROLE_ID>
DISCORD_BOT_TOKEN=<DEIN_BOT_TOKEN>
```

**Optionale Felder:**
```env
DATABASE_URL=<DEINE_DATENBANK_URL>
JWT_SECRET=<EIN_SICHERER_RANDOM_STRING>
NODE_ENV=production
```

### Schritt 2: Discord Developer Portal konfigurieren

1. Gehe zu: https://discord.com/developers/applications/1493311480269897878
2. Navigiere zu **OAuth2** → **General**
3. Füge diese Redirect URI hinzu:
   ```
   https://secnetcheck-xzlirhnw.manus.space/api/oauth/discord/callback
   ```
4. Speichern!

### Schritt 3: Installation & Start

```bash
# Dependencies installieren
pnpm install

# Datenbank-Migrationen ausführen (falls benötigt)
pnpm db:push

# Development-Server starten
pnpm dev

# ODER Production-Build
pnpm build
pnpm start
```

---

## 🧪 TESTEN

### E-Mail-Funktion testen:

1. **Starte die Anwendung**
   ```bash
   pnpm dev
   ```

2. **Öffne im Browser:**
   ```
   http://localhost:5000/contact
   ```

3. **Fülle das Kontaktformular aus:**
   - Name: `Test User`
   - E-Mail: `deine-test-email@gmail.com`
   - Betreff: `Test Nachricht`
   - Nachricht: `Dies ist ein Test`

4. **Klicke auf "Nachricht senden"**

5. **Prüfe beide E-Mail-Postfächer:**
   - ✅ `secure-supp@hotmail.com` sollte die Anfrage erhalten
   - ✅ `deine-test-email@gmail.com` sollte automatische Antwort erhalten

### Discord OAuth testen:

1. **Öffne die Homepage:**
   ```
   http://localhost:5000/
   ```

2. **Klicke auf "Login with Discord"**

3. **Du wirst weitergeleitet zu:**
   ```
   https://discord.com/oauth2/authorize?client_id=1493311480269897878&...
   ```

4. **Nach Autorisierung:**
   - Du wirst zurück zur App geleitet
   - Wenn du VIP-Rolle hast → `/vip` Bereich
   - Sonst → Homepage mit eingeloggtem Status

---

## 📁 Projektstruktur

```
security-network-updated/
├── client/               # Frontend (React + Vite)
│   └── src/
│       ├── pages/
│       │   └── Contact.tsx       # Kontaktformular
│       └── const.ts              # Discord OAuth URL (GEÄNDERT)
├── server/               # Backend (Express + tRPC)
│   ├── _core/
│   │   ├── emailService.ts       # E-Mail-Service (FERTIG)
│   │   ├── discordOAuth.ts       # Discord OAuth (GEÄNDERT)
│   │   └── oauth.ts              # OAuth Callbacks
│   └── routers.ts                # API Routes (enthält contact router)
├── shared/               # Gemeinsame Typen
├── drizzle/             # Datenbank Schema
├── .env.example         # Beispiel-Umgebungsvariablen
├── package.json         # Dependencies
├── SETUP_README.md      # Diese Anleitung
└── CHANGELOG.md         # Änderungsprotokoll
```

---

## 🔍 Was wurde geändert?

### Geänderte Dateien:

1. **`client/src/const.ts`**
   - Discord Login URL verwendet jetzt feste `redirect_uri`
   - Keine dynamische URL-Generierung mehr

2. **`server/_core/discordOAuth.ts`**
   - `exchangeDiscordCode()` verwendet feste `redirect_uri`
   - Konsistent mit Frontend

3. **`.env.example`** (NEU)
   - Enthält alle benötigten Umgebungsvariablen
   - E-Mail-Zugangsdaten bereits ausgefüllt

### Bereits vorhandene Funktionen:

1. **`server/_core/emailService.ts`**
   - ✅ `sendContactEmail()` - Sendet E-Mail an Support
   - ✅ `sendAutoReplyEmail()` - Sendet automatische Antwort
   - ✅ Verwendet exakte Vorlage wie gewünscht

2. **`server/routers.ts`**
   - ✅ Contact-Router mit Validierung
   - ✅ Versendet beide E-Mails automatisch

3. **`client/src/pages/Contact.tsx`**
   - ✅ Vollständiges Kontaktformular
   - ✅ Loading-States
   - ✅ Success/Error Feedback

---

## 🐛 Troubleshooting

### E-Mails werden nicht versendet?

**Problem:** "Failed to send email"

**Lösung:**
1. Prüfe `.env` Datei:
   ```bash
   cat .env | grep SUPPORT_EMAIL
   ```
2. Stelle sicher, dass Hotmail-Login funktioniert
3. Prüfe Server-Logs:
   ```bash
   # Schaue nach "[Email Service]" Nachrichten
   ```

### Discord OAuth funktioniert nicht?

**Problem:** "OAuth callback failed"

**Lösung:**
1. Prüfe Discord Developer Portal:
   - Client ID korrekt: `1493311480269897878`
   - Redirect URI hinzugefügt: `https://secnetcheck-xzlirhnw.manus.space/api/oauth/discord/callback`

2. Prüfe `.env` Datei:
   ```bash
   cat .env | grep DISCORD
   ```

3. Stelle sicher, dass `DISCORD_CLIENT_SECRET` gesetzt ist

### Datenbank-Fehler?

**Problem:** "Database connection failed"

**Lösung:**
```bash
# Setze DATABASE_URL in .env
# Führe Migrationen aus
pnpm db:push
```

---

## 📞 Support

Bei Problemen:
- **E-Mail:** secure-supp@hotmail.com
- **Discord:** https://invitelink.me/securitynetwork

---

## 🎉 Fertig!

Nach diesen Schritten sollte alles funktionieren:
- ✅ Kontaktformular sendet E-Mails
- ✅ Automatische Antworten werden versendet
- ✅ Discord OAuth Login funktioniert
- ✅ VIP-Bereich ist geschützt

Viel Erfolg! 🚀
