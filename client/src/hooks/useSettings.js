import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'capstone1-settings'

export const defaultSettings = {
  displayName: '',
  email: '',
  emailNotifications: true,
  pushNotifications: false,
  theme: 'system',
}

function readStoredSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...defaultSettings }
    return { ...defaultSettings, ...JSON.parse(raw) }
  } catch {
    return { ...defaultSettings }
  }
}

function applyTheme(theme) {
  const root = document.documentElement
  if (theme === 'system') {
    root.removeAttribute('data-theme')
  } else {
    root.setAttribute('data-theme', theme)
  }
}

export function useSettings() {
  const [settings, setSettings] = useState(readStoredSettings)
  const [savedMessage, setSavedMessage] = useState('')

  useEffect(() => {
    applyTheme(settings.theme)
  }, [settings.theme])

  const updateField = useCallback((name, value) => {
    setSettings((prev) => ({ ...prev, [name]: value }))
    setSavedMessage('')
  }, [])

  const saveSettings = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    applyTheme(settings.theme)
    setSavedMessage('Settings saved.')
  }, [settings])

  const resetSettings = useCallback(() => {
    setSettings({ ...defaultSettings })
    localStorage.removeItem(STORAGE_KEY)
    applyTheme(defaultSettings.theme)
    setSavedMessage('Settings reset to defaults.')
  }, [])

  return {
    settings,
    updateField,
    saveSettings,
    resetSettings,
    savedMessage,
  }
}
