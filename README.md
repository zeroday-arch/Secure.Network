# 🔐 Security Network - Server Cloning Platform

> Eine professionelle Discord Server Cloning Platform mit VIP-Bereich, automatischem E-Mail-Support und OAuth-Integration

![Version](https://img.shields.io/badge/version-1.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)

---

## 🎯 Features

### ✅ Vollständig implementiert und einsatzbereit:

- **🏠 Landing Page** - Moderne Homepage mit Neon-Design
- **💰 Pricing System** - Verschiedene Server-Cloning Pakete
- **📧 Kontaktformular** - Automatischer E-Mail-Versand
  - E-Mail an Support-Team
  - Automatische Bestätigungs-E-Mail an Kunden
  - Personalisierte Antworten
- **🔐 Discord OAuth Login** - Sichere Benutzer-Authentifizierung
- **👑 VIP-Bereich** - Exklusiver Bereich für zahlende Kunden
- **💳 Checkout-System** - PayPal-Integration
- **📖 Story-Seite** - Über uns & Team
- **🎨 Responsives Design** - Mobile-first Ansatz
- **⚡ Performance** - Schnelle Ladezeiten mit Vite

---

## 🚀 Quick Start

### Voraussetzungen
- Node.js >= 18
- pnpm (oder npm)
- Discord Developer Account

### Installation

```bash
# 1. Projekt klonen/entpacken
cd security-network-updated

# 2. Dependencies installieren
pnpm install

# 3. Umgebungsvariablen konfigurieren
cp .env.example .env
nano .env

# 4. Server starten
pnpm dev
```

**Öffne im Browser:** `http://localhost:5000`

📚 **Detaillierte Anleitung:** Siehe [QUICKSTART.md](QUICKSTART.md)

---

## 📋 Dokumentation

| Dokument | Beschreibung |
|----------|--------------|
| **[QUICKSTART.md](QUICKSTART.md)** | ⚡ In 5 Minuten starten |
| **[DEPLOYMENT.md](DEPLOYMENT.md)** | 🚀 Ausführliche Deployment-Anleitung |
| **[EMAIL_TEMPLATE_DOCS.md](EMAIL_TEMPLATE_DOCS.md)** | 📧 E-Mail-Template Dokumentation |
| **[CHANGELOG.md](CHANGELOG.md)** | 📝 Alle Änderungen & Updates |

---

## ⚙️ Konfiguration

### Minimale .env Konfiguration

```env
# E-Mail (bereits konfiguriert)
SUPPORT_EMAIL=secure-supp@hotmail.com
SUPPORT_EMAIL_PASSWORD=Networksecurity2112

# Discord OAuth (Client ID bereits konfiguriert)
DISCORD_CLIENT_ID=1493311480269897878
DISCORD_CLIENT_SECRET=<HIER_EINTRAGEN>
```

### Vollständige .env Konfiguration

Siehe [.env.example](.env.example) für alle verfügbaren Optionen.

---

## 🏗️ Tech Stack

### Frontend
- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool & Dev Server
- **Tailwind CSS** - Styling
- **Wouter** - Routing
- **shadcn/ui** - UI Components
- **tRPC** - Type-safe API

### Backend
- **Express** - Server Framework
- **tRPC** - Type-safe API Layer
- **Drizzle ORM** - Database
- **Nodemailer** - E-Mail Versand
- **Axios** - HTTP Client
- **Zod** - Schema Validation

### Services
- **Discord OAuth** - Benutzer-Authentifizierung
- **Hotmail SMTP** - E-Mail-Versand
- **PayPal** - Zahlungsabwicklung (optional)

---

## 📁 Projektstruktur

```
security-network-updated/
├── client/                    # Frontend (React)
│   ├── src/
│   │   ├── pages/            # Seiten-Komponenten
│   │   │   ├── Home.tsx      # Landing Page
│   │   │   ├── Contact.tsx   # Kontaktformular
│   │   │   ├── Pricing.tsx   # Preise
│   │   │   ├── VipArea.tsx   # VIP-Bereich
│   │   │   └── ...
│   │   ├── components/       # Wiederverwendbare Komponenten
│   │   └── const.ts          # Discord OAuth URL
│
├── server/                    # Backend (Express)
│   ├── _core/
│   │   ├── emailService.ts   # E-Mail-Service
│   │   ├── discordOAuth.ts   # Discord OAuth
│   │   ├── oauth.ts          # OAuth Callbacks
│   │   └── ...
│   ├── routers.ts            # tRPC Routes
│   └── db.ts                 # Datenbank
│
├── shared/                    # Geteilter Code
├── drizzle/                  # Datenbank Schema
│
├── .env.example              # Beispiel-Umgebungsvariablen
├── package.json              # Dependencies
├── vite.config.ts            # Vite-Konfiguration
│
└── Dokumentation/
    ├── QUICKSTART.md         # Schnellstart
    ├── DEPLOYMENT.md         # Deployment-Guide
    ├── EMAIL_TEMPLATE_DOCS.md # E-Mail-Doku
    └── CHANGELOG.md          # Changelog
```

---

## 🔐 Discord OAuth Setup

### 1. Discord Developer Portal

Gehe zu: https://discord.com/developers/applications/1493311480269897878

### 2. Redirect URI hinzufügen

OAuth2 → Redirects:
```
https://secnetcheck-xzlirhnw.manus.space/api/oauth/discord/callback
```

### 3. Client Secret kopieren

OAuth2 → Client Secret → Copy → In `.env` einfügen

### 4. Scopes

Bereits konfiguriert:
- `identify` - Basis-Benutzerinfos
- `guilds.members.read` - Guild-Mitgliedschaft
- `guilds` - Guild-Liste

---

## 📧 E-Mail-System

### Automatischer Versand

Bei jedem Kontaktformular-Submit werden **2 E-Mails** versendet:

1. **An Support-Team**
   ```
   An: secure-supp@hotmail.com
   Betreff: Neue Kontaktanfrage: <Betreff>
   Inhalt: Name, E-Mail, Nachricht
   ```

2. **An Kunden (Automatische Bestätigung)**
   ```
   An: <Kunden-E-Mail>
   Betreff: Automatische Bestätigung
   Inhalt: Personalisierte Antwort mit Link
   ```

### E-Mail-Vorlage anpassen

Siehe [EMAIL_TEMPLATE_DOCS.md](EMAIL_TEMPLATE_DOCS.md) für Details.

---

## 🧪 Testing

### Kontaktformular testen
```bash
# 1. Server starten
pnpm dev

# 2. Browser öffnen
http://localhost:5000/contact

# 3. Formular ausfüllen und absenden

# 4. E-Mails prüfen
# - secure-supp@hotmail.com (Support)
# - deine-test@email.com (Automatische Antwort)
```

### Discord Login testen
```bash
# 1. Server starten
pnpm dev

# 2. Browser öffnen
http://localhost:5000

# 3. "Login with Discord" klicken

# 4. App autorisieren

# 5. Zurück zur Homepage
# → Du bist eingeloggt!
```

---

## 🚀 Production Deployment

### Build erstellen
```bash
pnpm build
```

### Server starten
```bash
pnpm start
```

### Umgebungsvariablen

Stelle sicher, dass alle Produktions-Umgebungsvariablen gesetzt sind:
- `NODE_ENV=production`
- `DATABASE_URL=<deine_db>`
- `DISCORD_CLIENT_SECRET=<secret>`
- Etc.

---

## 🐛 Troubleshooting

### E-Mails kommen nicht an?

1. Prüfe `.env` Datei
2. Prüfe Hotmail-Login
3. Schaue Server-Logs: `tail -f logs/server.log`
4. Prüfe Spam-Ordner

### Discord Login funktioniert nicht?

1. Prüfe Discord Developer Portal
2. Redirect URI korrekt?
3. Client Secret in `.env`?
4. Server-Logs prüfen

### Port bereits belegt?

```bash
# Ändere Port in vite.config.ts
# Zeile: server: { port: 5000 }
# → Zu: server: { port: 3000 }
```

---

## 📊 Features Status

| Feature | Status | Dokumentation |
|---------|--------|---------------|
| Homepage | ✅ Fertig | - |
| Pricing | ✅ Fertig | - |
| Kontaktformular | ✅ Fertig | EMAIL_TEMPLATE_DOCS.md |
| E-Mail-Versand | ✅ Fertig | EMAIL_TEMPLATE_DOCS.md |
| Discord Login | ✅ Fertig | DEPLOYMENT.md |
| VIP-Bereich | ✅ Fertig | - |
| Checkout | ✅ Fertig | - |
| Story-Seite | ✅ Fertig | - |

---

## 🤝 Support

### Kontakt

- **E-Mail:** secure-supp@hotmail.com
- **Discord:** https://invitelink.me/securitynetwork

### Häufige Fragen

Siehe [DEPLOYMENT.md](DEPLOYMENT.md) → Troubleshooting Section

---

## 📝 Changelog

Siehe [CHANGELOG.md](CHANGELOG.md) für alle Updates.

**Aktuelle Version:** 1.1.0 (14. April 2026)

---

## 📜 License

MIT License - Siehe LICENSE Datei

---

## 👥 Credits

- **Frontend:** React + Vite + Tailwind
- **Backend:** Express + tRPC
- **UI Components:** shadcn/ui
- **E-Mail:** Nodemailer
- **OAuth:** Discord OAuth2

---

## 🎉 Los geht's!

```bash
pnpm install
pnpm dev
```

Öffne `http://localhost:5000` und viel Spaß! 🚀

---

**Entwickelt mit ❤️ für Security Network**
