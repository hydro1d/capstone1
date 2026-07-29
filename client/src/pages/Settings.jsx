import { useSettings } from '../hooks/useSettings'
import './Settings.css'

function Settings() {
  const {
    settings,
    updateField,
    saveSettings,
    resetSettings,
    savedMessage,
  } = useSettings()

  function handleSubmit(event) {
    event.preventDefault()
    saveSettings()
  }

  return (
    <div className="settings">
      <header className="settings-header">
        <h1>Settings</h1>
        <p>Update your profile and app preferences. Changes are stored in this browser.</p>
      </header>

      <form className="settings-form" onSubmit={handleSubmit} noValidate>
        <fieldset className="settings-section">
          <legend>Profile</legend>
          <div className="settings-field">
            <label htmlFor="displayName">Display name</label>
            <input
              id="displayName"
              name="displayName"
              type="text"
              autoComplete="name"
              value={settings.displayName}
              onChange={(e) => updateField('displayName', e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div className="settings-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={settings.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="you@example.com"
            />
          </div>
        </fieldset>

        <fieldset className="settings-section">
          <legend>Notifications</legend>
          <label className="settings-check">
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) =>
                updateField('emailNotifications', e.target.checked)
              }
            />
            <span>Email notifications</span>
          </label>
          <label className="settings-check">
            <input
              type="checkbox"
              checked={settings.pushNotifications}
              onChange={(e) =>
                updateField('pushNotifications', e.target.checked)
              }
            />
            <span>Push notifications</span>
          </label>
        </fieldset>

        <fieldset className="settings-section">
          <legend>Appearance</legend>
          <div className="settings-field">
            <label htmlFor="theme">Theme</label>
            <select
              id="theme"
              name="theme"
              value={settings.theme}
              onChange={(e) => updateField('theme', e.target.value)}
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </fieldset>

        <div className="settings-actions">
          <button type="submit" className="settings-btn settings-btn-primary">
            Save changes
          </button>
          <button
            type="button"
            className="settings-btn settings-btn-secondary"
            onClick={resetSettings}
          >
            Reset defaults
          </button>
        </div>

        {savedMessage ? (
          <p className="settings-status" role="status">
            {savedMessage}
          </p>
        ) : null}
      </form>
    </div>
  )
}

export default Settings
