import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { defaultSettings } from './hooks/useSettings.js'
import './index.css'
import App from './App.jsx'

const STORAGE_KEY = 'capstone1-settings'

function initThemeFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const parsed = JSON.parse(raw)
    const theme = parsed.theme ?? defaultSettings.theme
    if (theme === 'system') {
      document.documentElement.removeAttribute('data-theme')
    } else {
      document.documentElement.setAttribute('data-theme', theme)
    }
  } catch {
    /* ignore invalid stored settings */
  }
}

initThemeFromStorage()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
