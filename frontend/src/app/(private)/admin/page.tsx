import { verifySession } from '@/data/actions/auth/verify-session'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { getOwnerAddress } from '@/data/blockchain/actions/contract/read-actions'
import { AdminActions } from './_components/admin-actions'

export default async function Admin() {
  const { address } = await verifySession()
  const ownerAddress = await getOwnerAddress()

  if (address !== ownerAddress) {
    redirect('/dashboard')
  }

  return (
    <div className="w-full flex-1 pt-10">
      <div className="mb-12 text-center">
        <Image
          className="mx-auto mb-4"
          width={80}
          height={80}
          src="/assets/logo192.png"
          alt="JoKenPo logo"
        />
        <h1 className="mb-2 text-4xl font-bold">Administrative Panel</h1>
        <p className="text-2xl">
          Change players&apos; bid and your commission.
        </p>
      </div>
      <AdminActions />
    </div>
  )
}
