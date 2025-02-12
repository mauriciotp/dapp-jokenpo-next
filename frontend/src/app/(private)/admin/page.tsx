import { verifySession } from '@/data/actions/auth/verify-session'
import { getOwnerAddress } from '@/data/blockchain/web3-service'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { Input } from './_components/input'

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
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="mb-2 block text-center text-lg" htmlFor="bid">
            Bid (wei):
          </label>
          <Input id="bid" valueType="wei" buttonText="Change Bid" />
        </div>
        <div className="flex-1">
          <label
            className="mb-2 block text-center text-lg"
            htmlFor="commission"
          >
            Commission (%):
          </label>
          <Input id="commission" valueType="%" buttonText="Change Commission" />
        </div>
      </div>
    </div>
  )
}
