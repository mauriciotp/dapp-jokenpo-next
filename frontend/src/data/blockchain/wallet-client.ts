import 'viem/window'
import { createWalletClient, custom, WalletClient } from 'viem'
import { sepolia } from 'viem/chains'

export let walletClient: WalletClient

if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
  walletClient = createWalletClient({
    chain: sepolia,
    transport: custom(window.ethereum!),
  })
} else {
  console.error('Please install MetaMask')
}
