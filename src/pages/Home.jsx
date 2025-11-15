import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../components/Logo'
import './Home.css'

const Home = () => {
  return (
    <div className="home-page">
      <header className="home-header">
        <div className="header-container">
          <div className="header-logo">
            <Logo size="medium" showText={true} />
          </div>
          <nav className="header-nav">
            <Link to="/student">Student</Link>
            <Link to="/teacher">Teacher</Link>
            <Link to="/admin">Admin</Link>
          </nav>
        </div>
      </header>

      <main className="home-main">
        <section className="hero-section">
          <div className="hero-container">
            <h1 className="hero-title">The Future of Attendance is Decentralized</h1>
            <p className="hero-description">
              BlockAttend brings transparency, security, and automation to academic attendance tracking using blockchain technology.
            </p>
            <div className="hero-buttons">
              <Link to="/student" className="btn-primary-large">
                Enter Student Portal
              </Link>
              <Link to="/admin" className="btn-secondary-large">
                Admin & Teacher Login
              </Link>
            </div>
          </div>
        </section>

        <section className="features-section">
          <div className="features-container">
            <div className="features-label">Key Features</div>
            <h2 className="features-title">Secure, Transparent, and Smart.</h2>
            <p className="features-description">
              Our platform is built on cutting-edge technology to provide a reliable and efficient attendance management system.
            </p>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon-wrapper">
                  <svg className="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3>Decentralized & Secure</h3>
                <p>Attendance data is stored immutably on the blockchain, preventing tampering and data loss.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon-wrapper">
                  <svg className="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3>Role-Based Access</h3>
                <p>Separate, intuitive portals for Admins, Teachers, and Students with specific permissions.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon-wrapper">
                  <svg className="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3>Student Portal</h3>
                <p>Students connect their MetaMask wallet to view real-time attendance records and analytics.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon-wrapper">
                  <svg className="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3>AI-Powered Insights</h3>
                <p>Leverage AI to detect attendance anomalies and provide actionable insights.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <div className="footer-container">
          <div className="footer-copyright">© 2025 BlockAttend. All Rights Reserved.</div>
          <div className="footer-links">
            <Link to="/terms">Terms of Service</Link>
            <Link to="/privacy">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home

