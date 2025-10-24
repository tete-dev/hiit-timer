/**
 * Sound Generator für HIIT Timer
 * Erstellt verschiedene Signaltöne mit Web Audio API
 */

// Verfügbare Sound-Typen
export const SOUND_TYPES = {
  beep_high: { name: 'Beep Hoch', frequency: 1200, duration: 0.2 },
  beep_medium: { name: 'Beep Mittel', frequency: 800, duration: 0.2 },
  beep_low: { name: 'Beep Tief', frequency: 400, duration: 0.2 },
  chime: { name: 'Chime', frequency: 1000, duration: 0.4, wave: 'sine' },
  bell: { name: 'Glocke', frequency: 1500, duration: 0.5, wave: 'sine' },
  ping: { name: 'Ping', frequency: 2000, duration: 0.15, wave: 'sine' },
  boop: { name: 'Boop', frequency: 600, duration: 0.25, wave: 'sine' },
  ding: { name: 'Ding', frequency: 1100, duration: 0.3, wave: 'sine' },
  buzz_short: { name: 'Buzz Kurz', frequency: 900, duration: 0.1, wave: 'square' },
  buzz_long: { name: 'Buzz Lang', frequency: 800, duration: 0.3, wave: 'square' },
}

// Standard Sound-Konfiguration
export const DEFAULT_SOUND_CONFIG = {
  midpoint: 'beep_medium',      // Mitte des Timer-Items (600Hz)
  countdown: 'beep_high',        // Countdown (1000Hz)
  transition: 'chime'            // Phasenwechsel (1200Hz)
}

/**
 * Spiele einen Sound ab
 * @param {string} soundType - Typ des Sounds (Schlüssel aus SOUND_TYPES)
 * @param {number} volume - Lautstärke (0-1, default: 0.3)
 */
export function playSound(soundType = 'beep_high', volume = 0.3) {
  try {
    const soundConfig = SOUND_TYPES[soundType]
    if (!soundConfig) {
      console.warn(`Sound "${soundType}" nicht gefunden`)
      return
    }

    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    // Sound-Konfiguration
    oscillator.frequency.value = soundConfig.frequency
    oscillator.type = soundConfig.wave || 'sine'
    const duration = soundConfig.duration || 0.2

    // Volume-Envelope
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

    // Sound abspielen
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + duration)
  } catch (e) {
    console.error('Audio-Fehler:', e)
  }
}

/**
 * Spiele einen Sound mit benutzerdefinierten Parametern ab
 * @param {number} frequency - Frequenz in Hz
 * @param {number} duration - Dauer in Sekunden
 * @param {string} type - Waveform-Typ ('sine', 'square', 'sawtooth', 'triangle')
 * @param {number} volume - Lautstärke (0-1)
 */
export function playSoundCustom(frequency = 800, duration = 0.2, type = 'sine', volume = 0.3) {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = frequency
    oscillator.type = type

    gainNode.gain.setValueAtTime(volume, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + duration)
  } catch (e) {
    console.error('Audio-Fehler:', e)
  }
}

/**
 * Konvertiere SOUND_TYPES zu Array für einfachere Iteration
 * @returns {Array} Array von {key, name, frequency, duration}
 */
export function getSoundTypesList() {
  return Object.entries(SOUND_TYPES).map(([key, config]) => ({
    key,
    ...config
  }))
}
