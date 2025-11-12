import React from 'react'
import { useWeb3 } from '../context/Web3Context'
import './DashboardHeader.css'

const DashboardHeader = ({ onToggleSidebar, showSidebar }) => {
  const { account, isConnected } = useWeb3()

  const getInitials = (address) => {
    if (!address) return 'U'
    return address.slice(2, 4).toUpperCase()
  }

  const getAvatarColor = (address) => {
    if (!address) return '#667eea'
    const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a']
    const index = parseInt(address.slice(2, 3), 16) % colors.length
    return colors[index]
  }

  return (
    <header className="dashboard-header-top">
      {showSidebar && (
        <button
          type="button"
          className="header-menu-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      )}
      <div className="header-spacer"></div>
      {isConnected && account && (
        <div className="user-profile">
          <div 
            className="profile-avatar"
            style={{ backgroundColor: getAvatarColor(account) }}
            title={account}
          >
            {getInitials(account)}
          </div>
        </div>
      )}
    </header>
  )
}

export default DashboardHeader

