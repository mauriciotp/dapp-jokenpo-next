'use server'

import { cookies } from 'next/headers'

export const verifySession = async () => {
  const cookieStore = await cookies()

  const address = cookieStore.get('address')?.value

  return {
    isAuthenticated: address ? true : false,
    address,
  }
}
