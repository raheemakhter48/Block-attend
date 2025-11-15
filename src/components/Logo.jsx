import React from 'react'
import './Logo.css'

const Logo = ({ size = 'medium', showText = true }) => {
  return (
    <div className={`logo-container logo-${size}`}>
      <svg 
        className="logo-svg" 
        viewBox="0 0 120 120" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Hexagon outline */}
        <path
          d="M60 10 L100 30 L100 70 L60 90 L20 70 L20 30 Z"
          stroke="#3B82F6"
          strokeWidth="4"
          fill="none"
        />
        {/* Checkmark */}
        <path
          d="M35 60 L50 75 L85 40"
          stroke="#3B82F6"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      {showText && <span className="logo-text">BlockAttend</span>}
    </div>
  )
}

export default Logo

