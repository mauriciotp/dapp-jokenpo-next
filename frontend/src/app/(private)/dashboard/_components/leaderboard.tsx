'use client'

import { useWalletActionsContext } from '@/contexts/wallet-actions-context'
import { getLeaderBoard } from '@/data/blockchain/actions/contract/read-actions'
import { useEffect, useState } from 'react'

interface Player {
  wallet: `0x${string}`
  wins: number
}

export function LeaderBoard() {
  const [leaderBoard, setLeaderBoard] = useState<readonly Player[] | null>(null)
  const { txStatus } = useWalletActionsContext()

  useEffect(() => {
    ;(async () => {
      const leaderBoard = await getLeaderBoard()

      setLeaderBoard(leaderBoard)
    })()
  }, [txStatus])

  return (
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
            {leaderBoard ? (
              leaderBoard.map((player) => (
                <tr key={player.wallet}>
                  <td className="border-y border-gray-300 p-2">
                    {player.wallet}
                  </td>
                  <td className="border-y border-gray-300 p-2">
                    {player.wins}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="border-y border-gray-300 p-2">
                  <p>...</p>
                </td>
                <td className="border-y border-gray-300 p-2">
                  <p>...</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
