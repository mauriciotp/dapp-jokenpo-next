import { verifySession } from '@/data/actions/auth/verify-session'
import { getOwnerAddress } from '@/data/blockchain/web3-service'
import Image from 'next/image'
import { redirect } from 'next/navigation'

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
        <div className="flex-1">
          <h2 className="mb-4 text-center text-2xl font-bold">Best players</h2>
          <div className="rounded bg-white p-4">
            <table className="w-full bg-white text-center text-black">
              <thead>
                <tr>
                  <th className="p-2">Player</th>
                  <th className="p-2">Wins</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-y border-gray-300 p-2">
                    0x8931hsfh238feuuhsfds92389
                  </td>
                  <td className="border-y border-gray-300 p-2">1</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex-1">
          <h2 className="mb-4 text-center text-2xl font-bold">Games</h2>
          <div className="rounded bg-white p-4 text-center">
            <h2 className="mb-2 text-xl font-bold text-blue-500">
              Current Status:
            </h2>
            <div className="mb-2 rounded border border-green-300 bg-green-200 p-4 text-black">
              <p>Rock breaks Scissors, Player 1 won.</p>
            </div>
            <h2 className="mb-2 text-xl font-bold text-blue-500">
              Start a new game:
            </h2>
            <div className="flex items-center justify-between gap-4">
              <button className="rounded bg-blue-200 px-8 py-4 transition hover:bg-blue-300">
                <Image
                  src="/assets/paper.png"
                  width={80}
                  height={80}
                  alt="Paper"
                />
              </button>
              <button className="rounded bg-blue-200 px-8 py-4 transition hover:bg-blue-300">
                <Image
                  src="/assets/rock.png"
                  width={80}
                  height={80}
                  alt="Rock"
                />
              </button>
              <button className="rounded bg-blue-200 px-8 py-4 transition hover:bg-blue-300">
                <Image
                  src="/assets/scissors.png"
                  width={80}
                  height={80}
                  alt="Scissors"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
