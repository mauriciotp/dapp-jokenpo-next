'use client'

import 'viem/window'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  createWalletClient,
  custom,
  EIP1193Provider,
  getContract,
  publicActions,
  RequestAddressesReturnType,
  TransactionReceipt,
} from 'viem'
import { sepolia } from 'viem/chains'
import { abi } from '@/data/blockchain/abis/JoKenPo'
import { env } from '@/env'
import { Options } from '@/data/types'

interface WalletActionsContextProps {
  isMetamaskInstalled: boolean
  play: (option: Options) => Promise<TransactionReceipt>
  requestAddresses: () => Promise<RequestAddressesReturnType>
}

const WalletActionsContext = createContext<WalletActionsContextProps>(
  {} as WalletActionsContextProps,
)

export function WalletActionsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(false)
  const [ethereum, setEthereum] = useState<EIP1193Provider | null>(null)

  useEffect(() => {
    if (window.ethereum) {
      setIsMetamaskInstalled(true)
      setEthereum(window.ethereum)
    }
  }, [ethereum])

  const walletClient = useMemo(() => {
    if (ethereum) {
      return createWalletClient({
        chain: sepolia,
        transport: custom(ethereum),
      })
    }
    return null
  }, [ethereum])

  const contract = useMemo(() => {
    if (walletClient) {
      return getContract({
        abi,
        address: `0x${env.NEXT_PUBLIC_CONTRACT_ADDRESS}`,
        client: walletClient,
      })
    }
    return null
  }, [walletClient])

  const requestAddresses = async () => {
    if (!walletClient) throw new Error('Wallet client not initialized')

    const addresses = await walletClient.requestAddresses()

    return addresses
  }

  const play = async (option: Options) => {
    if (!walletClient || !contract)
      throw new Error('Wallet client or contract not initialized')

    const [address] = await walletClient.getAddresses()

    const bid = await contract.read.getBid()

    const hash = await contract.write.play([option], {
      account: address,
      value: bid,
    })

    const txReceipt = await walletClient
      .extend(publicActions)
      .waitForTransactionReceipt({
        hash,
      })

    return txReceipt
  }

  return (
    <WalletActionsContext
      value={{ isMetamaskInstalled, play, requestAddresses }}
    >
      {children}
    </WalletActionsContext>
  )
}

export function useWalletActionsContext() {
  const context = useContext(WalletActionsContext)

  return context
}
