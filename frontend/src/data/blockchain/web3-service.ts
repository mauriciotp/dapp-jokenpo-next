import { getContract } from 'viem'
import { abi } from '@/data/blockchain/contracts/JoKenPo'
import { env } from '@/env'
import { publicClient } from '@/data/blockchain/public-client'

const contractWithPublicClient = getContract({
  abi,
  address: `0x${env.NEXT_PUBLIC_CONTRACT_ADDRESS}`,
  client: publicClient,
})

export const getOwnerAddress = async () => {
  const address = await contractWithPublicClient.read.owner()

  return address
}
