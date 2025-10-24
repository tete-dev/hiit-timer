<script>
  import { createEventDispatcher } from 'svelte'
  import Timer from './Timer.svelte'

  export let training
  export let soundConfig = {}

  const dispatch = createEventDispatcher()

  let newExerciseName = ''
  let showTimer = false
  let showSettings = false

  // Stelle sicher, dass settings existieren und alle neuen Felder gesetzt sind
  if (!training.settings) {
    training.settings = {
      exerciseDuration: 30,
      restBetweenExercises: 15,
      warmupDuration: 10,
      numberOfSets: 1,
      restBetweenSets: 30
    }
  } else {
    // Ergänze fehlende neue Settings bei älteren Trainings
    if (!training.settings.numberOfSets) {
      training.settings.numberOfSets = 1
    }
    if (!training.settings.restBetweenSets) {
      training.settings.restBetweenSets = 30
    }
  }

  function addExercise() {
    if (newExerciseName.trim()) {
      training.exercises = [
        ...training.exercises,
        {
          id: Date.now(),
          name: newExerciseName
        }
      ]
      newExerciseName = ''
    }
  }

  function deleteExercise(id) {
    training.exercises = training.exercises.filter((ex) => ex.id !== id)
  }

  function goBack() {
    showSettings = false
    dispatch('back')
  }

  function startTimer() {
    showTimer = true
  }

  function toggleSettings() {
    showSettings = !showSettings
  }
</script>

{#if showTimer}
  <Timer {training} {soundConfig} on:back={() => (showTimer = false)} />
{:else}
  <div class="training-detail">
    <button on:click={goBack} class="back-button">← Zurück</button>

    <h2>{training.name}</h2>

    {#if showSettings}
      <div class="settings-panel">
        <h3>⚙️ Trainings-Einstellungen</h3>

        <div class="setting-item">
          <label for="exercise-duration">
            Übungsdauer (Sekunden)
          </label>
          <input
            id="exercise-duration"
            type="number"
            min="5"
            max="300"
            bind:value={training.settings.exerciseDuration}
            class="input-number"
          />
          <span class="current-value">{training.settings.exerciseDuration}s</span>
        </div>

        <div class="setting-item">
          <label for="rest-between">
            Pause zwischen Übungen (Sekunden)
          </label>
          <input
            id="rest-between"
            type="number"
            min="0"
            max="120"
            bind:value={training.settings.restBetweenExercises}
            class="input-number"
          />
          <span class="current-value">{training.settings.restBetweenExercises}s</span>
        </div>

        <div class="setting-item">
          <label for="warmup">
            Warm-up vor erster Übung (Sekunden)
          </label>
          <input
            id="warmup"
            type="number"
            min="0"
            max="120"
            bind:value={training.settings.warmupDuration}
            class="input-number"
          />
          <span class="current-value">{training.settings.warmupDuration}s</span>
        </div>

        <div class="divider"></div>

        <div class="setting-item">
          <label for="number-of-sets">
            Anzahl der Sets
          </label>
          <input
            id="number-of-sets"
            type="number"
            min="1"
            max="10"
            bind:value={training.settings.numberOfSets}
            class="input-number"
          />
          <span class="current-value">{training.settings.numberOfSets}x</span>
        </div>

        <div class="setting-item">
          <label for="rest-between-sets">
            Pause zwischen Sets (Sekunden)
          </label>
          <input
            id="rest-between-sets"
            type="number"
            min="0"
            max="300"
            bind:value={training.settings.restBetweenSets}
            class="input-number"
          />
          <span class="current-value">{training.settings.restBetweenSets}s</span>
        </div>

        <button on:click={toggleSettings} class="btn-secondary">Schließen</button>
      </div>
    {:else}
      <div class="exercises-section">
        <div class="section-header">
          <h3>Übungen</h3>
          <button on:click={toggleSettings} class="settings-button" title="Einstellungen">
            ⚙️
          </button>
        </div>

        {#if training.exercises.length === 0}
          <p class="empty">Keine Übungen hinzugefügt. Füge die erste Übung hinzu!</p>
        {:else}
          <div class="exercises-summary">
            <p class="summary-info">
              <span class="info-item">
                <strong>{training.exercises.length}</strong> Übungen
              </span>
              <span class="info-item">
                <strong>{training.exercises.length * training.settings.exerciseDuration}</strong>s pro Set
              </span>
              <span class="info-item">
                <strong>{training.settings.numberOfSets}</strong> Set{training.settings.numberOfSets !== 1 ? 's' : ''}
              </span>
              {#if training.settings.warmupDuration > 0}
                <span class="info-item">
                  <strong>{training.settings.warmupDuration}</strong>s Warm-up
                </span>
              {/if}
            </p>

            <ul class="exercises-list">
              {#each training.exercises as exercise (exercise.id)}
                <li class="exercise-item">
                  <div class="exercise-info">
                    <span class="exercise-name">{exercise.name}</span>
                    <span class="exercise-duration">{training.settings.exerciseDuration}s</span>
                  </div>
                  <button on:click={() => deleteExercise(exercise.id)} class="delete-btn">
                    🗑
                  </button>
                </li>
              {/each}
            </ul>
          </div>

          <button on:click={startTimer} class="btn-start-timer">▶ Timer starten</button>
        {/if}

        <div class="add-exercise-form">
          <input
            type="text"
            placeholder="Übungsnamen eingeben"
            bind:value={newExerciseName}
            class="input"
          />
          <button on:click={addExercise} class="btn-primary">+ Übung hinzufügen</button>
        </div>
      </div>
    {/if}
  </div>
{/if}

<style>
  .training-detail {
    animation: slideIn 0.3s ease-out;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .back-button {
    background: none;
    border: none;
    color: #0066cc;
    font-size: 16px;
    cursor: pointer;
    padding: 0;
    margin-bottom: 20px;
  }

  .back-button:hover {
    text-decoration: underline;
  }

  h2 {
    color: #333;
    margin-top: 0;
  }

  h3 {
    color: #555;
    font-size: 18px;
    margin-top: 0;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
  }

  .settings-button {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    transition: background 0.2s;
  }

  .settings-button:hover {
    background: #f0f0f0;
  }

  .settings-panel {
    background: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    margin-top: 20px;
  }

  .setting-item {
    margin-bottom: 20px;
  }

  .setting-item label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #333;
    font-size: 14px;
  }

  .input-number {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 16px;
    box-sizing: border-box;
    margin-bottom: 4px;
  }

  .input-number:focus {
    outline: none;
    border-color: #0066cc;
  }

  .current-value {
    display: inline-block;
    font-size: 12px;
    color: #0066cc;
    font-weight: 600;
  }

  .divider {
    height: 1px;
    background: #ddd;
    margin: 20px 0;
  }

  .empty {
    color: #999;
    font-style: italic;
    margin: 20px 0;
  }

  .exercises-summary {
    margin-top: 20px;
  }

  .summary-info {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    background: #f0f8ff;
    padding: 12px;
    border-radius: 6px;
    margin: 0 0 15px 0;
    color: #333;
    font-size: 14px;
  }

  .info-item {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .info-item strong {
    color: #0066cc;
    font-size: 16px;
  }

  .exercises-list {
    list-style: none;
    padding: 0;
    margin: 0 0 20px 0;
  }

  .exercise-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: #f9f9f9;
    border: 1px solid #eee;
    border-radius: 6px;
    margin-bottom: 8px;
  }

  .exercise-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1;
    gap: 20px;
  }

  .exercise-name {
    font-weight: 500;
    color: #333;
  }

  .exercise-duration {
    color: #0066cc;
    font-weight: 500;
    min-width: 40px;
    text-align: right;
  }

  .delete-btn {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .delete-btn:hover {
    background: #ffebee;
    border-radius: 4px;
  }

  .btn-start-timer {
    width: 100%;
    padding: 14px;
    background: #28a745;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
    margin-bottom: 20px;
  }

  .btn-start-timer:hover {
    background: #218838;
  }

  .add-exercise-form {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .input {
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 16px;
    box-sizing: border-box;
  }

  .input:focus {
    outline: none;
    border-color: #0066cc;
  }

  .btn-primary,
  .btn-secondary {
    padding: 12px;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .btn-primary {
    background: #0066cc;
    color: white;
  }

  .btn-primary:hover {
    background: #0052a3;
  }

  .btn-secondary {
    width: 100%;
    background: #ddd;
    color: #333;
  }

  .btn-secondary:hover {
    background: #ccc;
  }

  @media (max-width: 600px) {
    .exercise-item {
      flex-direction: column;
      align-items: flex-start;
    }

    .exercise-info {
      flex-direction: column;
      align-items: flex-start;
      width: 100%;
      gap: 5px;
    }

    .delete-btn {
      align-self: flex-end;
      margin-top: 10px;
    }

    .summary-info {
      flex-direction: column;
      gap: 10px;
    }
  }
</style>
