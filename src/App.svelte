<script>
  import { onMount } from 'svelte'
  import TrainingDetail from './components/TrainingDetail.svelte'
  import AppSettings from './components/AppSettings.svelte'
  import { saveTrainings, loadTrainings, saveAppSettings, loadAppSettings, exportAllAsJSON, importAllFromJSON } from './storage'

  let trainings = []
  let appSettings = {}
  let currentView = 'list'
  let newTrainingName = ''
  let selectedTraining = null
  let errorMessage = ''
  let successMessage = ''
  let editingTrainingId = null
  let editingTrainingName = ''

  // Lade Trainings und Settings beim App-Start
  onMount(() => {
    trainings = loadTrainings()
    appSettings = loadAppSettings()
  })

  function addTraining() {
    if (newTrainingName.trim()) {
      trainings = [
        ...trainings,
        {
          id: Date.now(),
          name: newTrainingName,
          exercises: [],
          settings: {
            exerciseDuration: 30,
            restBetweenExercises: 15,
            warmupDuration: 10,
            numberOfSets: 1,
            restBetweenSets: 30
          }
        }
      ]
      newTrainingName = ''
      currentView = 'list'
      saveTrainings(trainings)
      showSuccess('Training erstellt!')
    }
  }

  function startEditTraining(trainingId, trainingName) {
    editingTrainingId = trainingId
    editingTrainingName = trainingName
  }

  function saveEditTraining() {
    if (editingTrainingName.trim()) {
      const training = trainings.find(t => t.id === editingTrainingId)
      if (training) {
        training.name = editingTrainingName.trim()
        trainings = trainings
        saveTrainings(trainings)
        showSuccess('Training aktualisiert!')
      }
    }
    editingTrainingId = null
    editingTrainingName = ''
  }

  function cancelEditTraining() {
    editingTrainingId = null
    editingTrainingName = ''
  }

  function duplicateTraining(trainingId) {
    const originalTraining = trainings.find(t => t.id === trainingId)
    if (originalTraining) {
      const duplicatedTraining = {
        id: Date.now(),
        name: originalTraining.name + ' (Kopie)',
        exercises: JSON.parse(JSON.stringify(originalTraining.exercises)),
        settings: JSON.parse(JSON.stringify(originalTraining.settings))
      }
      trainings = [...trainings, duplicatedTraining]
      saveTrainings(trainings)
      showSuccess('Training dupliziert!')
    }
  }

  function viewTraining(training) {
    selectedTraining = training
    currentView = 'detail'
  }

  function goBack() {
    currentView = 'list'
    selectedTraining = null
    saveTrainings(trainings)
  }

  function showCreateTraining() {
    currentView = 'create'
  }

  function openSettings() {
    currentView = 'settings'
  }

  function deleteTraining(id) {
    if (confirm('Training wirklich löschen?')) {
      trainings = trainings.filter((t) => t.id !== id)
      saveTrainings(trainings)
      showSuccess('Training gelöscht!')
    }
  }

  function handleExport() {
    try {
      exportAllAsJSON(trainings, appSettings, 'hiit-data.json')
      showSuccess('Alle Daten exportiert!')
    } catch (e) {
      showError(`Export fehlgeschlagen: ${e.message}`)
    }
  }

  function handleImport(event) {
    const file = event.target.files?.[0]
    if (!file) return

    importAllFromJSON(file)
      .then(({ trainings: importedTrainings, settings: importedSettings }) => {
        trainings = importedTrainings
        appSettings = importedSettings
        saveTrainings(trainings)
        saveAppSettings(appSettings)
        event.target.value = ''
        showSuccess(`${importedTrainings.length} Trainings importiert!`)
      })
      .catch((e) => {
        showError(`Import fehlgeschlagen: ${e.message}`)
        event.target.value = ''
      })
  }

  function handleSettingsUpdate(event) {
    appSettings = event.detail
    saveAppSettings(appSettings)
    showSuccess('Einstellungen gespeichert!')
  }

  function handleSettingsBack() {
    currentView = 'list'
  }

  function showSuccess(message) {
    successMessage = message
    setTimeout(() => {
      successMessage = ''
    }, 3000)
  }

  function showError(message) {
    errorMessage = message
    setTimeout(() => {
      errorMessage = ''
    }, 3000)
  }
</script>

<main>
  <div class="header">
    <h1>HIIT Timer</h1>
    {#if currentView === 'list'}
      <button on:click={openSettings} class="settings-button" title="Einstellungen">
        ⚙️
      </button>
    {/if}
  </div>

  {#if errorMessage}
    <div class="alert alert-error">
      {errorMessage}
    </div>
  {/if}

  {#if successMessage}
    <div class="alert alert-success">
      {successMessage}
    </div>
  {/if}

  {#if currentView === 'list'}
    <div class="trainings-list">
      <div class="action-buttons">
        <button on:click={showCreateTraining} class="btn-primary">
          + Neues Training
        </button>
      </div>

      <div class="import-export-buttons">
        <button on:click={handleExport} class="btn-secondary" disabled={trainings.length === 0 && !appSettings}>
          📥 Exportieren
        </button>
        <label class="btn-secondary import-label">
          📤 Importieren
          <input type="file" accept=".json" on:change={handleImport} hidden />
        </label>
      </div>

      {#if trainings.length === 0}
        <p class="empty">Keine Trainings vorhanden. Erstelle ein neues!</p>
      {:else}
        <ul>
          {#each trainings as training (training.id)}
            <li class="training-list-item">
              {#if editingTrainingId === training.id}
                <div class="edit-training-form">
                  <input
                    type="text"
                    value={editingTrainingName}
                    on:input={(e) => (editingTrainingName = e.target.value)}
                    class="edit-training-input"
                    autofocus
                  />
                  <button on:click={saveEditTraining} class="btn-save">✓</button>
                  <button on:click={cancelEditTraining} class="btn-cancel">✕</button>
                </div>
              {:else}
                <button on:click={() => viewTraining(training)} class="training-item">
                  <span class="training-name">{training.name}</span>
                  <span class="exercise-count">
                    {training.exercises.length} Übungen
                  </span>
                </button>
                <div class="training-actions">
                  <button
                    on:click={() => startEditTraining(training.id, training.name)}
                    class="action-button edit-button"
                    title="Training bearbeiten"
                  >
                    ✏️
                  </button>
                  <button
                    on:click={() => duplicateTraining(training.id)}
                    class="action-button duplicate-button"
                    title="Training duplizieren"
                  >
                    📋
                  </button>
                  <button
                    on:click={() => deleteTraining(training.id)}
                    class="action-button delete-button"
                    title="Training löschen"
                  >
                    🗑️
                  </button>
                </div>
              {/if}
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  {/if}

  {#if currentView === 'create'}
    <div class="form-container">
      <h2>Neues Training erstellen</h2>
      <input
        type="text"
        placeholder="Trainingsnamen eingeben"
        bind:value={newTrainingName}
        class="input"
        autofocus
      />
      <div class="button-group">
        <button on:click={addTraining} class="btn-primary">Erstellen</button>
        <button on:click={goBack} class="btn-secondary">Abbrechen</button>
      </div>
    </div>
  {/if}

  {#if currentView === 'detail' && selectedTraining}
    <TrainingDetail
      training={selectedTraining}
      soundConfig={appSettings.soundConfig}
      on:back={goBack}
      on:update={(e) => {
        trainings = trainings
        saveTrainings(trainings)
      }}
    />
  {/if}

  {#if currentView === 'settings'}
    <AppSettings
      settings={appSettings}
      on:back={handleSettingsBack}
      on:update={handleSettingsUpdate}
    />
  {/if}
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
      sans-serif;
    background: #f5f5f5;
  }

  main {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    min-height: 100vh;
    background: white;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  h1 {
    color: #333;
    margin: 0;
    flex: 1;
    text-align: center;
  }

  h2 {
    color: #333;
  }

  .settings-button {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    padding: 8px;
    border-radius: 6px;
    transition: background 0.2s;
  }

  .settings-button:hover {
    background: #f0f0f0;
  }

  .alert {
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 20px;
    font-size: 14px;
    font-weight: 500;
  }

  .alert-success {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }

  .alert-error {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }

  .trainings-list {
    margin-top: 20px;
  }

  .action-buttons {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
  }

  .import-export-buttons {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }

  .import-export-buttons button,
  .import-export-buttons label {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    background: white;
    color: #333;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .import-export-buttons button:hover:not(:disabled),
  .import-export-buttons label:hover {
    background: #f0f0f0;
    border-color: #999;
  }

  .import-export-buttons button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .import-label {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .empty {
    text-align: center;
    color: #999;
    margin-top: 40px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .training-list-item {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 10px;
  }

  .training-item {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: white;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 16px;
    text-align: left;
  }

  .training-item:hover {
    background: #f9f9f9;
    border-color: #999;
  }

  .training-name {
    font-weight: 500;
    color: #333;
  }

  .exercise-count {
    color: #999;
    font-size: 14px;
  }

  .training-actions {
    display: flex;
    gap: 4px;
  }

  .action-button {
    background: none;
    border: none;
    font-size: 16px;
    cursor: pointer;
    padding: 8px;
    border-radius: 6px;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .edit-button:hover {
    background: #e7f3ff;
    color: #0066cc;
  }

  .duplicate-button:hover {
    background: #fff3e0;
    color: #ff9800;
  }

  .delete-button:hover {
    background: #ffebee;
    color: #dc3545;
  }

  .edit-training-form {
    flex: 1;
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .edit-training-input {
    flex: 1;
    padding: 10px;
    border: 2px solid #0066cc;
    border-radius: 6px;
    font-size: 16px;
    box-sizing: border-box;
  }

  .edit-training-input:focus {
    outline: none;
  }

  .btn-save,
  .btn-cancel {
    background: none;
    border: none;
    font-size: 16px;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 6px;
    transition: all 0.2s;
  }

  .btn-save:hover {
    background: #d4edda;
    color: #155724;
  }

  .btn-cancel:hover {
    background: #f8d7da;
    color: #721c24;
  }

  .form-container {
    margin-top: 20px;
  }

  .input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    box-sizing: border-box;
    margin-bottom: 15px;
  }

  .input:focus {
    outline: none;
    border-color: #0066cc;
  }

  .button-group {
    display: flex;
    gap: 10px;
  }

  .btn-primary,
  .btn-secondary {
    flex: 1;
    padding: 12px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.2s;
    font-weight: 500;
  }

  .btn-primary {
    background: #0066cc;
    color: white;
  }

  .btn-primary:hover {
    background: #0052a3;
  }

  .btn-secondary {
    background: #ddd;
    color: #333;
  }

  .btn-secondary:hover {
    background: #ccc;
  }

  @media (max-width: 600px) {
    main {
      padding: 15px;
    }

    h1 {
      font-size: 24px;
    }

    .header {
      margin-bottom: 15px;
    }

    .action-buttons {
      flex-direction: column;
    }

    .import-export-buttons {
      flex-direction: column;
    }

    .training-item {
      flex-direction: column;
      align-items: flex-start;
    }

    .exercise-count {
      margin-top: 8px;
    }

    .training-actions {
      width: 100%;
      justify-content: flex-end;
      margin-top: 8px;
    }

    .edit-training-form {
      flex-direction: column;
    }

    .edit-training-input {
      width: 100%;
    }
  }
</style>
