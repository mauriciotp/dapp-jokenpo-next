'use client'

import 'viem/window'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  Chain,
  ContractFunctionExecutionErrorType,
  createWalletClient,
  custom,
  EIP1193Provider,
  getContract,
  ParseAbiItem,
  parseAbiItem,
  parseEther,
  publicActions,
  RequestAddressesReturnType,
  TransactionReceipt,
  WatchEventOnLogsParameter,
  WatchEventReturnType,
} from 'viem'
import { sepolia } from 'viem/chains'
import { abi } from '@/data/blockchain/abis/JKPAdapter'
import { env } from '@/env'
import { Options, PlayedEvent } from '@/data/types'
import {
  getBid,
  waitForTransactionReceipt,
} from '@/data/blockchain/actions/contract/read-actions'

const createWalletClientInstance = (
  chain: Chain,
  provider: EIP1193Provider | null,
) => {
  if (!provider) return null
  return createWalletClient({
    chain,
    transport: custom(provider),
  })
}

interface WalletActionsContextProps {
  isMetamaskInstalled: boolean
  requestAddresses: () => Promise<RequestAddressesReturnType>
  play: (option: Options) => Promise<TransactionReceipt>
  changeBid: (newBid: string) => Promise<TransactionReceipt>
  changeCommission: (newCommission: string) => Promise<TransactionReceipt>
  upgradeContract: (
    newContractAddress: `0x${string}`,
  ) => Promise<TransactionReceipt>
  watchPlayEvent: (
    callbackFn: (
      logs: WatchEventOnLogsParameter<ParseAbiItem<PlayedEvent>>,
    ) => void,
  ) => WatchEventReturnType
  walletClient: ReturnType<typeof createWalletClientInstance>
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
  }, [])

  const walletClient = useMemo(
    () => createWalletClientInstance(sepolia, ethereum),
    [ethereum],
  )

  const contract = useMemo(() => {
    if (!walletClient) return null
    return getContract({
      abi,
      address: `0x${env.NEXT_PUBLIC_ADAPTER_CONTRACT_ADDRESS}`,
      client: walletClient,
    })
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
      const [address] = await walletClient.getAddresses()

      const bid = await getBid()

      const hash = await contract.write.play([option], {
        account: address,
        value: bid,
      })

      const txReceipt = await waitForTransactionReceipt(hash)

      return txReceipt
    } catch (e) {
      const error = e as ContractFunctionExecutionErrorType

      throw error
    }
  }

  const changeBid = async (newBid: string) => {
    if (!walletClient || !contract)
      throw new Error('Wallet client or contract not initialized')

    try {
      const [address] = await walletClient.getAddresses()

      const hash = await contract.write.setBid([parseEther(newBid)], {
        account: address,
      })

      const txReceipt = await waitForTransactionReceipt(hash)

      return txReceipt
    } catch (e) {
      const error = e as ContractFunctionExecutionErrorType

      throw error
    }
  }

  const changeCommission = async (newCommission: string) => {
    if (!walletClient || !contract)
      throw new Error('Wallet client or contract not initialized')

    try {
      const [address] = await walletClient.getAddresses()

      const formattedCommission = Math.round(parseFloat(newCommission))

      const hash = await contract.write.setCommission([formattedCommission], {
        account: address,
      })

      const txReceipt = await waitForTransactionReceipt(hash)

      return txReceipt
    } catch (e) {
      const error = e as ContractFunctionExecutionErrorType

      throw error
    }
  }

  const upgradeContract = async (newContractAddress: `0x${string}`) => {
    if (!walletClient || !contract) {
      throw new Error('Wallet client or contract not initialized')
    }

    try {
      const [address] = await walletClient.getAddresses()

      const hash = await contract.write.upgrade([newContractAddress], {
        account: address,
      })

      const txReceipt = await waitForTransactionReceipt(hash)

      return txReceipt
    } catch (e) {
      const error = e as ContractFunctionExecutionErrorType

      throw error
    }
  }

  const watchPlayEvent = (
    callbackFn: (
      logs: WatchEventOnLogsParameter<ParseAbiItem<PlayedEvent>>,
    ) => void,
  ) => {
    if (!walletClient) {
      throw new Error('Wallet client not initialized.')
    }

    const unwatch = walletClient.extend(publicActions).watchEvent({
      event: parseAbiItem(
        'event Played(address indexed player, string result)',
      ),
      onLogs: (logs) => {
        callbackFn(logs)
      },
    })

    return unwatch
  }

  return (
    <WalletActionsContext
      value={{
        isMetamaskInstalled,
        play,
        requestAddresses,
        changeBid,
        changeCommission,
        upgradeContract,
        watchPlayEvent,
        walletClient,
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
