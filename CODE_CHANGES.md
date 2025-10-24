# Code Changes - Detailed Diff

## File 1: src/App.svelte

### Changes in `<script>` section

#### Imports (Line 5)
```diff
  import { saveTrainings, loadTrainings, saveAppSettings, loadAppSettings, exportAllAsJSON, importAllFromJSON } from './storage'
+ import { updateTrainingName, duplicateTraining } from './storage'
```

#### New Variables (Line 13-14)
```diff
  let successMessage = ''
+ let editingTrainingId = null
+ let editingTrainingName = ''
```

#### New Functions (After deleteTraining function)
```javascript
+ function startEditTraining(trainingId, trainingName) {
+   editingTrainingId = trainingId
+   editingTrainingName = trainingName
+ }

+ function cancelEditTraining() {
+   editingTrainingId = null
+   editingTrainingName = ''
+ }

+ function saveEditTraining() {
+   if (editingTrainingName.trim()) {
+     trainings = updateTrainingName(trainings, editingTrainingId, editingTrainingName.trim())
+     editingTrainingId = null
+     editingTrainingName = ''
+     showSuccess('Trainingsnamen aktualisiert!')
+   }
+ }

+ function handleDuplicateTraining(trainingId) {
+   trainings = duplicateTraining(trainings, trainingId, ' (Kopie)')
+   showSuccess('Training dupliziert!')
+ }
```

### Changes in `<template>` section

#### Updated goBack function call (Line 51)
```diff
  function goBack() {
    currentView = 'list'
    selectedTraining = null
+   editingTrainingId = null
    saveTrainings(trainings)
  }
```

#### Updated training list rendering (Line ~158-180)
```diff
- {#each trainings as training (training.id)}
-   <li class="training-list-item">
-     <button on:click={() => viewTraining(training)} class="training-item">
-       <span class="training-name">{training.name}</span>
-       <span class="exercise-count">
-         {training.exercises.length} Übungen
-       </span>
-     </button>
-     <button
-       on:click={() => deleteTraining(training.id)}
-       class="delete-button"
-       title="Training löschen"
-     >
-       🗑
-     </button>
-   </li>
- {/each}

+ {#each trainings as training (training.id)}
+   <li class="training-list-item">
+     {#if editingTrainingId === training.id}
+       <div class="edit-training-form">
+         <input
+           type="text"
+           bind:value={editingTrainingName}
+           class="input-edit"
+           placeholder="Trainingsnamen eingeben"
+           autofocus
+         />
+         <button on:click={saveEditTraining} class="btn-save" title="Speichern">
+           ✓
+         </button>
+         <button on:click={cancelEditTraining} class="btn-cancel" title="Abbrechen">
+           ✕
+         </button>
+       </div>
+     {:else}
+       <button on:click={() => viewTraining(training)} class="training-item">
+         <span class="training-name">{training.name}</span>
+         <span class="exercise-count">
+           {training.exercises.length} Übungen
+         </span>
+       </button>
+       <button
+         on:click={() => startEditTraining(training.id, training.name)}
+         class="edit-button"
+         title="Training umbenennen"
+       >
+         ✏️
+       </button>
+       <button
+         on:click={() => handleDuplicateTraining(training.id)}
+         class="duplicate-button"
+         title="Training duplizieren"
+       >
+         📋
+       </button>
+       <button
+         on:click={() => deleteTraining(training.id)}
+         class="delete-button"
+         title="Training löschen"
+       >
+         🗑
+       </button>
+     {/if}
+   </li>
+ {/each}
```

### Changes in `<style>` section

#### New CSS Classes
```css
+ .edit-training-form {
+   display: flex;
+   gap: 8px;
+   align-items: center;
+   flex: 1;
+ }

+ .input-edit {
+   flex: 1;
+   padding: 10px;
+   border: 2px solid #0066cc;
+   border-radius: 6px;
+   font-size: 16px;
+   box-sizing: border-box;
+ }

+ .input-edit:focus {
+   outline: none;
+   border-color: #0052a3;
+ }

+ .btn-save,
+ .btn-cancel {
+   background: none;
+   border: none;
+   font-size: 18px;
+   cursor: pointer;
+   padding: 8px 12px;
+   border-radius: 6px;
+   transition: all 0.2s;
+   font-weight: bold;
+ }

+ .btn-save {
+   color: #28a745;
+ }

+ .btn-save:hover {
+   background: #d4edda;
+ }

+ .btn-cancel {
+   color: #dc3545;
+ }

+ .btn-cancel:hover {
+   background: #f8d7da;
+ }

+ .edit-button,
+ .duplicate-button {
+   background: none;
+   border: none;
+   font-size: 20px;
+   cursor: pointer;
+   padding: 8px 12px;
+   border-radius: 6px;
+   transition: all 0.2s;
+   color: #999;
+ }

+ .edit-button:hover {
+   background: #e3f2fd;
+   color: #0066cc;
+ }

+ .duplicate-button:hover {
+   background: #f0f0f0;
+   color: #666;
+ }
```

#### Updated Media Query
```diff
  @media (max-width: 600px) {
    /* ... existing styles ... */
    
+   .training-list-item {
+     flex-wrap: wrap;
+   }

+   .edit-training-form {
+     width: 100%;
+     margin-bottom: 10px;
+   }
  }
```

---

## File 2: src/components/TrainingDetail.svelte

### Changes in `<script>` section

#### Imports (Line 1-3)
```diff
  import { createEventDispatcher } from 'svelte'
  import Timer from './Timer.svelte'
+ import { updateExerciseName, moveExerciseUp, moveExerciseDown, saveTrainings } from '../storage'
```

#### New Variables (Line 10-11)
```diff
  let showSettings = false
+ let editingExerciseId = null
+ let editingExerciseName = ''
```

#### New Functions (After deleteExercise function)
```javascript
+ function startEditExercise(exerciseId, exerciseName) {
+   editingExerciseId = exerciseId
+   editingExerciseName = exerciseName
+ }

+ function cancelEditExercise() {
+   editingExerciseId = null
+   editingExerciseName = ''
+ }

+ function saveEditExercise(exerciseId) {
+   if (editingExerciseName.trim()) {
+     training.exercises = training.exercises.map(ex =>
+       ex.id === exerciseId
+         ? { ...ex, name: editingExerciseName.trim() }
+         : ex
+     )
+     editingExerciseId = null
+     editingExerciseName = ''
+     dispatch('update')
+   }
+ }

+ function handleMoveUp(exerciseId) {
+   const index = training.exercises.findIndex(ex => ex.id === exerciseId)
+   if (index > 0) {
+     const exercises = [...training.exercises]
+     [exercises[index - 1], exercises[index]] = [exercises[index], exercises[index - 1]]
+     training.exercises = exercises
+     dispatch('update')
+   }
+ }

+ function handleMoveDown(exerciseId) {
+   const index = training.exercises.findIndex(ex => ex.id === exerciseId)
+   if (index < training.exercises.length - 1) {
+     const exercises = [...training.exercises]
+     [exercises[index], exercises[index + 1]] = [exercises[index + 1], exercises[index]]
+     training.exercises = exercises
+     dispatch('update')
+   }
+ }
```

### Changes in `<template>` section

#### Updated exercises list rendering (Line ~100-140)
```diff
  <ul class="exercises-list">
-   {#each training.exercises as exercise (exercise.id)}
+   {#each training.exercises as exercise, index (exercise.id)}
      <li class="exercise-item">
+       {#if editingExerciseId === exercise.id}
+         <div class="edit-exercise-form">
+           <input
+             type="text"
+             bind:value={editingExerciseName}
+             class="input-edit"
+             placeholder="Übungsnamen eingeben"
+             autofocus
+           />
+           <button
+             on:click={() => saveEditExercise(exercise.id)}
+             class="btn-save"
+             title="Speichern"
+           >
+             ✓
+           </button>
+           <button
+             on:click={cancelEditExercise}
+             class="btn-cancel"
+             title="Abbrechen"
+           >
+             ✕
+           </button>
+         </div>
+       {:else}
-       <div class="exercise-info">
+         <div class="exercise-info">
            <span class="exercise-name">{exercise.name}</span>
            <span class="exercise-duration">{training.settings.exerciseDuration}s</span>
          </div>
-         <button on:click={() => deleteExercise(exercise.id)} class="delete-btn">
-           🗑
-         </button>
+         <div class="exercise-actions">
+           <button
+             on:click={() => startEditExercise(exercise.id, exercise.name)}
+             class="action-btn edit-btn"
+             title="Übung umbenennen"
+           >
+             ✏️
+           </button>
+           <button
+             on:click={() => handleMoveUp(exercise.id)}
+             class="action-btn move-btn"
+             title="Nach oben verschieben"
+             disabled={index === 0}
+           >
+             ↑
+           </button>
+           <button
+             on:click={() => handleMoveDown(exercise.id)}
+             class="action-btn move-btn"
+             title="Nach unten verschieben"
+             disabled={index === training.exercises.length - 1}
+           >
+             ↓
+           </button>
+           <button
+             on:click={() => deleteExercise(exercise.id)}
+             class="delete-btn"
+           >
+             🗑
+           </button>
+         </div>
+       {/if}
      </li>
    {/each}
  </ul>
```

### Changes in `<style>` section

#### Updated exercise-item styling
```diff
  .exercise-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: #f9f9f9;
    border: 1px solid #eee;
    border-radius: 6px;
    margin-bottom: 8px;
+   gap: 10px;
+   flex-wrap: wrap;
  }
```

#### New CSS Classes
```css
+ .edit-exercise-form {
+   display: flex;
+   gap: 8px;
+   align-items: center;
+   width: 100%;
+ }

+ .input-edit {
+   flex: 1;
+   padding: 8px;
+   border: 2px solid #0066cc;
+   border-radius: 6px;
+   font-size: 16px;
+   box-sizing: border-box;
+ }

+ .input-edit:focus {
+   outline: none;
+   border-color: #0052a3;
+ }

+ .btn-save,
+ .btn-cancel {
+   background: none;
+   border: none;
+   font-size: 16px;
+   cursor: pointer;
+   padding: 4px 10px;
+   border-radius: 4px;
+   transition: all 0.2s;
+   font-weight: bold;
+ }

+ .btn-save {
+   color: #28a745;
+ }

+ .btn-save:hover {
+   background: #d4edda;
+ }

+ .btn-cancel {
+   color: #dc3545;
+ }

+ .btn-cancel:hover {
+   background: #f8d7da;
+ }

+ .exercise-actions {
+   display: flex;
+   gap: 4px;
+   align-items: center;
+ }

+ .action-btn,
+ .delete-btn {
+   background: none;
+   border: none;
+   font-size: 16px;
+   cursor: pointer;
+   padding: 4px 8px;
+   border-radius: 4px;
+   transition: all 0.2s;
+   display: flex;
+   align-items: center;
+   justify-content: center;
+   min-width: 28px;
+   height: 28px;
+ }

+ .edit-btn {
+   color: #0066cc;
+ }

+ .edit-btn:hover {
+   background: #e3f2fd;
+ }

+ .move-btn {
+   color: #666;
+ }

+ .move-btn:hover:not(:disabled) {
+   background: #e8e8e8;
+ }

+ .move-btn:disabled {
+   color: #ccc;
+   cursor: not-allowed;
+ }
```

#### Updated delete-btn styling
```diff
- .delete-btn {
-   background: none;
-   border: none;
-   font-size: 18px;
-   cursor: pointer;
-   padding: 0;
-   width: 30px;
-   height: 30px;
-   display: flex;
-   align-items: center;
-   justify-content: center;
- }
+ .delete-btn {
+   color: #999;
+   font-size: 18px;
+ }
  
  .delete-btn:hover {
    background: #ffebee;
+   color: #dc3545;
  }
```

#### Updated Mobile Media Query
```diff
  @media (max-width: 600px) {
    .exercise-item {
      flex-direction: column;
      align-items: flex-start;
    }

    .exercise-info {
      flex-direction: column;
      align-items: flex-start;
+     width: 100%;
      gap: 5px;
    }

+   .exercise-actions {
+     width: 100%;
+     justify-content: flex-end;
+   }

    .summary-info {
      flex-direction: column;
      gap: 10px;
    }
    
+   .edit-exercise-form {
+     flex-direction: column;
+   }

+   .input-edit {
+     width: 100%;
+   }
  }
```

---

## File 3: src/storage.js

### New Functions Added at End of File

#### Function 1: updateTrainingName
```javascript
export function updateTrainingName(trainings, trainingId, newName) {
  const updated = trainings.map(t =>
    t.id === trainingId ? { ...t, name: newName } : t
  )
  saveTrainings(updated)
  return updated
}
```

#### Function 2: duplicateTraining
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

#### Function 3: updateExerciseName
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

#### Function 4: moveExerciseUp
```javascript
export function moveExerciseUp(trainings, trainingId, exerciseId) {
  const updated = trainings.map(t => {
    if (t.id === trainingId) {
      const exercises = [...t.exercises]
      const index = exercises.findIndex(ex => ex.id === exerciseId)
      
      if (index > 0) {
        // Vertausche mit vorheriger Übung
        [exercises[index - 1], exercises[index]] = [exercises[index], exercises[index - 1]]
      }
      
      return { ...t, exercises }
    }
    return t
  })
  saveTrainings(updated)
  return updated
}
```

#### Function 5: moveExerciseDown
```javascript
export function moveExerciseDown(trainings, trainingId, exerciseId) {
  const updated = trainings.map(t => {
    if (t.id === trainingId) {
      const exercises = [...t.exercises]
      const index = exercises.findIndex(ex => ex.id === exerciseId)
      
      if (index < exercises.length - 1) {
        // Vertausche mit nächster Übung
        [exercises[index], exercises[index + 1]] = [exercises[index + 1], exercises[index]]
      }
      
      return { ...t, exercises }
    }
    return t
  })
  saveTrainings(updated)
  return updated
}
```

---

## Summary Statistics

| Metric | Value |
|--------|-------|
| Files Modified | 3 |
| New Functions in storage.js | 5 |
| New CSS Classes | ~15 |
| New Svelte Variables | 4 |
| New Svelte Functions | 9 |
| Total Lines Added | ~350 |
| Breaking Changes | 0 |
| Backward Compatible | ✅ Yes |

---

Generated: 2025-10-24
