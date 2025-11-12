import React from 'react'
import { useWeb3 } from '../context/Web3Context'
import './AccountDebug.css'

const AccountDebug = () => {
  const { account, contract, isConnected } = useWeb3()

  const deployerAccount = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

  if (!isConnected) return null

  const isDeployer = account?.toLowerCase() === deployerAccount.toLowerCase()
  const contractAddress = contract?.target || contract?.address || 'N/A'

  return (
    <div className="account-debug">
      <h4>Debug Info:</h4>
      <div className="debug-item">
        <strong>Connected Account:</strong> {account || 'Not connected'}
      </div>
      <div className="debug-item">
        <strong>Deployer Account:</strong> {deployerAccount}
      </div>
      <div className="debug-item">
        <strong>Is Deployer:</strong> 
        <span className={isDeployer ? 'debug-success' : 'debug-error'}>
          {isDeployer ? '✅ Yes' : '❌ No'}
        </span>
      </div>
      <div className="debug-item">
        <strong>Contract Address:</strong> {contractAddress}
      </div>
      {!isDeployer && (
        <div className="debug-warning">
          ⚠️ Warning: You're not using the deployer account. Switch to Account #0 in MetaMask.
        </div>
      )}
    </div>
  )
}

export default AccountDebug



