import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Sidebar.css'

const Sidebar = ({ isOpen, onClose, onNavigate }) => {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path
  }

  const handleNavigate = () => {
    if (typeof onNavigate === 'function') {
      onNavigate()
    }
  }

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-logo">
        <div className="logo-icon">
          <div className="logo-square"></div>
          <div className="logo-square"></div>
          <div className="logo-square"></div>
          <div className="logo-square"></div>
        </div>
        <span className="logo-text">BlockAttend</span>
        <button
          className="sidebar-close-btn"
          type="button"
          onClick={onClose}
          aria-label="Close navigation"
        >
          ×
        </button>
      </div>
      <nav className="sidebar-nav">
        <Link 
          to="/admin" 
          className={`sidebar-nav-item ${isActive('/admin') ? 'active' : ''}`}
          onClick={handleNavigate}
        >
          <svg className="sidebar-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>Admin</span>
        </Link>
        <Link 
          to="/teacher" 
          className={`sidebar-nav-item ${isActive('/teacher') ? 'active' : ''}`}
          onClick={handleNavigate}
        >
          <svg className="sidebar-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span>Teacher</span>
        </Link>
        <Link 
          to="/student" 
          className={`sidebar-nav-item ${isActive('/student') ? 'active' : ''}`}
          onClick={handleNavigate}
        >
          <svg className="sidebar-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>Student</span>
        </Link>
      </nav>
    </aside>
  )
}

export default Sidebar

