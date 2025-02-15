'use client'

import 'viem/window'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  createWalletClient,
  custom,
  EIP1193Provider,
  getContract,
  parseEther,
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
  requestAddresses: () => Promise<RequestAddressesReturnType>
  play: (option: Options) => Promise<TransactionReceipt>
  changeBid: (newBid: string) => Promise<TransactionReceipt>
  changeCommission: (newCommission: string) => Promise<TransactionReceipt>
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

  const client = useMemo(() => {
    if (ethereum) {
      return createWalletClient({
        chain: sepolia,
        transport: custom(ethereum),
      }).extend(publicActions)
    }
    return null
  }, [ethereum])

  const contract = useMemo(() => {
    if (client) {
      return getContract({
        abi,
        address: `0x${env.NEXT_PUBLIC_CONTRACT_ADDRESS}`,
        client,
      })
    }
    return null
  }, [client])

  const requestAddresses = async () => {
    if (!client) throw new Error('Wallet client not initialized')

    const addresses = await client.requestAddresses()

    return addresses
  }

  const play = async (option: Options) => {
    if (!client || !contract)
      throw new Error('Wallet client or contract not initialized')

    const [address] = await client.getAddresses()

    const bid = await contract.read.getBid()

    const hash = await contract.write.play([option], {
      account: address,
      value: bid,
    })

    const txReceipt = await client.waitForTransactionReceipt({
      hash,
    })

    return txReceipt
  }

  const changeBid = async (newBid: string) => {
    if (!client || !contract)
      throw new Error('Wallet client or contract not initialized')

    const [address] = await client.getAddresses()

    const hash = await contract.write.setBid([parseEther(newBid)], {
      account: address,
    })

    const txReceipt = await client.waitForTransactionReceipt({
      hash,
    })

    return txReceipt
  }

  const changeCommission = async (newCommission: string) => {
    if (!client || !contract)
      throw new Error('Wallet client or contract not initialized')

    const [address] = await client.getAddresses()

    const formattedCommission = Math.round(parseFloat(newCommission))

    const hash = await contract.write.setCommission([formattedCommission], {
      account: address,
    })

    const txReceipt = await client.waitForTransactionReceipt({
      hash,
    })

    return txReceipt
  }

  return (
    <WalletActionsContext
      value={{
        isMetamaskInstalled,
        play,
        requestAddresses,
        changeBid,
        changeCommission,
      }}
    >
      {children}
    </WalletActionsContext>
  )
}

export function useWalletActionsContext() {
  const context = useContext(WalletActionsContext)

  return context
}
