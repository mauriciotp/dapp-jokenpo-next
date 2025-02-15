'use client'

import 'viem/window'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  ContractFunctionExecutionErrorType,
  createWalletClient,
  custom,
  EIP1193Provider,
  getContract,
  parseEther,
  RequestAddressesReturnType,
  TransactionReceipt,
} from 'viem'
import { sepolia } from 'viem/chains'
import { abi } from '@/data/blockchain/abis/JoKenPo'
import { env } from '@/env'
import { Options } from '@/data/types'
import {
  getBid,
  waitForTransactionReceipt,
} from '@/data/blockchain/actions/contract/read-actions'

interface WalletActionsContextProps {
  isMetamaskInstalled: boolean
  isSubmittingTx: boolean
  txStatus: 'success' | 'reverted' | null
  error: ContractFunctionExecutionErrorType | null
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
  const [isSubmittingTx, setIsSubmittingTx] = useState(false)
  const [txStatus, setTxStatus] = useState<'success' | 'reverted' | null>(null)
  const [error, setError] = useState<ContractFunctionExecutionErrorType | null>(
    null,
  )

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

    try {
      setIsSubmittingTx(true)
      const [address] = await walletClient.getAddresses()

      const bid = await getBid()

      const hash = await contract.write.play([option], {
        account: address,
        value: bid,
      })

      const txReceipt = await waitForTransactionReceipt(hash)

      setIsSubmittingTx(false)
      setTxStatus(txReceipt.status)
      setError(null)

      return txReceipt
    } catch (e) {
      const error = e as ContractFunctionExecutionErrorType

      setIsSubmittingTx(false)
      setError(error)
      throw error
    }
  }

  const changeBid = async (newBid: string) => {
    if (!walletClient || !contract)
      throw new Error('Wallet client or contract not initialized')

    try {
      setIsSubmittingTx(true)
      const [address] = await walletClient.getAddresses()

      const hash = await contract.write.setBid([parseEther(newBid)], {
        account: address,
      })

      const txReceipt = await waitForTransactionReceipt(hash)

      setIsSubmittingTx(false)
      setTxStatus(txReceipt.status)
      setError(null)

      return txReceipt
    } catch (e) {
      const error = e as ContractFunctionExecutionErrorType

      setIsSubmittingTx(false)
      setError(error)
      throw error
    }
  }

  const changeCommission = async (newCommission: string) => {
    if (!walletClient || !contract)
      throw new Error('Wallet client or contract not initialized')

    try {
      setIsSubmittingTx(true)
      const [address] = await walletClient.getAddresses()

      const formattedCommission = Math.round(parseFloat(newCommission))

      const hash = await contract.write.setCommission([formattedCommission], {
        account: address,
      })

      const txReceipt = await waitForTransactionReceipt(hash)

      setIsSubmittingTx(false)
      setTxStatus(txReceipt.status)
      setError(null)

      return txReceipt
    } catch (e) {
      const error = e as ContractFunctionExecutionErrorType

      setIsSubmittingTx(false)
      setError(error)
      throw error
    }
  }

  return (
    <WalletActionsContext
      value={{
        isMetamaskInstalled,
        isSubmittingTx,
        txStatus,
        error,
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
