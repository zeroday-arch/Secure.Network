# ⚡ QUICK START - Security Network

## 🎯 Was du bekommst

✅ **Funktionierendes Kontaktformular** mit automatischen E-Mails  
✅ **Discord Login** für Benutzer  
✅ **VIP-Bereich** für zahlende Kunden  
✅ **Server-Cloning Service** Verkaufsseite  

---

## 🚀 In 5 Minuten starten

### Schritt 1: Download & Entpacken
```bash
# Projekt entpacken
cd security-network-updated
```

### Schritt 2: .env Datei erstellen
```bash
# Kopiere die Beispieldatei
cp .env.example .env

# Öffne mit einem Editor
nano .env
```

**Trage MINDESTENS diese Werte ein:**
```env
# E-Mail (FERTIG - nichts ändern!)
SUPPORT_EMAIL=secure-supp@hotmail.com
SUPPORT_EMAIL_PASSWORD=Networksecurity2112

# Discord - DIESE MUSST DU ERGÄNZEN!
DISCORD_CLIENT_ID=1493311480269897878
DISCORD_CLIENT_SECRET=dein_secret_hier_einfügen
```

💡 **Discord Client Secret holen:**
1. Gehe zu https://discord.com/developers/applications
2. Wähle deine App (ID: 1493311480269897878)
3. Klicke auf "OAuth2"
4. Kopiere "Client Secret"

### Schritt 3: Discord Redirect URI hinzufügen

Gehe zu: https://discord.com/developers/applications/1493311480269897878/oauth2

Füge unter "Redirects" diese URL hinzu:
```
https://secnetcheck-xzlirhnw.manus.space/api/oauth/discord/callback
```

**Speichern nicht vergessen!** 💾

### Schritt 4: Installation
```bash
# Node.js Pakete installieren (dauert 2-3 Minuten)
pnpm install

# Oder mit npm:
npm install
```

### Schritt 5: Starten!
```bash
# Development-Server starten
pnpm dev

# Oder:
npm run dev
```

**Fertig!** 🎉

Öffne im Browser: `http://localhost:5000`

---

## 🧪 Testen ob alles funktioniert

### Test 1: Kontaktformular
1. Gehe zu `http://localhost:5000/contact`
2. Fülle das Formular aus
3. Klicke "Nachricht senden"
4. ✅ Du solltest eine Erfolgsmeldung sehen
5. ✅ Prüfe deine E-Mail - du solltest eine automatische Antwort erhalten

### Test 2: Discord Login
1. Gehe zu `http://localhost:5000`
2. Klicke "Login with Discord"
3. Autorisiere die App
4. ✅ Du wirst zur Seite zurückgeleitet
5. ✅ Du bist jetzt eingeloggt

---

## 📁 Wichtige Dateien

```
security-network-updated/
├── .env                      ← HIER trägst du deine Secrets ein
├── .env.example              ← Beispiel-Datei
├── DEPLOYMENT.md             ← Ausführliche Anleitung
├── EMAIL_TEMPLATE_DOCS.md    ← E-Mail-Template Doku
└── package.json              ← Dependencies
```

---

## ❓ Probleme?

### "pnpm: command not found"
```bash
# Installiere pnpm global
npm install -g pnpm

# Oder nutze npm stattdessen
npm install
npm run dev
```

### "Email sending failed"
- Prüfe ob `.env` Datei existiert
- Prüfe ob `SUPPORT_EMAIL` und `SUPPORT_EMAIL_PASSWORD` richtig sind
- Schaue in die Server-Logs

### "Discord OAuth failed"
- Hast du `DISCORD_CLIENT_SECRET` in `.env` eingetragen?
- Hast du die Redirect URI im Discord Developer Portal hinzugefügt?

### Port 5000 bereits belegt?
```bash
# Ändere den Port in vite.config.ts
# Suche nach "port: 5000" und ändere zu z.B. "port: 3000"
```

---

## 🎓 Nächste Schritte

1. **Lies DEPLOYMENT.md** für detaillierte Informationen
2. **Lies EMAIL_TEMPLATE_DOCS.md** wenn du E-Mail-Vorlagen ändern willst
3. **Konfiguriere VIP-System** wenn du zahlende Kunden hast
4. **Deploy auf Production** Server

---

## 📞 Hilfe bekommen

- **E-Mail:** secure-supp@hotmail.com
- **Discord:** https://invitelink.me/securitynetwork

---

## ✨ Features Übersicht

### Was bereits funktioniert (ohne weitere Konfiguration):
- ✅ Kontaktformular mit E-Mail-Versand
- ✅ Automatische E-Mail-Antworten
- ✅ Homepage mit Preisen
- ✅ Story-Seite
- ✅ Checkout-System

### Was Discord-Konfiguration braucht:
- 🔧 Discord Login
- 🔧 VIP-Bereich
- 🔧 VIP-Status-Prüfung

### Optional (für Fortgeschrittene):
- 🎨 Design anpassen
- 📧 E-Mail-Templates ändern
- 💳 PayPal-Integration erweitern
- 🗄️ Datenbank konfigurieren

---

## 🎉 Das war's!

Nach diesen 5 Schritten läuft deine Seite lokal.

**Viel Spaß!** 🚀

---

**Benötigte Zeit:** ~10 Minuten  
**Schwierigkeitsgrad:** Anfänger ⭐⭐☆☆☆  
**Voraussetzungen:** Node.js installiert
