import { useSettings } from '../hooks/useSettings'
import './Settings.css'

function Settings() {
  const {
    settings,
    errors,
    statusMessage,
    statusType,
    updateField,
    saveSettings,
    resetSettings,
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
              aria-invalid={Boolean(errors.displayName)}
              aria-describedby={errors.displayName ? 'displayName-error' : undefined}
            />
            {errors.displayName ? (
              <div id="displayName-error" className="settings-field-error" role="alert">
                <span className="settings-error-icon" aria-hidden="true">
                  ⚠
                </span>
                <span>{errors.displayName}</span>
              </div>
            ) : null}
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
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email ? (
              <div id="email-error" className="settings-field-error" role="alert">
                <span className="settings-error-icon" aria-hidden="true">
                  ⚠
                </span>
                <span>{errors.email}</span>
              </div>
            ) : null}
          </div>
        </fieldset>

        <fieldset className="settings-section">
          <legend>Notifications</legend>
          <div className="settings-check-wrapper">
            <input
              id="emailNotifications"
              name="emailNotifications"
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) =>
                updateField('emailNotifications', e.target.checked)
              }
            />
            <label htmlFor="emailNotifications" className="settings-check-label">
              Email notifications
            </label>
          </div>
          <div className="settings-check-wrapper">
            <input
              id="pushNotifications"
              name="pushNotifications"
              type="checkbox"
              checked={settings.pushNotifications}
              onChange={(e) =>
                updateField('pushNotifications', e.target.checked)
              }
            />
            <label htmlFor="pushNotifications" className="settings-check-label">
              Push notifications
            </label>
          </div>
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

        {statusMessage ? (
          <div
            className={`settings-status settings-status-${statusType || 'info'}`}
            role={statusType === 'error' ? 'alert' : 'status'}
            aria-live="polite"
          >
            <span className="settings-status-icon" aria-hidden="true">
              {statusType === 'success' ? '✓' : statusType === 'error' ? '⚠' : 'ℹ'}
            </span>
            <span>{statusMessage}</span>
          </div>
        ) : null}
      </form>
    </div>
  )
}

export default Settings
