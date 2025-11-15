import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useWeb3 } from '../context/Web3Context'
import Logo from './Logo'
import './Navbar.css'

const Navbar = () => {
  const location = useLocation()
  const { account, isConnected, connectWallet, disconnectWallet } = useWeb3()

  const shortenAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <Logo size="small" showText={true} />
        </Link>
        <div className="navbar-menu">
          <Link 
            to="/student" 
            className={location.pathname === '/student' ? 'navbar-link active' : 'navbar-link'}
          >
            Student Portal
          </Link>
          <Link 
            to="/teacher" 
            className={location.pathname === '/teacher' ? 'navbar-link active' : 'navbar-link'}
          >
            Teacher Dashboard
          </Link>
          <Link 
            to="/admin" 
            className={location.pathname === '/admin' ? 'navbar-link active' : 'navbar-link'}
          >
            Admin Dashboard
          </Link>
        </div>
        <div className="navbar-wallet">
          {isConnected ? (
            <div className="wallet-info">
              <span className="wallet-address">{shortenAddress(account)}</span>
              <button onClick={disconnectWallet} className="btn btn-secondary btn-sm">
                Disconnect
              </button>
            </div>
          ) : (
            <button onClick={connectWallet} className="btn btn-primary btn-sm">
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar

