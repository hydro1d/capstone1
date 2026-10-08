import { useCallback, useEffect, useState } from 'react'

export const STORAGE_KEY = 'capstone1-settings'

export const defaultSettings = {
  displayName: '',
  email: '',
  emailNotifications: true,
  pushNotifications: false,
  theme: 'system',
}

export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

export function validateSettings(settings) {
  const errors = {}

  if (!settings.displayName || !settings.displayName.trim()) {
    errors.displayName = 'Display name is required.'
  }

  if (!settings.email || !settings.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!isValidEmail(settings.email)) {
    errors.email = 'Please enter a valid email address.'
  }

  return errors
}

export function readStoredSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...defaultSettings }
    return { ...defaultSettings, ...JSON.parse(raw) }
  } catch {
    return { ...defaultSettings }
  }
}

export function applyTheme(theme) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (theme === 'system') {
    root.removeAttribute('data-theme')
  } else {
    root.setAttribute('data-theme', theme)
  }
}

export function useSettings() {
  const [settings, setSettings] = useState(readStoredSettings)
  const [errors, setErrors] = useState({})
  const [statusMessage, setStatusMessage] = useState('')
  const [statusType, setStatusType] = useState('')

  useEffect(() => {
    applyTheme(settings.theme)
  }, [settings.theme])

  const updateField = useCallback((name, value) => {
    setSettings((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => {
      if (!prev[name]) return prev
      const next = { ...prev }
      delete next[name]
      return next
    })
    setStatusMessage('')
    setStatusType('')
  }, [])

  const saveSettings = useCallback(() => {
    const validationErrors = validateSettings(settings)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setStatusMessage('Please fix the errors before saving.')
      setStatusType('error')
      return false
    }

    const sanitizedSettings = {
      ...settings,
      displayName: settings.displayName.trim(),
      email: settings.email.trim(),
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizedSettings))
    } catch {
      /* ignore storage write failures */
    }
    setSettings(sanitizedSettings)
    applyTheme(sanitizedSettings.theme)
    setErrors({})
    setStatusMessage('Settings saved successfully.')
    setStatusType('success')
    return true
  }, [settings])

  const resetSettings = useCallback(() => {
    setSettings({ ...defaultSettings })
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore storage remove failures */
    }
    applyTheme(defaultSettings.theme)
    setErrors({})
    setStatusMessage('Settings reset to defaults.')
    setStatusType('info')
  }, [])

  return {
    settings,
    errors,
    statusMessage,
    statusType,
    updateField,
    saveSettings,
    resetSettings,
    savedMessage: statusMessage,
  }
}
