<script>
  import { createEventDispatcher, onDestroy } from 'svelte'
  import { playSound } from '../sounds'

  export let training
  export let soundConfig = {}

  const dispatch = createEventDispatcher()

  let exercises = training.exercises
  let settings = training.settings

  // Stelle sicher, dass Settings existieren
  if (!settings.numberOfSets) settings.numberOfSets = 1
  if (!settings.restBetweenSets) settings.restBetweenSets = 0

  // Timer-Status
  let currentPhase = settings.warmupDuration > 0 ? 'warmup' : 'exercise'
  let currentExerciseIndex = 0
  let currentSetIndex = 0
  let remainingTime = settings.warmupDuration > 0 ? settings.warmupDuration : settings.exerciseDuration
  let isRunning = false
  let isPaused = false
  let timerInterval
  let midpointSoundPlayed = false
  let phaseText = ''

  $: currentExercise = exercises[currentExerciseIndex]
  $: progress = calculateProgress()
  
  // Berechne phaseText basierend auf currentPhase und currentExerciseIndex
  $: phaseText = updatePhaseText()

  function updatePhaseText() {
    if (currentPhase === 'warmup') {
      return 'Warm-up'
    } else if (currentPhase === 'exercise') {
      if (currentExercise && currentExercise.name) {
        return currentExercise.name
      }
      return 'Übung'
    } else if (currentPhase === 'rest') {
      return 'Pause'
    } else if (currentPhase === 'set-rest') {
      return 'Set-Pause'
    } else if (currentPhase === 'finished') {
      return 'Training beendet'
    }
    return 'Training'
  }

  function calculateProgress() {
    let totalTime = 0
    let elapsed = 0
    
    switch (currentPhase) {
      case 'warmup':
        totalTime = settings.warmupDuration
        elapsed = settings.warmupDuration - remainingTime
        break
      case 'exercise':
        totalTime = settings.exerciseDuration
        elapsed = settings.exerciseDuration - remainingTime
        break
      case 'rest':
        totalTime = settings.restBetweenExercises
        elapsed = settings.restBetweenExercises - remainingTime
        break
      case 'set-rest':
        totalTime = settings.restBetweenSets
        elapsed = settings.restBetweenSets - remainingTime
        break
    }
    
    if (totalTime === 0) return 0
    return (elapsed / totalTime) * 100
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  function getPhaseNumber() {
    let phaseCount = 0
    
    if (settings.warmupDuration > 0) {
      if (currentPhase === 'warmup') return 1
      phaseCount = 1
    }
    
    if (currentPhase === 'exercise') {
      return phaseCount + currentExerciseIndex + 1
    }
    
    if (currentPhase === 'rest') {
      return phaseCount + currentExerciseIndex + 1
    }
    
    if (currentPhase === 'set-rest') {
      return phaseCount + exercises.length + (settings.restBetweenExercises > 0 ? exercises.length - 1 : 0) + currentSetIndex
    }
    
    return phaseCount + 1
  }

  function getTotalPhases() {
    let total = exercises.length * settings.numberOfSets
    if (settings.warmupDuration > 0) total++
    
    // Pausen zwischen Übungen (pro Set)
    if (settings.restBetweenExercises > 0) {
      total += (exercises.length - 1) * settings.numberOfSets
    }
    
    // Pausen zwischen Sets
    if (settings.restBetweenSets > 0 && settings.numberOfSets > 1) {
      total += settings.numberOfSets - 1
    }
    
    return total
  }

  function getCurrentPhaseTime() {
    switch (currentPhase) {
      case 'warmup':
        return settings.warmupDuration
      case 'exercise':
        return settings.exerciseDuration
      case 'rest':
        return settings.restBetweenExercises
      case 'set-rest':
        return settings.restBetweenSets
      default:
        return 0
    }
  }

  function startTimer() {
    isRunning = true
    isPaused = false
    midpointSoundPlayed = false

    timerInterval = setInterval(() => {
      // ✅ DEZREMENT ZUERST, dann Sound-Prüfung mit korrektem Wert
      remainingTime--
      
      if (remainingTime >= 0) {
        let totalTime = getCurrentPhaseTime()
        let midpoint = Math.round(totalTime / 2)
        
        // Midpoint: Sollte bei genau Hälfte der Zeit sein
        // Nach Dekrement sollte remainingTime gleich midpoint sein
        if (remainingTime === midpoint && !midpointSoundPlayed) {
          playMidpointBeep()
          midpointSoundPlayed = true
        }

        // Countdown: In den letzten 3 Sekunden (3, 2, 1)
        if (remainingTime <= 2 && remainingTime >= 0) {
          playCountdownBeep()
        }
      }
      
      // Wenn Zeit aufgebraucht, gehe zur nächsten Phase
      if (remainingTime < 0) {
        goToNextPhase()
      }
    }, 1000)
  }

  function goToNextPhase() {
    playPhaseTransitionSound()
    midpointSoundPlayed = false

    if (currentPhase === 'warmup') {
      currentPhase = 'exercise'
      currentExerciseIndex = 0
      currentSetIndex = 0
      remainingTime = settings.exerciseDuration
    } else if (currentPhase === 'exercise') {
      if (currentExerciseIndex < exercises.length - 1 && settings.restBetweenExercises > 0) {
        currentPhase = 'rest'
        remainingTime = settings.restBetweenExercises
      } else if (currentExerciseIndex < exercises.length - 1) {
        currentExerciseIndex++
        currentPhase = 'exercise'
        remainingTime = settings.exerciseDuration
      } else {
        // Letztes Übung in diesem Set abgeschlossen
        if (currentSetIndex < settings.numberOfSets - 1 && settings.restBetweenSets > 0) {
          // Gehe zur Set-Pause
          currentPhase = 'set-rest'
          remainingTime = settings.restBetweenSets
        } else if (currentSetIndex < settings.numberOfSets - 1) {
          // Kein Set-Rest, gehe direkt zum nächsten Set
          currentSetIndex++
          currentExerciseIndex = 0
          currentPhase = 'exercise'
          remainingTime = settings.exerciseDuration
        } else {
          // Training beendet
          currentPhase = 'finished'
          remainingTime = 0
          isRunning = false
          clearInterval(timerInterval)
          setTimeout(() => {
            finishTraining()
          }, 1000)
        }
      }
    } else if (currentPhase === 'rest') {
      currentExerciseIndex++
      currentPhase = 'exercise'
      remainingTime = settings.exerciseDuration
    } else if (currentPhase === 'set-rest') {
      // Nach Set-Pause zum nächsten Set
      currentSetIndex++
      currentExerciseIndex = 0
      currentPhase = 'exercise'
      remainingTime = settings.exerciseDuration
    }
    
    // Aktualisiere phaseText synchron nach Phase-Wechsel
    phaseText = updatePhaseText()
  }

  function pauseTimer() {
    isRunning = false
    isPaused = true
    clearInterval(timerInterval)
  }

  function resumeTimer() {
    isRunning = true
    isPaused = false
    startTimer()
  }

  function stopTimer() {
    isRunning = false
    isPaused = false
    clearInterval(timerInterval)
    currentPhase = settings.warmupDuration > 0 ? 'warmup' : 'exercise'
    currentExerciseIndex = 0
    currentSetIndex = 0
    remainingTime = settings.warmupDuration > 0 ? settings.warmupDuration : settings.exerciseDuration
    midpointSoundPlayed = false
  }

  function skipPhase() {
    goToNextPhase()
  }

  function playMidpointBeep() {
    playSound(soundConfig.midpoint || 'beep_medium', 0.3)
  }

  function playCountdownBeep() {
    playSound(soundConfig.countdown || 'beep_high', 0.25)
  }

  function playPhaseTransitionSound() {
    playSound(soundConfig.transition || 'chime', 0.3)
  }

  function finishTraining() {
    dispatch('back')
  }

  onDestroy(() => {
    clearInterval(timerInterval)
  })
</script>

<div class="timer-container">
  <button on:click={() => dispatch('back')} class="close-button">✕</button>

  <div class="exercise-display">
    <h1 class="exercise-name">{phaseText}</h1>
    <div class="timer-circle">
      <svg viewBox="0 0 100 100" class="progress-ring">
        <circle cx="50" cy="50" r="45" class="progress-ring-background" />
        <circle
          cx="50"
          cy="50"
          r="45"
          class="progress-ring-fill"
          style="stroke-dashoffset: {282.7 * (1 - progress / 100)}"
        />
      </svg>
      <div class="time-display">
        <span class="time">{formatTime(remainingTime)}</span>
      </div>
    </div>

    <div class="exercise-counter">
      <span class="current">{getPhaseNumber()}</span>
      <span class="total">/ {getTotalPhases()}</span>
      {#if settings.numberOfSets > 1}
        <span class="set-counter">| Set {currentSetIndex + 1}/{settings.numberOfSets}</span>
      {/if}
    </div>
  </div>

  <div class="exercises-queue">
    <h3>Ablauf</h3>
    <ul class="queue-list">
      {#if settings.warmupDuration > 0}
        <li
          class:active={currentPhase === 'warmup'}
          class:completed={currentPhase !== 'warmup'}
        >
          <span class="queue-index">W</span>
          <span class="queue-name">Warm-up</span>
          <span class="queue-time">{settings.warmupDuration}s</span>
        </li>
      {/if}

      {#each exercises as exercise, index}
        <li
          class:active={currentPhase === 'exercise' && index === currentExerciseIndex}
          class:completed={index < currentExerciseIndex}
        >
          <span class="queue-index">{index + 1}</span>
          <span class="queue-name">{exercise.name}</span>
          <span class="queue-time">{settings.exerciseDuration}s</span>
        </li>

        {#if index < exercises.length - 1 && settings.restBetweenExercises > 0}
          <li
            class:active={currentPhase === 'rest' && index === currentExerciseIndex}
            class:completed={index < currentExerciseIndex}
            class:rest-phase={true}
          >
            <span class="queue-index">⏸</span>
            <span class="queue-name">Pause</span>
            <span class="queue-time">{settings.restBetweenExercises}s</span>
          </li>
        {/if}
      {/each}

      {#if settings.numberOfSets > 1 && settings.restBetweenSets > 0}
        <li
          class:active={currentPhase === 'set-rest'}
          class:set-rest-item={true}
        >
          <span class="queue-index">S</span>
          <span class="queue-name">Set-Pause</span>
          <span class="queue-time">{settings.restBetweenSets}s</span>
        </li>
      {/if}
    </ul>
  </div>

  <div class="controls">
    {#if !isRunning && !isPaused}
      <button on:click={startTimer} class="btn btn-start">▶ Start</button>
      <button on:click={stopTimer} class="btn btn-stop">◼ Zurücksetzen</button>
    {:else if isRunning}
      <button on:click={pauseTimer} class="btn btn-pause">⏸ Pause</button>
      <button on:click={skipPhase} class="btn btn-skip">⏭ Skip</button>
      <button on:click={stopTimer} class="btn btn-stop">◼ Stopp</button>
    {:else if isPaused}
      <button on:click={resumeTimer} class="btn btn-start">▶ Weiter</button>
      <button on:click={stopTimer} class="btn btn-stop">◼ Stopp</button>
    {/if}
  </div>
</div>

<style>
  .timer-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    color: white;
    animation: fadeIn 0.3s ease-out;
    z-index: 1000;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .close-button {
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(255, 255, 255, 0.2);
    border: 2px solid white;
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 24px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .close-button:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  .exercise-display {
    text-align: center;
    margin-bottom: 30px;
  }

  .exercise-name {
    font-size: 32px;
    margin: 0 0 20px 0;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  }

  .timer-circle {
    position: relative;
    width: 200px;
    height: 200px;
    margin: 0 auto 20px;
  }

  .progress-ring {
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
  }

  .progress-ring-background {
    fill: none;
    stroke: rgba(255, 255, 255, 0.3);
    stroke-width: 4;
  }

  .progress-ring-fill {
    fill: none;
    stroke: white;
    stroke-width: 4;
    stroke-dasharray: 282.7;
    stroke-dashoffset: 282.7;
    transition: stroke-dashoffset 0.1s linear;
    stroke-linecap: round;
  }

  .time-display {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .time {
    font-size: 56px;
    font-weight: bold;
    line-height: 1;
    letter-spacing: 2px;
  }

  .exercise-counter {
    font-size: 18px;
    opacity: 0.9;
  }

  .current {
    font-weight: bold;
    font-size: 20px;
  }

  .set-counter {
    margin-left: 10px;
    font-size: 16px;
    opacity: 0.8;
  }

  .exercises-queue {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    padding: 15px;
    width: 100%;
    max-width: 400px;
    max-height: 200px;
    overflow-y: auto;
    margin-bottom: 20px;
  }

  .exercises-queue h3 {
    margin: 0 0 10px 0;
    font-size: 14px;
    opacity: 0.9;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .queue-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .queue-list li {
    display: flex;
    align-items: center;
    padding: 8px;
    border-radius: 6px;
    font-size: 14px;
    transition: all 0.2s;
    opacity: 0.7;
  }

  .queue-list li.active {
    background: rgba(255, 255, 255, 0.25);
    opacity: 1;
    font-weight: bold;
  }

  .queue-list li.completed {
    opacity: 0.4;
    text-decoration: line-through;
  }

  .queue-list li.rest-phase {
    opacity: 0.6;
    font-style: italic;
  }

  .queue-list li.set-rest-item {
    opacity: 0.6;
    font-style: italic;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    margin-top: 4px;
    padding-top: 12px;
  }

  .queue-index {
    min-width: 24px;
    height: 24px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 8px;
    font-size: 12px;
  }

  .queue-list li.active .queue-index {
    background: white;
    color: #667eea;
  }

  .queue-name {
    flex: 1;
  }

  .queue-time {
    font-size: 12px;
    opacity: 0.8;
  }

  .controls {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
    max-width: 400px;
  }

  .btn {
    flex: 1;
    min-width: 80px;
    padding: 12px 16px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .btn-start {
    background: #28a745;
    color: white;
  }

  .btn-start:hover {
    background: #218838;
    transform: scale(1.05);
  }

  .btn-pause {
    background: #ffc107;
    color: #333;
  }

  .btn-pause:hover {
    background: #e0a800;
  }

  .btn-skip {
    background: #17a2b8;
    color: white;
  }

  .btn-skip:hover {
    background: #138496;
  }

  .btn-stop {
    background: #dc3545;
    color: white;
  }

  .btn-stop:hover {
    background: #c82333;
  }

  @media (max-width: 600px) {
    .timer-container {
      padding: 15px;
    }

    .exercise-name {
      font-size: 24px;
      margin-bottom: 15px;
    }

    .timer-circle {
      width: 150px;
      height: 150px;
      margin-bottom: 15px;
    }

    .time {
      font-size: 44px;
    }

    .set-counter {
      display: block;
      margin-left: 0;
      margin-top: 5px;
    }

    .exercises-queue {
      max-height: 150px;
      padding: 12px;
    }

    .controls {
      gap: 8px;
    }

    .btn {
      min-width: 70px;
      padding: 10px 12px;
      font-size: 12px;
    }
  }
</style>
