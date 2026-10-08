import { Link } from 'react-router-dom'
import './Home.css'

function Home() {
  return (
    <section className="home">
      <h1>Welcome</h1>
      <p className="home-lead">
        Manage your account and preferences from the{' '}
        <Link to="/settings">Settings</Link> page.
      </p>
    </section>
  )
}

export default Home
