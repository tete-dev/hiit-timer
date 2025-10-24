# HIIT Timer - Neue Features - Quick Start Guide

## 🎯 Feature-Übersicht

| Feature | Button | Funktion | Wo |
|---------|--------|----------|-----|
| Edit Training Name | ✏️ | Training umbenennen | Trainings-Liste |
| Duplicate Training | 📋 | Training kopieren | Trainings-Liste |
| Delete Training | 🗑 | Training löschen | Trainings-Liste |
| Edit Exercise Name | ✏️ | Übung umbenennen | Training Detail |
| Move Exercise Up | ↑ | Übung nach oben | Training Detail |
| Move Exercise Down | ↓ | Übung nach unten | Training Detail |
| Delete Exercise | 🗑 | Übung löschen | Training Detail |

---

## 📱 Bedienung

### Trainings-Liste (Haupt-Screen)

```
┌─────────────────────────────┐
│ HIIT Timer               ⚙️  │
├─────────────────────────────┤
│ [+ Neues Training]          │
├─────────────────────────────┤
│ [📥 Export] [📤 Import]     │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ Mein Workout      5 Üb. │ ✏️ 📋 🗑 │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ Cardio            3 Üb. │ ✏️ 📋 🗑 │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

**Buttons:**
- **✏️** = Training umbenennen (Inline Edit)
- **📋** = Training duplizieren (inklusive aller Übungen)
- **🗑** = Training löschen

---

### Training Detail (Training Bearbeiten)

```
┌─────────────────────────────┐
│ ← Zurück                    │
│ Mein Workout                │
├─────────────────────────────┤
│            5 Übungen | ⚙️    │
├─────────────────────────────┤
│ Übungen:                    │
│                             │
│ ┌───────────────────────┐   │
│ │ Burpees        30s    │✏️↑↓🗑 │
│ └───────────────────────┘   │
│                             │
│ ┌───────────────────────┐   │
│ │ Liegestütze    30s    │✏️↑↓🗑 │
│ └───────────────────────┘   │
│                             │
│ ┌───────────────────────┐   │
│ │ Kniebeugen     30s    │✏️ ↑🗑 │
│ └───────────────────────┘   │
│                             │
│ [▶ Timer starten]           │
├─────────────────────────────┤
│ [Übungsnamen eingeben    ]  │
│ [+ Übung hinzufügen]        │
└─────────────────────────────┘
```

**Buttons pro Übung:**
- **✏️** = Übung umbenennen
- **↑** = Übung eine Position nach oben
- **↓** = Übung eine Position nach unten  
- **🗑** = Übung löschen

---

## 🔄 Arbeitsablauf - Beispiele

### Szenario 1: Training umbenennen

1. Auf Trainings-Liste gehen
2. ✏️ Button neben dem Training klicken
3. Neuen Namen eingeben
4. ✓ speichern oder ✕ abbrechen
5. ✓ speichert automatisch in localStorage

### Szenario 2: Training duplizieren

1. Auf 📋 Button klicken
2. App erstellt Kopie mit " (Kopie)" Suffix
3. Neue Trainings-Kopie erscheint in Liste
4. Kann unabhängig von Original bearbeitet werden

### Szenario 3: Übung umbenennen

1. Training öffnen
2. Auf ✏️ Button neben Übung klicken
3. Neuen Übungsnamen eingeben
4. ✓ speichern oder ✕ abbrechen
5. Änderung wird sofort gespeichert

### Szenario 4: Übung verschieben

1. Training öffnen
2. Auf ↑ Button klicken um nach oben zu verschieben
   - oder ↓ Button um nach unten zu verschieben
3. Reihenfolge ändert sich sofort
4. Wird automatisch gespeichert

### Szenario 5: Komplettes Training duplizieren und anpassen

1. Existierendes Training öffnen (z.B. "Full Body")
2. Auf Trainings-Liste zurück
3. 📋 Button klicken → "Full Body (Kopie)" wird erstellt
4. "Full Body (Kopie)" öffnen
5. Übungen umbenennen (✏️)
6. Übungen neu sortieren (↑ ↓)
7. Fertig! Zwei unabhängige Trainings-Versionen erstellt

---

## 💾 Datenspeicherung

Alle Änderungen werden **automatisch** in localStorage gespeichert:

✅ Automatisch gespeichert:
- Trainingsnamen
- Übungsnamen  
- Übungsreihenfolge
- Duplizierte Trainings
- Trainingseinstellungen

📥 Export/Import:
```
App.svelte → [📥 Exportieren] → JSON-Datei
App.svelte → [📤 Importieren] → JSON-Datei
```

---

## ⌨️ Tastaturkürzel

| Taste | Aktion |
|-------|--------|
| Enter | Edit-Form speichern |
| Esc | Edit-Form abbrechen |
| Tab | Zum nächsten Element |

---

## 🎨 Farb-Legende

| Farbe | Bedeutung |
|-------|-----------|
| 🔵 Blau (#0066cc) | Haupt-Aktion (Edit, Speichern) |
| 🟢 Grün (#28a745) | Erfolg, Start (Timer) |
| 🔴 Rot (#dc3545) | Danger (Löschen) |
| ⚫ Grau | Neutral, Disabled |

---

## 📋 Checkliste vor dem Release

- [x] Edit Training Name implementiert
- [x] Edit Exercise Names implementiert
- [x] Reorder Exercises implementiert
- [x] Duplicate Training implementiert
- [x] Storage-Funktionen hinzugefügt
- [x] Inline Editing UI implementiert
- [x] Responsive Design für Mobile
- [x] Fehlerbehandlung eingefügt
- [x] Success/Error Messages angezeigt
- [x] localStorage Integration
- [x] Dokumentation erstellt

---

## 🐛 Häufig gestellte Fragen

**F: Wie lange bleiben meine Änderungen gespeichert?**
A: Unbegrenzt! localStorage persistiert solange der Browser die Daten nicht löscht (Cache löschen würde das tun).

**F: Kann ich eine Bearbeitung rückgängig machen?**
A: Aktuell nicht. Browser Back-Button hilft nicht. Undo-Funktion ist auf der Roadmap.

**F: Kann ich ein Training auf dem Handy bearbeiten?**
A: Ja! Alle Features sind responsive und funktionieren auf Mobile.

**F: Was passiert wenn ich ein Training dupliziere?**
A: Alle Übungen und Einstellungen werden kopiert. Die Kopie ist völlig unabhängig vom Original.

**F: Kann ich die Reihenfolge der Trainings ändern?**
A: Aktuell nur über Edit und Speichern. Drag & Drop ist geplant für zukünftige Version.

---

## 🔧 Technische Details

### Neue Storage-Funktionen (storage.js)

```javascript
// Trainingsnamen aktualisieren
updateTrainingName(trainings, trainingId, newName) → trainings

// Training duplizieren (mit Suffix)
duplicateTraining(trainings, trainingId, suffix) → trainings

// Übungsnamen aktualisieren
updateExerciseName(trainings, trainingId, exerciseId, newName) → trainings

// Übung nach oben verschieben
moveExerciseUp(trainings, trainingId, exerciseId) → trainings

// Übung nach unten verschieben
moveExerciseDown(trainings, trainingId, exerciseId) → trainings
```

### Neue Events (Svelte)

```javascript
// In TrainingDetail.svelte
dispatch('update')  // Speichert Training in App.svelte
dispatch('back')    // Geht zurück zur Liste
```

---

## 📊 Data Flow Diagram

```
App.svelte
├─ trainings[] (State)
├─ updateTrainingName() 
│  └─ saveTrainings() → localStorage
├─ duplicateTraining()
│  └─ saveTrainings() → localStorage
└─ TrainingDetail.svelte
   ├─ updateExerciseName()
   │  └─ saveTrainings() → localStorage
   ├─ moveExerciseUp()
   │  └─ saveTrainings() → localStorage
   └─ moveExerciseDown()
      └─ saveTrainings() → localStorage
```

---

## 🚀 Performance

- Alle Operationen sind O(n) oder besser
- localStorage Write ist nur beim Speichern, nicht bei jedem Keystroke
- Deep Copy nutzt JSON (ausreichend für typische Trainings)
- Keine Memory Leaks, ReactiveStone automatisch cleaned up

---

Letzte Aktualisierung: 2025-10-24

Fragen? → Siehe FEATURES.md für detaillierte Dokumentation
