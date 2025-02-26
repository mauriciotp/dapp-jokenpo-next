'use server'

import { createPublicClient, getContract, http } from 'viem'
import { abi } from '../../abis/JKPAdapter'
import { env } from '@/env'
import { sepolia } from 'viem/chains'
import { serverEnv } from '@/serverEnv'

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(`https://sepolia.infura.io/v3/${serverEnv.INFURA_SECRET}`),
})

const contract = getContract({
  abi,
  address: `0x${env.NEXT_PUBLIC_ADAPTER_CONTRACT_ADDRESS}`,
  client: publicClient,
})

export const getOwnerAddress = async () => {
  const address = await contract.read.owner()

  return address
}

export const getResult = async () => {
  const result = await contract.read.getResult()

  return result
}

export const getBid = async () => {
  const bid = await contract.read.getBid()

  return bid
}

export const getLeaderBoard = async () => {
  const leaderBoard = await contract.read.getLeaderBoard()

  return leaderBoard
}

export const waitForTransactionReceipt = async (hash: `0x${string}`) => {
  const txReceipt = await publicClient.waitForTransactionReceipt({
    hash,
  })

  return txReceipt
}
