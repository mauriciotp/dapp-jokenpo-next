'use server'

import { getOwnerAddress } from '@/data/blockchain/actions/contract/read-actions'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const login = async (address: string) => {
  const cookieStore = await cookies()

  cookieStore.set('address', address)

  const ownerAddress = await getOwnerAddress()

  if (address === ownerAddress) {
    redirect('/admin')
  } else {
    redirect('/dashboard')
  }
}
