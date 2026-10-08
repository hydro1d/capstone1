import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Settings from './Settings'
import { STORAGE_KEY, defaultSettings } from '../hooks/useSettings'

describe('Settings Page', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('renders all sections and initial default values correctly', () => {
    render(<Settings />)

    expect(screen.getByRole('heading', { name: /settings/i })).toBeInTheDocument()

    // Profile section
    const displayNameInput = screen.getByLabelText(/display name/i)
    const emailInput = screen.getByLabelText(/^email$/i)
    expect(displayNameInput).toHaveValue(defaultSettings.displayName)
    expect(emailInput).toHaveValue(defaultSettings.email)
    expect(emailInput).toHaveAttribute('type', 'email')

    // Notifications section
    const emailNotifCheckbox = screen.getByLabelText(/email notifications/i)
    const pushNotifCheckbox = screen.getByLabelText(/push notifications/i)
    expect(emailNotifCheckbox).toBeChecked()
    expect(pushNotifCheckbox).not.toBeChecked()

    // Appearance section
    const themeSelect = screen.getByLabelText(/theme/i)
    expect(themeSelect).toHaveValue('system')

    // Action buttons
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /reset defaults/i })).toBeInTheDocument()
  })

  it('allows editing fields, saves changes, and persists to localStorage', async () => {
    const user = userEvent.setup()
    render(<Settings />)

    const displayNameInput = screen.getByLabelText(/display name/i)
    const emailInput = screen.getByLabelText(/^email$/i)
    const pushNotifCheckbox = screen.getByLabelText(/push notifications/i)
    const themeSelect = screen.getByLabelText(/theme/i)
    const saveButton = screen.getByRole('button', { name: /save changes/i })

    await user.type(displayNameInput, 'Jane Doe')
    await user.type(emailInput, 'jane@example.com')
    await user.click(pushNotifCheckbox)
    await user.selectOptions(themeSelect, 'dark')

    await user.click(saveButton)

    // Clear feedback shown
    const status = await screen.findByRole('status')
    expect(status).toHaveTextContent(/settings saved successfully/i)

    // Storage persistence verified
    const savedRaw = localStorage.getItem(STORAGE_KEY)
    expect(savedRaw).not.toBeNull()
    const saved = JSON.parse(savedRaw)
    expect(saved).toEqual({
      displayName: 'Jane Doe',
      email: 'jane@example.com',
      emailNotifications: true,
      pushNotifications: true,
      theme: 'dark',
    })

    // Theme applied to document element
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('survives page reload by restoring saved values from localStorage', () => {
    const customSettings = {
      displayName: 'Alex Smith',
      email: 'alex@example.com',
      emailNotifications: false,
      pushNotifications: true,
      theme: 'light',
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customSettings))

    render(<Settings />)

    expect(screen.getByLabelText(/display name/i)).toHaveValue('Alex Smith')
    expect(screen.getByLabelText(/^email$/i)).toHaveValue('alex@example.com')
    expect(screen.getByLabelText(/email notifications/i)).not.toBeChecked()
    expect(screen.getByLabelText(/push notifications/i)).toBeChecked()
    expect(screen.getByLabelText(/theme/i)).toHaveValue('light')
  })

  it('resets settings to defaults and updates storage when reset button is clicked', async () => {
    const user = userEvent.setup()
    const customSettings = {
      displayName: 'Alex Smith',
      email: 'alex@example.com',
      emailNotifications: false,
      pushNotifications: true,
      theme: 'dark',
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customSettings))

    render(<Settings />)

    const resetButton = screen.getByRole('button', { name: /reset defaults/i })
    await user.click(resetButton)

    // Feedback
    const status = await screen.findByRole('status')
    expect(status).toHaveTextContent(/settings reset to defaults/i)

    // Inputs restored
    expect(screen.getByLabelText(/display name/i)).toHaveValue('')
    expect(screen.getByLabelText(/^email$/i)).toHaveValue('')
    expect(screen.getByLabelText(/email notifications/i)).toBeChecked()
    expect(screen.getByLabelText(/push notifications/i)).not.toBeChecked()
    expect(screen.getByLabelText(/theme/i)).toHaveValue('system')

    // Storage reset
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
    expect(document.documentElement.getAttribute('data-theme')).toBeNull()
  })

  it('handles empty and invalid input gracefully with accessible error messages', async () => {
    const user = userEvent.setup()
    render(<Settings />)

    const displayNameInput = screen.getByLabelText(/display name/i)
    const emailInput = screen.getByLabelText(/^email$/i)
    const saveButton = screen.getByRole('button', { name: /save changes/i })

    // Try saving empty fields
    await user.click(saveButton)

    expect(screen.getByText(/display name is required/i)).toBeInTheDocument()
    expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    expect(displayNameInput).toHaveAttribute('aria-invalid', 'true')
    expect(emailInput).toHaveAttribute('aria-invalid', 'true')

    // LocalStorage should not have saved
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()

    // Type invalid email
    await user.type(displayNameInput, 'Valid Name')
    await user.type(emailInput, 'invalid-email-format')
    await user.click(saveButton)

    expect(screen.queryByText(/display name is required/i)).not.toBeInTheDocument()
    expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
    expect(emailInput).toHaveAttribute('aria-invalid', 'true')
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()

    // Fix email to valid format
    await user.clear(emailInput)
    await user.type(emailInput, 'valid@example.com')
    await user.click(saveButton)

    expect(screen.queryByText(/please enter a valid email address/i)).not.toBeInTheDocument()
    expect(await screen.findByText(/settings saved successfully/i)).toBeInTheDocument()
    expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull()
  })

  it('gracefully falls back to default settings when localStorage contains corrupted JSON', () => {
    localStorage.setItem(STORAGE_KEY, 'corrupted-json{{')
    render(<Settings />)

    expect(screen.getByLabelText(/display name/i)).toHaveValue('')
    expect(screen.getByLabelText(/^email$/i)).toHaveValue('')
    expect(screen.getByLabelText(/theme/i)).toHaveValue('system')
  })

  it('trims whitespace on save', async () => {
    const user = userEvent.setup()
    render(<Settings />)

    const displayNameInput = screen.getByLabelText(/display name/i)
    const emailInput = screen.getByLabelText(/^email$/i)
    const saveButton = screen.getByRole('button', { name: /save changes/i })

    await user.type(displayNameInput, '   John Doe   ')
    await user.type(emailInput, '   john@example.com   ')
    await user.click(saveButton)

    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    expect(saved.displayName).toBe('John Doe')
    expect(saved.email).toBe('john@example.com')
  })

  it('supports keyboard submission and focus interactions', async () => {
    const user = userEvent.setup()
    render(<Settings />)

    const displayNameInput = screen.getByLabelText(/display name/i)
    const emailInput = screen.getByLabelText(/^email$/i)

    await user.type(displayNameInput, 'Keyboard User')
    await user.type(emailInput, 'keyboard@example.com{Enter}')

    const status = await screen.findByRole('status')
    expect(status).toHaveTextContent(/settings saved successfully/i)
  })
})
