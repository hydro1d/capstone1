import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Layout from './Layout'

describe('Layout Navigation', () => {
  it('renders application navigation with link to Settings', () => {
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>,
    )

    const nav = screen.getByRole('navigation', { name: /main/i })
    expect(nav).toBeInTheDocument()

    const homeLink = screen.getByRole('link', { name: /home/i })
    expect(homeLink).toHaveAttribute('href', '/')

    const settingsLink = screen.getByRole('link', { name: /settings/i })
    expect(settingsLink).toHaveAttribute('href', '/settings')
  })
})
