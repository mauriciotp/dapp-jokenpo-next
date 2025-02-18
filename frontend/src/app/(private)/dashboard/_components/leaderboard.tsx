'use client'

import { getLeaderBoard } from '@/data/blockchain/actions/contract/read-actions'
import { useQuery } from '@tanstack/react-query'

export function LeaderBoard() {
  const { data: leaderBoard, isPending } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: getLeaderBoard,
  })

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
            {isPending && (
              <tr>
                <td className="border-y border-gray-300 p-2">
                  <p>...</p>
                </td>
                <td className="border-y border-gray-300 p-2">
                  <p>...</p>
                </td>
              </tr>
            )}

            {!isPending &&
              leaderBoard?.map((player) => (
                <tr key={player.wallet}>
                  <td className="border-y border-gray-300 p-2">
                    {player.wallet}
                  </td>
                  <td className="border-y border-gray-300 p-2">
                    {player.wins}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
