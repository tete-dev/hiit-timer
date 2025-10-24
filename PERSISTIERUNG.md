# Persistierung von Trainings - Implementierungsvorschläge

## Option 1: LocalStorage (🌟 Empfohlen - Einfach & Schnell)

### Vorteile:
- ✅ Keine Backend nötig
- ✅ Daten bleiben im Browser lokal
- ✅ Einfach zu implementieren
- ✅ Schneller Zugriff
- ✅ Funktioniert offline

### Nachteile:
- ❌ Nur pro Browser/Gerät (nicht über Devices hinweg)
- ❌ Begrenzte Speichergröße (~5-10MB)
- ❌ Gelöscht wenn Browser-Daten geleert werden

### Implementierung:
```javascript
// Speichern
localStorage.setItem('hiit-trainings', JSON.stringify(trainings))

// Laden
trainings = JSON.parse(localStorage.getItem('hiit-trainings')) || []
```

### Komplexität: ⭐ Niedrig
### Zeitaufwand: ~30-45 Minuten

---

## Option 2: IndexedDB (Besser für viele Daten)

### Vorteile:
- ✅ Größere Speicherkapazität (GB+)
- ✅ Strukturierte Abfragen möglich
- ✅ Asynchron (blockiert nicht)
- ✅ Transaktionen/Integrität

### Nachteile:
- ❌ Komplexere API
- ❌ Mehr Code nötig
- ❌ Browser-spezifisch

### Komplexität: ⭐⭐⭐ Mittel
### Zeitaufwand: ~2-3 Stunden

### Empfohlene Library: `idb` (vereinfacht die API)

---

## Option 3: Cloud-Backend (Firebase, Supabase, etc.)

### Vorteile:
- ✅ Daten überall verfügbar
- ✅ Multi-Device Sync
- ✅ Backup/Datensicherheit
- ✅ Sharing von Trainings möglich

### Nachteile:
- ❌ Externe Abhängigkeit
- ❌ Kosten möglich
- ❌ Authentifizierung nötig
- ❌ Komplexer zu implementieren

### Komplexität: ⭐⭐⭐⭐ Hoch
### Zeitaufwand: ~4-6 Stunden

---

## Option 4: Import/Export als JSON (Hybrid-Lösung)

### Vorteile:
- ✅ Benutzer hat Kontrolle
- ✅ Backup möglich
- ✅ Datenaustausch möglich
- ✅ Kann mit Option 1+2 kombiniert werden

### Nachteile:
- ❌ Manuelle Verwaltung
- ❌ Kein automatisches Backup

### Komplexität: ⭐⭐ Niedrig
### Zeitaufwand: ~45-60 Minuten

---

## 🎯 Meine Empfehlung

### Phase 1 (Schnell & Praktisch):
**LocalStorage + Import/Export**
- LocalStorage für Auto-Save während des Trainings
- Import/Export Buttons für Backup & Sharing
- **Schnell umzusetzen, sofort hilfreich**

### Phase 2 (Später, wenn gewünscht):
**IndexedDB + Cloud-Sync**
- Ersetze LocalStorage durch IndexedDB
- Optional: Cloud-Backend für Multi-Device

---

## Technische Details für LocalStorage-Lösung

### Zu speichernde Daten:
```javascript
{
  id: number
  name: string
  exercises: [{ id, name }]
  settings: { 
    exerciseDuration, 
    restBetweenExercises, 
    warmupDuration,
    numberOfSets,
    restBetweenSets
  }
}
```

### Funktionen nötig:
1. `saveTrainings()` - Trainings zu LocalStorage speichern
2. `loadTrainings()` - Beim App-Start laden
3. `deleteTraining(id)` - Training löschen
4. `exportAsJSON()` - Download JSON-Datei
5. `importFromJSON()` - Upload JSON-Datei

### UI-Änderungen:
- "Löschen" Button in Trainings-Liste
- "Exportieren" & "Importieren" Buttons
- Auto-Save Indikator (optional)

---

## Welche Option möchtest du implementieren?

1. **LocalStorage + Import/Export** (empfohlen für Start)
2. **Nur LocalStorage** (minimalistisch)
3. **IndexedDB** (für Skalierbarkeit)
4. **Warte auf Firebase/Backend** (später)
