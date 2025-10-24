# HIIT Timer - Neue Features

Dokumentation der neu implementierten Funktionen für die HIIT Timer Anwendung.

## Übersicht der Funktionen

### 1. Edit Training Name (Trainingsnamen bearbeiten)
**Datei:** `src/App.svelte`

Ermöglicht das direkte Umbenennen von Trainings in der Trainings-Liste.

#### Funktionsweise:
- **Edit Button (✏️)**: Neben jedem Training wird ein Edit-Button angezeigt
- **Inline Editing**: Klick auf den Button aktiviert einen Bearbeitungsmodus
- **Speichern (✓)**: Speichert den neuen Namen direkt in localStorage
- **Abbrechen (✕)**: Bricht die Bearbeitung ab ohne zu speichern

#### Implementierung:
```javascript
// In App.svelte:
let editingTrainingId = null
let editingTrainingName = ''

function startEditTraining(trainingId, trainingName) {
  editingTrainingId = trainingId
  editingTrainingName = trainingName
}

function saveEditTraining() {
  if (editingTrainingName.trim()) {
    trainings = updateTrainingName(trainings, editingTrainingId, editingTrainingName.trim())
    editingTrainingId = null
    editingTrainingName = ''
    showSuccess('Trainingsnamen aktualisiert!')
  }
}
```

#### Storage Funktion (storage.js):
```javascript
export function updateTrainingName(trainings, trainingId, newName) {
  const updated = trainings.map(t =>
    t.id === trainingId ? { ...t, name: newName } : t
  )
  saveTrainings(updated)
  return updated
}
```

---

### 2. Edit Exercise Names (Übungsnamen bearbeiten)
**Datei:** `src/components/TrainingDetail.svelte`

Ermöglicht das inline Bearbeiten von Übungsnamen.

#### Funktionsweise:
- **Edit Button (✏️)**: Neben jedem Übungsnamen wird ein Edit-Button angezeigt
- **Click to Edit**: Aktiviert den Bearbeitungsmodus für diese Übung
- **Enter/Blur**: Speichert automatisch beim Verlassen des Input-Feldes
- **Speichern (✓)**: Bestätigt die Änderung
- **Abbrechen (✕)**: Verwirft die Änderung

#### Implementierung:
```javascript
// In TrainingDetail.svelte:
let editingExerciseId = null
let editingExerciseName = ''

function startEditExercise(exerciseId, exerciseName) {
  editingExerciseId = exerciseId
  editingExerciseName = exerciseName
}

function saveEditExercise(exerciseId) {
  if (editingExerciseName.trim()) {
    training.exercises = training.exercises.map(ex =>
      ex.id === exerciseId
        ? { ...ex, name: editingExerciseName.trim() }
        : ex
    )
    editingExerciseId = null
    editingExerciseName = ''
    dispatch('update')
  }
}
```

#### Storage Funktion (storage.js):
```javascript
export function updateExerciseName(trainings, trainingId, exerciseId, newName) {
  const updated = trainings.map(t => {
    if (t.id === trainingId) {
      return {
        ...t,
        exercises: t.exercises.map(ex =>
          ex.id === exerciseId ? { ...ex, name: newName } : ex
        )
      }
    }
    return t
  })
  saveTrainings(updated)
  return updated
}
```

---

### 3. Reorder Exercises (Übungen umsortieren)
**Datei:** `src/components/TrainingDetail.svelte`

Ermöglicht das Verschieben von Übungen in der Liste nach oben oder unten.

#### Funktionsweise:
- **Up Button (↑)**: Verschiebt die Übung eine Position nach oben
- **Down Button (↓)**: Verschiebt die Übung eine Position nach unten
- **Disabled State**: Buttons sind deaktiviert wenn nicht verschoben kann (erste/letzte Position)
- **Sofort gespeichert**: Änderungen werden direkt in localStorage gespeichert

#### Implementierung:
```javascript
// In TrainingDetail.svelte:
function handleMoveUp(exerciseId) {
  const index = training.exercises.findIndex(ex => ex.id === exerciseId)
  if (index > 0) {
    const exercises = [...training.exercises]
    [exercises[index - 1], exercises[index]] = [exercises[index], exercises[index - 1]]
    training.exercises = exercises
    dispatch('update')
  }
}

function handleMoveDown(exerciseId) {
  const index = training.exercises.findIndex(ex => ex.id === exerciseId)
  if (index < training.exercises.length - 1) {
    const exercises = [...training.exercises]
    [exercises[index], exercises[index + 1]] = [exercises[index + 1], exercises[index]]
    training.exercises = exercises
    dispatch('update')
  }
}
```

#### Storage Funktionen (storage.js):
```javascript
export function moveExerciseUp(trainings, trainingId, exerciseId) {
  // Findet Training und Übung, vertauscht mit vorheriger
  // Speichert in localStorage
}

export function moveExerciseDown(trainings, trainingId, exerciseId) {
  // Findet Training und Übung, vertauscht mit nächster
  // Speichert in localStorage
}
```

#### Button Design:
- Up/Down Buttons sind nebeneinander angeordnet
- Disabled Buttons haben eine hellere Farbe (#ccc)
- Hover-Effekt zeigt Interaktivität
- Kompakte Icon-Größe (16px)

---

### 4. Duplicate Training (Training duplizieren)
**Datei:** `src/App.svelte`

Erstellt eine vollständige Kopie eines Trainings mit allen Übungen und Einstellungen.

#### Funktionsweise:
- **Duplicate Button (📋)**: Neben jedem Training
- **Automatische Benennung**: Kopie erhält Suffix " (Kopie)" im Namen
- **Vollständige Deep Copy**: Alle Übungen und Einstellungen werden kopiert
- **Neue IDs**: Kopierte Trainings bekommen neue eindeutige IDs
- **Sofort verfügbar**: Das duplizierte Training erscheint in der Liste

#### Implementierung:
```javascript
// In App.svelte:
function handleDuplicateTraining(trainingId) {
  trainings = duplicateTraining(trainings, trainingId, ' (Kopie)')
  showSuccess('Training dupliziert!')
}
```

#### Storage Funktion (storage.js):
```javascript
export function duplicateTraining(trainings, trainingId, suffix = ' (Kopie)') {
  const trainingToDuplicate = trainings.find(t => t.id === trainingId)
  if (!trainingToDuplicate) {
    console.error('Training nicht gefunden:', trainingId)
    return trainings
  }

  // Deep copy des Trainings
  const duplicated = JSON.parse(JSON.stringify(trainingToDuplicate))
  
  // Generiere neue ID und Update Name
  duplicated.id = Date.now() + Math.random()
  duplicated.name = trainingToDuplicate.name + suffix

  // Generiere neue IDs für Übungen
  duplicated.exercises = duplicated.exercises.map(ex => ({
    ...ex,
    id: Date.now() + Math.random()
  }))

  const updated = [...trainings, duplicated]
  saveTrainings(updated)
  return updated
}
```

#### Features:
- **Deep Copy**: JSON.stringify/parse für echte Tiefenkopie
- **ID-Generierung**: Eindeutige neue IDs für Training und Übungen
- **Settings kopiert**: Auch die Trainingseinstellungen werden kopiert
- **Export/Import kompatibel**: Duplizierte Trainings können exportiert werden

---

## Benutzeroberflächen-Verbesserungen

### Button Icons
- ✏️ = Bearbeiten (Edit)
- 🗑 = Löschen (Delete)
- 📋 = Duplizieren (Duplicate)
- ↑ = Nach oben (Move Up)
- ↓ = Nach unten (Move Down)
- ✓ = Speichern (Save)
- ✕ = Abbrechen (Cancel)
- ⚙️ = Einstellungen (Settings)

### Farben und Hover-Effekte
```css
/* Edit Button */
.edit-button:hover {
  background: #e3f2fd;  /* Helles Blau */
  color: #0066cc;       /* Blau */
}

/* Duplicate Button */
.duplicate-button:hover {
  background: #f0f0f0;  /* Hellgrau */
  color: #666;          /* Dunkelgrau */
}

/* Move Up/Down Buttons */
.move-btn:hover:not(:disabled) {
  background: #e8e8e8;  /* Hellgrau */
}

.move-btn:disabled {
  color: #ccc;          /* Hellgrau */
  cursor: not-allowed;
}
```

### Inline Edit Form Styling
```css
.edit-training-form {
  display: flex;
  gap: 8px;
  align-items: center;
  flex: 1;
}

.input-edit {
  flex: 1;
  padding: 10px;
  border: 2px solid #0066cc;  /* Blaue Border */
  border-radius: 6px;
  font-size: 16px;
}

.btn-save {
  color: #28a745;  /* Grün */
}

.btn-save:hover {
  background: #d4edda;  /* Helles Grün */
}

.btn-cancel {
  color: #dc3545;  /* Rot */
}

.btn-cancel:hover {
  background: #f8d7da;  /* Helles Rot */
}
```

---

## Datenspeicherung

Alle Änderungen werden **automatisch** in localStorage gespeichert:

1. **Trainingsnamen**: Wird sofort nach dem Speichern in localStorage gespeichert
2. **Übungsnamen**: Wird sofort nach der Änderung in localStorage gespeichert
3. **Übungsreihenfolge**: Wird sofort nach dem Verschieben in localStorage gespeichert
4. **Duplizierte Trainings**: Werden sofort nach der Erstellung in localStorage gespeichert

### Storage Keys
```javascript
const STORAGE_KEY = 'hiit-trainings'
```

---

## Modifizierte Dateien

### 1. `src/App.svelte`
- **Neue Importe**: `updateTrainingName`, `duplicateTraining` von storage.js
- **Neue Variablen**: `editingTrainingId`, `editingTrainingName`
- **Neue Funktionen**:
  - `startEditTraining(trainingId, trainingName)`
  - `cancelEditTraining()`
  - `saveEditTraining()`
  - `handleDuplicateTraining(trainingId)`
- **UI Änderungen**: Edit (✏️) und Duplicate (📋) Buttons hinzugefügt
- **CSS**: Neue Styles für Edit-Form und Button-Hover-States

### 2. `src/components/TrainingDetail.svelte`
- **Neue Importe**: `updateExerciseName`, `moveExerciseUp`, `moveExerciseDown`, `saveTrainings` von storage.js
- **Neue Variablen**: `editingExerciseId`, `editingExerciseName`
- **Neue Funktionen**:
  - `startEditExercise(exerciseId, exerciseName)`
  - `cancelEditExercise()`
  - `saveEditExercise(exerciseId)`
  - `handleMoveUp(exerciseId)`
  - `handleMoveDown(exerciseId)`
- **UI Änderungen**: Edit (✏️), Move Up (↑), Move Down (↓) Buttons hinzugefügt
- **CSS**: Neue Styles für Exercise-Actions und Edit-Form

### 3. `src/storage.js`
- **Neue Funktionen** (4 neue Export-Funktionen):
  1. `updateTrainingName(trainings, trainingId, newName)` - Trainingsname aktualisieren
  2. `duplicateTraining(trainings, trainingId, suffix)` - Training duplizieren
  3. `updateExerciseName(trainings, trainingId, exerciseId, newName)` - Übungsname aktualisieren
  4. `moveExerciseUp(trainings, trainingId, exerciseId)` - Übung nach oben verschieben
  5. `moveExerciseDown(trainings, trainingId, exerciseId)` - Übung nach unten verschieben

---

## Browser-Kompatibilität

Alle Features nutzen Standard-Web-APIs:
- **localStorage API**: Für Datenpersistierung
- **JSON.stringify/parse**: Für Deep Copy
- **Svelte Reaktivität**: Für UI-Updates
- **CSS Flexbox**: Für Layout

Unterstützte Browser:
- Chrome/Edge (alle modernen Versionen)
- Firefox (alle modernen Versionen)
- Safari (alle modernen Versionen)

---

## Testing Checkliste

### Feature 1: Edit Training Name
- [ ] Edit Button (✏️) wird angezeigt
- [ ] Klick öffnet Edit-Form
- [ ] Enter speichert die Änderung
- [ ] Änderung wird in localStorage gespeichert
- [ ] Nach Refresh ist der neue Name noch da
- [ ] Cancel Button bricht ab ohne zu speichern

### Feature 2: Edit Exercise Names
- [ ] Edit Button (✏️) neben Übungsnamen
- [ ] Klick öffnet Edit-Form mit Fokus auf Input
- [ ] Speichern aktualisiert die Übung
- [ ] Änderung wird in localStorage gespeichert
- [ ] Nach Refresh ist der neue Name noch da

### Feature 3: Reorder Exercises
- [ ] Up Button (↑) ist aktiv wenn nicht erste Übung
- [ ] Up Button (↑) ist disabled wenn erste Übung
- [ ] Down Button (↓) ist aktiv wenn nicht letzte Übung
- [ ] Down Button (↓) ist disabled wenn letzte Übung
- [ ] Übungen werden korrekt vertauscht
- [ ] Reihenfolge wird in localStorage gespeichert

### Feature 4: Duplicate Training
- [ ] Duplicate Button (📋) wird angezeigt
- [ ] Klick auf Button erstellt Kopie
- [ ] Kopie hat " (Kopie)" im Namen
- [ ] Alle Übungen werden kopiert
- [ ] Alle Settings werden kopiert
- [ ] Kopie erscheint in der Trainings-Liste
- [ ] Änderungen an Original beeinflussen nicht die Kopie

---

## Zukünftige Verbesserungen

Mögliche erweiterte Funktionen:
- [ ] Batch-Bearbeitung mehrerer Trainings
- [ ] Versionshistorie / Rückgängig-Button
- [ ] Import-Dialog für Duplikat-Namen
- [ ] Drag & Drop zum Sortieren von Übungen
- [ ] Tastaturkürzel (Strg+Z für Undo, etc.)
- [ ] Bestätigungsdialog beim Löschen

---

## Fehlerbehandlung

Alle Funktionen haben grundlegende Error-Handling:

```javascript
// Bei updateTrainingName
if (editingTrainingName.trim()) {
  trainings = updateTrainingName(trainings, editingTrainingId, editingTrainingName.trim())
}

// Bei duplicateTraining
if (!trainingToDuplicate) {
  console.error('Training nicht gefunden:', trainingId)
  return trainings
}
```

Benutzer-Feedback über Success/Error Alerts:
```javascript
showSuccess('Trainingsnamen aktualisiert!')
showError(`Export fehlgeschlagen: ${e.message}`)
```

---

## Performance-Hinweise

- **Immutability**: Alle Updates verwenden Spread-Operator für neue Arrays/Objekte
- **No DOM Queries**: Verwendet Svelte's reactive Statements
- **Efficient Storage**: Speichert nur beim Speichern, nicht bei jedem Keystroke
- **Deep Copy**: Nutzt JSON.stringify/parse (nicht ideal für sehr große Datenmengen, aber ausreichend)

---

Letzte Aktualisierung: 2025-10-24
