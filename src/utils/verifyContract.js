import deployment from '../contracts/deployment.json'

/**
 * Verify contract is deployed at the given address
 */
export const verifyContractDeployment = async (provider) => {
  try {
    if (!provider) {
      return { status: 'error', deployed: false, error: 'Provider not available' }
    }

    const contractAddress = deployment.address
    
    if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
      return { status: 'not_configured', deployed: false, error: 'Contract address not set in deployment.json' }
    }

    // Check if contract has code
    let code

    try {
      code = await provider.getCode(contractAddress)
    } catch (providerError) {
      const rpcErrorCode = providerError?.code ?? providerError?.info?.error?.code
      const rpcErrorMessage = providerError?.message ?? providerError?.info?.error?.message ?? providerError?.data?.message

      const isRateLimit =
        rpcErrorCode === -32002 ||
        (typeof rpcErrorMessage === 'string' && rpcErrorMessage.toLowerCase().includes('too many error'))

      if (isRateLimit) {
        return {
          status: 'rate_limited',
          deployed: null,
          error: 'Hardhat RPC endpoint is busy. Please wait a few seconds and try again.',
          details: rpcErrorMessage
        }
      }

      return {
        status: 'error',
        deployed: null,
        error: rpcErrorMessage || providerError.message || 'Unknown RPC error while checking contract',
        details: providerError
      }
    }
    
    if (!code || code === '0x' || code.length < 10) {
      return { 
        status: 'not_found',
        deployed: false, 
        error: `No contract found at address ${contractAddress}. Please deploy the contract first.`,
        address: contractAddress
      }
    }

    return { 
      status: 'success',
      deployed: true, 
      address: contractAddress,
      codeLength: code.length
    }
  } catch (error) {
    return { 
      status: 'error',
      deployed: null, 
      error: error.message || 'Unknown error checking contract deployment'
    }
  }
}

/**
 * Get network info
 */
export const getNetworkInfo = async (provider) => {
  try {
    if (!provider) {
      return { status: 'error', error: 'Provider not available' }
    }

    const network = await provider.getNetwork()
    return {
      status: 'success',
      chainId: Number(network.chainId),
      name: network.name,
      expectedChainId: 1337
    }
  } catch (error) {
    return { status: 'error', error: error.message || 'Unknown error getting network info' }
  }
}



