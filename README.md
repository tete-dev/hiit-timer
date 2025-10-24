# HIIT Interval Timer Web App

Ein modernes, mobil-freundliches HIIT (High Intensity Interval Training) Timer als Single-Page Web App, gebaut mit [Svelte](https://svelte.dev) und [Vite](https://vitejs.dev).

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0-green)

## 🎯 Features

### Trainings-Verwaltung
- ✅ Erstelle mehrere individuelle Trainings-Routinen
- ✅ Füge beliebig viele Übungen pro Training hinzu
- ✅ Bearbeite Übungsname und -dauer
- ✅ Lösche Trainings mit Bestätigung

### Timer & Intervalläufigkeit
- ✅ Konfigurierbare Phasen:
  - **Warm-up** vor erster Übung (0-120 Sek.)
  - **Übungsdauer** pro Übung (5-300 Sek.)
  - **Pausen** zwischen Übungen (0-120 Sek.)
  - **Sets** mit separaten Pausen (1-10 Sets)
  - **Set-Pausen** zwischen Trainings-Blöcken (0-300 Sek.)

### Visuelle Feedback
- ✅ Zirkelverlauf-Ring zeigt Phase-Fortschritt (0-100%)
- ✅ Live Countdown-Anzeige (mm:ss Format)
- ✅ Phase-Name und Übungsbezeichnung in Header
- ✅ Übungs-Warteschlange mit aktuellem Status
- ✅ Set-Indikator und Phase-Nummern

### Audio-Signale (Web Audio API)
Drei konfigurierbare Soundsignale per Trainings-Phase:
- 🎯 **Midpoint-Signal**: Ertönt in der Mitte jedes Items
- ⏱️ **Countdown-Signale**: 1x pro Sekunde in letzten 3 Sek.
- ➡️ **Phasenwechsel-Signal**: Wenn Phase wechselt

Verfügbare Sound-Typen: Beep (Hoch/Mittel/Tief), Chime, Bell, Ping, Boop, Ding, Buzz (Kurz/Lang)

### Datenverwaltung
- 💾 **Lokale Persistierung** via Browser LocalStorage
- 📥 **Einheitlicher Export**: Trainings + Sound-Einstellungen als single JSON-Datei
- 📤 **Import**: Wiederherstellung aus JSON (mit Validierung)
- 🔄 **Auto-Save**: Alle Änderungen werden automatisch gespeichert

### Benutzeroberfläche
- 📱 **100% mobil-responsive** (Media Queries, Touch-freundlich)
- 🎨 **Modernes Design** mit Gradient-Hintergrund und Animationen
- ⌨️ **Intuitive Steuerung**: Start, Pause, Resume, Skip, Stop Buttons
- ⚙️ **Settings-Panel** für Sound-Konfiguration pro Signal

---

## 🚀 Schnelleinstieg

### Voraussetzungen
- **Node.js** >= 16.0 (mit npm)
- **Git** (optional)

### Installation & Entwicklung

```bash
# Repository klonen/Verzeichnis öffnen
cd hiit-timer

# Dependencies installieren
npm install

# Development Server starten (Hot Module Reload)
npm run dev

# Im Browser öffnen
# → http://localhost:5173
```

### Production Build
```bash
npm run build

# Output in dist/ Verzeichnis
# Kann auf jedem statischen Host deployed werden
npm run preview  # Local Preview des Build
```

---

## 📂 Projektstruktur

```
hiit-timer/
├── package.json              # Dependencies & Scripts
├── vite.config.js            # Vite Konfiguration
├── index.html                # HTML Entry Point
├── src/
│   ├── main.js               # App Initialisierung
│   ├── App.svelte            # Main App Shell
│   ├── storage.js            # LocalStorage + Import/Export
│   ├── sounds.js             # Web Audio Oscillator Generator
│   └── components/
│       ├── TrainingDetail.svelte  # Trainings Editor + Timer Launch
│       ├── Timer.svelte           # Interval Timer Logik & UI
│       └── AppSettings.svelte     # Sound Config UI
├── dist/                     # Production Build (nach npm run build)
└── node_modules/             # Dependencies
```

---

## 🔧 Technische Architektur

### Technologie-Stack
| Layer | Technologie |
|-------|-------------|
| **Frontend Framework** | Svelte 4 |
| **Build Tool** | Vite 5 |
| **Audio** | Web Audio API (Oscillator) |
| **Persistierung** | Browser LocalStorage + JSON |
| **Bundler** | ESM (type: "module") |
| **Styling** | Scoped CSS |

### Datenmodell

**Training:**
```javascript
{
  id: number,
  name: string,
  exercises: [
    { id: number, name: string },
    ...
  ],
  settings: {
    exerciseDuration: number,        // Sekunden
    restBetweenExercises: number,    // Sekunden
    warmupDuration: number,          // Sekunden
    numberOfSets: number,            // 1-10
    restBetweenSets: number          // Sekunden
  }
}
```

**App-Einstellungen:**
```javascript
{
  soundConfig: {
    midpoint: "beep_high",    // Sound-Typ Name
    countdown: "beep_medium",
    transition: "ding"
  }
}
```

**Export-Format (Unified):**
```json
{
  "meta": {
    "app": "hiit-timer",
    "version": 1,
    "exportedAt": "2025-10-24T13:50:50.000Z"
  },
  "settings": {
    "soundConfig": { ... }
  },
  "trainings": [ ... ]
}
```

### Timer-Phasen-Logik

```
Ausführungsreihenfolge pro Set:
1. Warm-up (wenn duration > 0)
2. Übung 1 → Pause (wenn duration > 0) → Übung 2 → Pause → ...
3. Set-Rest (wenn nicht letztes Set und duration > 0)
4. Wiederhole für nächstes Set

Audio-Trigger pro Phase:
- Midpoint: Bei 50% Fortschritt (1x pro Phase)
- Countdown: Letzte 3 Sekunden (1x pro Sekunde)
- Transition: Am Ende der Phase (Start nächste Phase)
```

### Sound-Generator

Alle Sounds werden in Echtzeit generiert (keine Audio-Dateien):
```javascript
// Beispiel: Beep bei 1000 Hz für 0.2 Sekunden
const oscillator = audioContext.createOscillator()
const gain = audioContext.createGain()
oscillator.frequency.value = 1000
oscillator.connect(gain)
gain.connect(audioContext.destination)
// Exponential decay envelope für "natürlicheren" Sound
gain.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.2)
oscillator.start()
oscillator.stop(currentTime + 0.2)
```

---

## 🎮 Verwendung

### Training erstellen
1. Tippe auf **"+ Neues Training"**
2. Gib einen Namen ein (z.B. "AMRAP Workout")
3. Klicke **"Erstellen"**

### Übungen hinzufügen
1. Klicke auf das Training in der Liste
2. Unter "Übungen" gib einen Namen ein (z.B. "Burpees")
3. Klicke **"+ Übung hinzufügen"**
4. Wiederhole für weitere Übungen

### Einstellungen anpassen
1. Im Training-Detail klicke auf ⚙️
2. Passe Zeiten an (Sekunden):
   - Übungsdauer
   - Pause zwischen Übungen
   - Warm-up
   - Anzahl der Sets
   - Pause zwischen Sets
3. Schließe mit **"Schließen"**

### Timer starten
1. Stelle sicher, dass mindestens 1 Übung vorhanden ist
2. Klicke **"▶ Timer starten"**
3. Kontrolle:
   - ▶ **Start/Weiter**: Timer starten oder fortsetzen
   - ⏸ **Pause**: Pausiert den Timer
   - ⏭ **Skip**: Springt zur nächsten Phase
   - ◼ **Stop**: Setzt den Timer zurück

### Sound-Einstellungen
1. Von der Trainings-Liste, klicke ⚙️ oben rechts
2. Unter "Soundsignale konfigurieren":
   - Wähle Sound-Typ aus Dropdown
   - Klicke ▶ um Vorschau zu hören
3. Unter "Sound-Galerie": Höre alle verfügbaren Sounds
4. Klicke **"← Zurück"** um zu speichern

### Daten exportieren
1. Von der Trainings-Liste, klicke **"📥 Exportieren"**
2. Speichere `hiit-data.json` (enthält: Trainings + Sound-Einstellungen)

### Daten importieren
1. Von der Trainings-Liste, klicke **"📤 Importieren"**
2. Wähle eine `hiit-data.json` Datei
3. Trainings und Einstellungen werden geladen und gespeichert

---

## 🐛 Bekannte Probleme

| Problem | Status | Notizen |
|---------|--------|---------|
| Sound-Änderungen in AppSettings | ✅ **BEHOBEN** (v0.1) | Bind-Direktive auf Array-Destrukturierung funktionierte nicht. Verwendet jetzt `value=` + `on:change` mit direktem Objekt-Zugriff. |
| phaseText Header-Anzeige | ⚠️ **GELÖST** (v0.1) | Wurde nicht synchron aktualisiert. Jetzt wird `phaseText` in `goToNextPhase()` explizit aktualisiert. |

---

## 📊 Performance

| Metrik | Wert |
|--------|------|
| Bundlegröße (Gzip) | ~14.7 kB |
| CSS Größe (Gzip) | ~3.2 kB |
| HTML Größe (Gzip) | ~0.27 kB |
| Development Build-Zeit | < 1.2s |
| Timer-Update Frequenz | 1000ms (1 Sekunde) |

---

## 🔐 Browser-Unterstützung

- ✅ Chrome/Chromium 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile Browsers (iOS Safari, Chrome Android)

**Anforderung:** Web Audio API Support (`AudioContext`)

---

## 📝 Lizenz

MIT License - Siehe LICENSE Datei für Details

---

## 🤝 Beitragen

Dieses Projekt ist in aktiver Entwicklung. Für Fehlerberichte oder Feature-Requests:
1. Erstelle ein GitHub Issue
2. Beschreibe das Problem/Feature detailliert
3. Füge ggf. Screenshots hinzu

---

## 📚 Weitere Ressourcen

- [Svelte Dokumentation](https://svelte.dev/docs)
- [Vite Dokumentation](https://vitejs.dev/)
- [Web Audio API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [LocalStorage MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

---

**Zuletzt aktualisiert**: 2025-10-24  
**Version**: 0.1.0  
**Status**: ✅ Produktionsreif (MVP)
