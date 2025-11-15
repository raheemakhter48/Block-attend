import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Web3Provider } from './context/Web3Context'
import Sidebar from './components/Sidebar'
import DashboardHeader from './components/DashboardHeader'
import StudentPortal from './pages/StudentPortal'
import AdminDashboard from './pages/AdminDashboard'
import TeacherDashboard from './pages/TeacherDashboard'
import Home from './pages/Home'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import './App.css'

const DESKTOP_BREAKPOINT = 992

const AppContent = () => {
  const location = useLocation()
  const showSidebar = location.pathname !== '/'
  const getInitialSidebarState = () => {
    if (typeof window === 'undefined') return false
    return showSidebar && window.innerWidth >= DESKTOP_BREAKPOINT
  }
  const [isSidebarOpen, setIsSidebarOpen] = useState(getInitialSidebarState)

  useEffect(() => {
    if (!showSidebar) {
      setIsSidebarOpen(false)
      return
    }
    if (typeof window !== 'undefined') {
      setIsSidebarOpen(window.innerWidth >= DESKTOP_BREAKPOINT)
    }
  }, [showSidebar])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const handleResize = () => {
      if (!showSidebar) return
      if (window.innerWidth >= DESKTOP_BREAKPOINT) {
        setIsSidebarOpen(true)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [showSidebar])

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev)
  }

  const closeSidebar = () => {
    if (typeof window === 'undefined') return
    if (window.innerWidth < DESKTOP_BREAKPOINT) {
      setIsSidebarOpen(false)
    }
  }

  return (
    <div className={`App ${showSidebar && isSidebarOpen ? 'sidebar-open' : ''}`}>
      {showSidebar && (
        <>
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={closeSidebar}
            onNavigate={closeSidebar}
          />
          <div
            className={`sidebar-overlay ${isSidebarOpen ? 'visible' : ''}`}
            onClick={closeSidebar}
          />
        </>
      )}
      {showSidebar && (
        <DashboardHeader
          onToggleSidebar={toggleSidebar}
          showSidebar={showSidebar}
        />
      )}
      <div className={`app-content ${showSidebar ? 'with-header' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/student" element={<StudentPortal />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  )
}

function App() {
  return (
    <Web3Provider>
      <Router>
        <AppContent />
      </Router>
    </Web3Provider>
  )
}

export default App

