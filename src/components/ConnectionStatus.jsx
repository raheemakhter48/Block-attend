import React from 'react'
import { useWeb3 } from '../context/Web3Context'
import './ConnectionStatus.css'

const ConnectionStatus = () => {
  const { account, isConnected, contract, checkMetaMask } = useWeb3()

  if (!checkMetaMask()) {
    return (
      <div className="connection-status error">
        <div className="status-icon">⚠️</div>
        <div className="status-content">
          <h3>MetaMask Not Installed</h3>
          <p>Please install MetaMask extension to use this application.</p>
          <a 
            href="https://metamask.io/download/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="install-link"
          >
            Install MetaMask
          </a>
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="connection-status warning">
        <div className="status-icon">🔌</div>
        <div className="status-content">
          <h3>Wallet Not Connected</h3>
          <p>Please connect your MetaMask wallet to continue.</p>
        </div>
      </div>
    )
  }

  if (!contract) {
    return (
      <div className="connection-status error">
        <div className="status-icon">⚠️</div>
        <div className="status-content">
          <h3>Contract Not Found</h3>
          <p>Contract is not deployed or address is incorrect.</p>
          <p className="help-text">
            Please ensure:
            <br />1. Hardhat node is running
            <br />2. Contract is deployed
            <br />3. You're on the correct network (Hardhat Local - Chain ID: 1337)
          </p>
        </div>
      </div>
    )
  }

  if (!account) {
    return (
      <div className="connection-status warning">
        <div className="status-icon">👤</div>
        <div className="status-content">
          <h3>No Account Found</h3>
          <p>Please select an account in MetaMask.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="connection-status success">
      <div className="status-icon">✅</div>
      <div className="status-content">
        <h3>Connected</h3>
        <p>Wallet: {account.slice(0, 6)}...{account.slice(-4)}</p>
        <p>Contract: {contract.target?.slice(0, 6)}...{contract.target?.slice(-4)}</p>
      </div>
    </div>
  )
}

export default ConnectionStatus



