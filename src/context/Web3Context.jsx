import React, { createContext, useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import AttendanceManagementABI from '../contracts/AttendanceManagementABI.json'
import deployment from '../contracts/deployment.json'

const Web3Context = createContext()

export const useWeb3 = () => {
  const context = useContext(Web3Context)
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider')
  }
  return context
}

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [contract, setContract] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Check if MetaMask is installed
  const checkMetaMask = () => {
    if (typeof window.ethereum !== 'undefined') {
      return true
    }
    return false
  }

  // Connect to MetaMask
  const connectWallet = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!checkMetaMask()) {
        throw new Error('Please install MetaMask to use this application')
      }

      const ethereum = window.ethereum
      const provider = new ethers.BrowserProvider(ethereum)
      
      // Request account access
      await ethereum.request({ method: 'eth_requestAccounts' })
      
      const signer = await provider.getSigner()
      const address = await signer.getAddress()

      // Get contract instance
      const contractAddress = deployment.address
      
      if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
        const errorMsg = 'Contract is not deployed. Please run: npm run deploy:local'
        console.error(errorMsg)
        throw new Error(errorMsg)
      }

      console.log('Connecting to contract at:', contractAddress)
      
      const contract = new ethers.Contract(
        contractAddress,
        AttendanceManagementABI,
        signer
      )

      // Verify contract is deployed by checking code
      const code = await provider.getCode(contractAddress)
      if (code === '0x' || code === null || code === undefined) {
        const errorMsg = `No contract found at address ${contractAddress}. Please ensure:\n1. Hardhat node is running (npm run node)\n2. Contract is deployed (npm run deploy:local)\n3. You're connected to Hardhat Local network (Chain ID: 1337)`
        console.error(errorMsg)
        throw new Error(errorMsg)
      }

      console.log('Contract connected successfully')
      console.log('Contract code length:', code.length, 'characters')
      console.log('Contract address:', contractAddress)

      setProvider(provider)
      setSigner(signer)
      setContract(contract)
      setAccount(address)
      setIsConnected(true)

      // Listen for account changes
      ethereum.on('accountsChanged', handleAccountsChanged)
      ethereum.on('chainChanged', handleChainChanged)

      return { account: address, contract }
    } catch (err) {
      setError(err.message)
      console.error('Error connecting wallet:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Handle account changes
  const handleAccountsChanged = async (accounts) => {
    if (accounts.length === 0) {
      disconnectWallet()
    } else {
      const newAccount = accounts[0]
      console.log('Account changed to:', newAccount)
      setAccount(newAccount)
      
      // Reinitialize contract with new account
      if (provider && contract) {
        try {
          const contractAddress = deployment.address
          if (contractAddress && contractAddress !== '0x0000000000000000000000000000000000000000') {
            const signer = await provider.getSigner()
            const newContract = new ethers.Contract(
              contractAddress,
              AttendanceManagementABI,
              signer
            )
            setContract(newContract)
            setSigner(signer)
            console.log('Contract reinitialized with new account')
          }
        } catch (err) {
          console.error('Error reinitializing contract:', err)
        }
      }
    }
  }

  // Handle chain changes
  const handleChainChanged = () => {
    window.location.reload()
  }

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null)
    setProvider(null)
    setSigner(null)
    setContract(null)
    setIsConnected(false)
  }

  // Check connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (checkMetaMask()) {
        try {
          const ethereum = window.ethereum
          const provider = new ethers.BrowserProvider(ethereum)
          const accounts = await ethereum.request({ method: 'eth_accounts' })
          
          if (accounts.length > 0) {
            const signer = await provider.getSigner()
            const address = await signer.getAddress()
            const contractAddress = deployment.address
            
            if (contractAddress && contractAddress !== '0x0000000000000000000000000000000000000000') {
              const contract = new ethers.Contract(
                contractAddress,
                AttendanceManagementABI,
                signer
              )

              setProvider(provider)
              setSigner(signer)
              setContract(contract)
              setAccount(address)
              setIsConnected(true)
            } else {
              // Contract not deployed, but wallet is connected
              setProvider(provider)
              setSigner(signer)
              setAccount(address)
              setIsConnected(true)
            }
          }
        } catch (err) {
          console.error('Error checking connection:', err)
        }
      }
    }

    checkConnection()
  }, [])

  const value = {
    account,
    provider,
    signer,
    contract,
    isConnected,
    loading,
    error,
    connectWallet,
    disconnectWallet,
    checkMetaMask,
    setError
  }

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>
}

