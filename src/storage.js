// LocalStorage Persistierung für HIIT-Trainings und App-Settings
// Unified export/import will include trainings and app settings in one file

import { DEFAULT_SOUND_CONFIG } from './sounds'

const STORAGE_KEY = 'hiit-trainings'
const SETTINGS_STORAGE_KEY = 'hiit-app-settings'

// ==================== TRAININGS ====================

/**
 * Speichere alle Trainings im LocalStorage
 * @param {Array} trainings - Array von Trainings
 */
export function saveTrainings(trainings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trainings))
    console.log('Trainings gespeichert:', trainings.length)
  } catch (e) {
    console.error('Fehler beim Speichern:', e)
  }
}

/**
 * Lade alle Trainings aus dem LocalStorage
 * @returns {Array} Array von Trainings oder []
 */
export function loadTrainings() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      const trainings = JSON.parse(data)
      console.log('Trainings geladen:', trainings.length)
      return trainings
    }
  } catch (e) {
    console.error('Fehler beim Laden:', e)
  }
  return []
}

/**
 * Exportiere Trainings als JSON-Datei
 * @param {Array} trainings - Array von Trainings
 * @param {String} filename - Name der Export-Datei (optional)
 */
export function exportTrainingsAsJSON(trainings, filename = 'hiit-trainings.json') {
  try {
    const dataStr = JSON.stringify(trainings, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    console.log('Trainings exportiert:', filename)
  } catch (e) {
    console.error('Fehler beim Export:', e)
    throw e
  }
}

/**
 * Importiere Trainings aus einer JSON-Datei
 * @param {File} file - Die zu importierende JSON-Datei
 * @returns {Promise<Array>} Promise mit Array von Trainings
 */
export function importTrainingsFromJSON(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('Keine Datei ausgewählt'))
      return
    }

    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      reject(new Error('Bitte wähle eine JSON-Datei'))
      return
    }

    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const trainings = JSON.parse(event.target.result)
        if (!Array.isArray(trainings)) {
          throw new Error('JSON muss ein Array von Trainings sein')
        }
        console.log('Trainings importiert:', trainings.length)
        resolve(trainings)
      } catch (e) {
        reject(new Error(`Fehler beim Importieren: ${e.message}`))
      }
    }

    reader.onerror = () => {
      reject(new Error('Fehler beim Lesen der Datei'))
    }

    reader.readAsText(file)
  })
}

// ==================== APP SETTINGS ====================

/**
 * Speichere App-Settings im LocalStorage
 * @param {Object} settings - App-Settings Objekt
 */
export function saveAppSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
    console.log('App-Settings gespeichert')
  } catch (e) {
    console.error('Fehler beim Speichern der Settings:', e)
  }
}

/**
 * Lade App-Settings aus dem LocalStorage
 * @returns {Object} App-Settings oder Defaults
 */
export function loadAppSettings() {
  try {
    const data = localStorage.getItem(SETTINGS_STORAGE_KEY)
    if (data) {
      const settings = JSON.parse(data)
      console.log('App-Settings geladen')
      return settings
    }
  } catch (e) {
    console.error('Fehler beim Laden der Settings:', e)
  }
  return {
    soundConfig: { ...DEFAULT_SOUND_CONFIG }
  }
}

/**
 * Exportiere App-Settings als JSON-Datei
 * @param {Object} settings - App-Settings
 * @param {String} filename - Name der Export-Datei (optional)
 */
export function exportAppSettingsAsJSON(settings, filename = 'hiit-app-settings.json') {
  try {
    const dataStr = JSON.stringify(settings, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    console.log('App-Settings exportiert:', filename)
  } catch (e) {
    console.error('Fehler beim Export:', e)
    throw e
  }
}

/**
 * Importiere App-Settings aus einer JSON-Datei
 * @param {File} file - Die zu importierende JSON-Datei
 * @returns {Promise<Object>} Promise mit Settings-Objekt
 */
export function importAppSettingsFromJSON(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('Keine Datei ausgewählt'))
      return
    }

    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      reject(new Error('Bitte wähle eine JSON-Datei'))
      return
    }

    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const settings = JSON.parse(event.target.result)
        if (!settings || typeof settings !== 'object') {
          throw new Error('JSON muss ein Settings-Objekt sein')
        }
        console.log('App-Settings importiert')
        resolve(settings)
      } catch (e) {
        reject(new Error(`Fehler beim Importieren: ${e.message}`))
      }
    }

    reader.onerror = () => {
      reject(new Error('Fehler beim Lesen der Datei'))
    }

    reader.readAsText(file)
  })
}

// ==================== UNIFIED EXPORT/IMPORT ====================

/**
 * Exportiere Trainings und App-Settings in einer gemeinsamen JSON-Datei
 * @param {Array} trainings
 * @param {Object} appSettings
 * @param {String} filename
 */
export function exportAllAsJSON(trainings, appSettings, filename = 'hiit-data.json') {
  try {
    const payload = {
      meta: {
        app: 'hiit-timer',
        version: 1,
        exportedAt: new Date().toISOString()
      },
      settings: appSettings || { soundConfig: { ...DEFAULT_SOUND_CONFIG } },
      trainings: trainings || []
    }

    const dataStr = JSON.stringify(payload, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    console.log('Alle Daten exportiert:', filename)
  } catch (e) {
    console.error('Fehler beim Export aller Daten:', e)
    throw e
  }
}

/**
 * Importiere Trainings und App-Settings aus einer gemeinsamen JSON-Datei
 * @param {File} file
 * @returns {Promise<{trainings: Array, settings: Object}>}
 */
export function importAllFromJSON(file) {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('Keine Datei ausgewählt'))
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      return reject(new Error('Bitte wähle eine JSON-Datei'))
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result)
        if (!data || typeof data !== 'object') {
          throw new Error('Ungültiges JSON-Format')
        }
        const imported = {
          trainings: Array.isArray(data.trainings) ? data.trainings : [],
          settings: data.settings && typeof data.settings === 'object' ? data.settings : { soundConfig: { ...DEFAULT_SOUND_CONFIG } }
        }
        console.log('Alle Daten importiert:', imported.trainings.length, 'Trainings')
        resolve(imported)
      } catch (e) {
        reject(new Error(`Fehler beim Importieren: ${e.message}`))
      }
    }
    reader.onerror = () => reject(new Error('Fehler beim Lesen der Datei'))
    reader.readAsText(file)
  })
}

// ==================== HILFSFUNKTIONEN ====================

/**
 * Generiere einen Dateinamen mit Timestamp
 * @returns {String} Dateinamen mit Format: hiit-trainings-YYYY-MM-DD-HHmmss.json
 */
export function generateExportFilename() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  
  return `hiit-trainings-${year}-${month}-${day}-${hours}${minutes}${seconds}.json`
}

/**
 * Generiere einen Dateinamen mit Timestamp für Settings
 * @returns {String} Dateinamen mit Format: hiit-app-settings-YYYY-MM-DD-HHmmss.json
 */
export function generateSettingsExportFilename() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  
  return `hiit-app-settings-${year}-${month}-${day}-${hours}${minutes}${seconds}.json`
}

/**
 * Generiere einen Dateinamen mit Timestamp für unified export
 * @returns {String} Dateinamen mit Format: hiit-data-YYYY-MM-DD-HHmmss.json
 */
export function generateUnifiedExportFilename() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  
  return `hiit-data-${year}-${month}-${day}-${hours}${minutes}${seconds}.json`
}
