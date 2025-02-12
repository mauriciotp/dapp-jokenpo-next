import { verifySession } from '@/data/actions/auth/verify-session'
import { getOwnerAddress } from '@/data/blockchain/web3-service'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
  const { address } = await verifySession()
  const ownerAddress = await getOwnerAddress()

  if (address === ownerAddress) {
    redirect('/admin')
  }

  return <div>Dashboard</div>
}
