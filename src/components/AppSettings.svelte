<script>
  import { createEventDispatcher } from 'svelte'
  import { playSound, getSoundTypesList } from '../sounds'

  export let settings = {}
  
  const dispatch = createEventDispatcher()

  let soundTypesList = getSoundTypesList()

  function updateSoundConfig(key, value) {
    settings.soundConfig[key] = value
    settings = settings // Trigger reactivity
    dispatch('update', settings)
  }

  function playPreviewSound(soundType) {
    playSound(soundType, 0.4)
  }

  function goBack() {
    dispatch('back')
  }
</script>

<div class="app-settings">
  <button on:click={goBack} class="back-button">← Zurück</button>

  <h2>🔊 Sound-Einstellungen</h2>

  <div class="settings-container">
    <div class="setting-group">
      <h3>Soundsignale konfigurieren</h3>
      <p class="subtitle">Wähle für jedes Signal einen Ton aus und klicke auf ▶ um ihn vorzuhören</p>

      {#each Object.entries(settings.soundConfig || {}) as [key, currentValue] (key)}
        <div class="sound-setting">
          <label for="sound-{key}" class="setting-label">
            {#if key === 'midpoint'}
              🎯 Mitte des Timer-Items
            {:else if key === 'countdown'}
              ⏱️ Countdown (letzte 3 Sekunden)
            {:else if key === 'transition'}
              ➡️ Phasenwechsel
            {/if}
          </label>

          <div class="sound-control">
            <select
              id="sound-{key}"
              value={settings.soundConfig[key]}
              on:change={(e) => updateSoundConfig(key, e.target.value)}
              class="sound-select"
            >
              {#each soundTypesList as sound}
                <option value={sound.key}>{sound.name}</option>
              {/each}
            </select>

            <button
              on:click={() => playPreviewSound(settings.soundConfig[key])}
              class="play-button"
              title="Vorschau"
            >
              ▶
            </button>
          </div>

          {#each soundTypesList as sound}
            {#if sound.key === settings.soundConfig[key]}
              <div class="sound-info">
                <span class="freq">🎵 {sound.frequency} Hz</span>
                <span class="duration">⏱️ {sound.duration}s</span>
              </div>
            {/if}
          {/each}
        </div>
      {/each}
    </div>

    <div class="setting-group">
      <h3>Sound-Galerie</h3>
      <p class="subtitle">Alle verfügbaren Sounds zum Testen</p>

      <div class="sound-gallery">
        {#each soundTypesList as sound}
          <div class="sound-card">
            <div class="sound-name">{sound.name}</div>
            <button
              on:click={() => playPreviewSound(sound.key)}
              class="gallery-play-button"
              title={`${sound.frequency} Hz, ${sound.duration}s`}
            >
              ▶
            </button>
            <div class="sound-specs">
              <span class="spec">{sound.frequency} Hz</span>
              <span class="spec">{sound.duration}s</span>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  .app-settings {
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
    margin-bottom: 25px;
  }

  h3 {
    color: #555;
    font-size: 18px;
    margin-top: 0;
    margin-bottom: 10px;
  }

  .subtitle {
    color: #999;
    font-size: 13px;
    margin: 0 0 15px 0;
    font-style: italic;
  }

  .settings-container {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }

  .setting-group {
    background: #f9f9f9;
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 20px;
  }

  .sound-setting {
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;
  }

  .sound-setting:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }

  .setting-label {
    display: block;
    margin-bottom: 10px;
    font-weight: 500;
    color: #333;
    font-size: 14px;
  }

  .sound-control {
    display: flex;
    gap: 10px;
    margin-bottom: 8px;
  }

  .sound-select {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    background: white;
    cursor: pointer;
  }

  .sound-select:focus {
    outline: none;
    border-color: #0066cc;
  }

  .play-button {
    padding: 10px 14px;
    background: #0066cc;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
    transition: background 0.2s;
    font-weight: 600;
  }

  .play-button:hover {
    background: #0052a3;
  }

  .sound-info {
    display: flex;
    gap: 15px;
    font-size: 12px;
    color: #999;
    margin-top: 8px;
  }

  .freq,
  .duration {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .sound-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
  }

  .sound-card {
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 12px;
    text-align: center;
    transition: all 0.2s;
  }

  .sound-card:hover {
    border-color: #0066cc;
    box-shadow: 0 2px 8px rgba(0, 102, 204, 0.1);
  }

  .sound-name {
    font-size: 13px;
    font-weight: 500;
    color: #333;
    margin-bottom: 8px;
    min-height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .gallery-play-button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background: #0066cc;
    color: white;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 8px;
  }

  .gallery-play-button:hover {
    background: #0052a3;
    transform: scale(1.1);
  }

  .sound-specs {
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-size: 11px;
    color: #999;
  }

  .spec {
    display: block;
  }

  @media (max-width: 600px) {
    .app-settings {
      padding: 0;
    }

    .setting-group {
      padding: 15px;
    }

    .sound-gallery {
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    }

    .sound-control {
      flex-direction: column;
    }

    .play-button {
      width: 100%;
    }
  }
</style>
