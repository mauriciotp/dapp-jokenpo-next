'use client'

import { useWalletActionsContext } from '@/contexts/wallet-actions-context'
import { getResult } from '@/data/blockchain/actions/contract/read-actions'
import { Options } from '@/data/types'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export function GameControls() {
  const [result, setResult] = useState<string | null>(null)
  const { play, isSubmittingTx, error, txStatus } = useWalletActionsContext()

  async function handlePlay(option: Options) {
    await play(option)
  }

  useEffect(() => {
    ;(async () => {
      const result = await getResult()

      setResult(result)
    })()
  }, [txStatus])

  return (
    <div className="flex-1">
      <h2 className="mb-4 text-center text-2xl font-bold">Games</h2>
      <div className="rounded bg-white p-4 text-center">
        <h2 className="mb-2 text-xl font-bold text-blue-500">
          Current Status:
        </h2>
        {isSubmittingTx ? (
          <div className="mb-2 rounded border border-gray-300 bg-gray-200 p-4 text-black">
            <p>Making play, please wait...</p>
          </div>
        ) : error ? (
          <div className="mb-2 rounded border border-red-300 bg-red-200 p-4 text-black">
            <p>{error.details}</p>
          </div>
        ) : txStatus !== 'reverted' ? (
          <div className="mb-2 rounded border border-green-300 bg-green-200 p-4 text-black">
            {result ? (
              <p>{result}</p>
            ) : result === '' ? (
              <p>Nobody played yet.</p>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        ) : (
          <div className="mb-2 rounded border border-red-300 bg-red-200 p-4 text-black">
            <p>Transaction reverted!</p>
          </div>
        )}

        <h2 className="mb-2 text-xl font-bold text-blue-500">
          Start a new game:
        </h2>

        <div className="flex items-center justify-between gap-4">
          <button
            className="rounded bg-blue-200 px-8 py-4 transition hover:bg-blue-300"
            onClick={() => handlePlay(Options.PAPER)}
          >
            <Image src="/assets/paper.png" width={80} height={80} alt="Paper" />
          </button>
          <button
            className="rounded bg-blue-200 px-8 py-4 transition hover:bg-blue-300"
            onClick={() => handlePlay(Options.ROCK)}
          >
            <Image src="/assets/rock.png" width={80} height={80} alt="Rock" />
          </button>
          <button
            className="rounded bg-blue-200 px-8 py-4 transition hover:bg-blue-300"
            onClick={() => handlePlay(Options.SCISSORS)}
          >
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
  )
}
