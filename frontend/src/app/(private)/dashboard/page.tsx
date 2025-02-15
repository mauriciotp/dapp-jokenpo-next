import { verifySession } from '@/data/actions/auth/verify-session'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { GameControls } from './_components/game-controls'
import { getOwnerAddress } from '@/data/blockchain/actions/contract/read-actions'
import { LeaderBoard } from './_components/leaderboard'

export default async function Dashboard() {
  const { address } = await verifySession()
  const ownerAddress = await getOwnerAddress()

  if (address === ownerAddress) {
    redirect('/admin')
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
        <h1 className="mb-2 text-4xl font-bold">Leaderboard</h1>
        <p className="text-2xl">
          Check the players&apos; score and play the game.
        </p>
      </div>
      <div className="flex gap-4">
        <LeaderBoard />
        <GameControls />
      </div>
    </div>
  )
}
