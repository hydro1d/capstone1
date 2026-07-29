import { NavLink, Outlet } from 'react-router-dom'
import './Layout.css'

function Layout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <NavLink to="/" className="app-brand" end>
          Capstone1
        </NavLink>
        <nav className="app-nav" aria-label="Main">
          <NavLink to="/" className="app-nav-link" end>
            Home
          </NavLink>
          <NavLink to="/settings" className="app-nav-link">
            Settings
          </NavLink>
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
