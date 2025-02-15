'use client'

import { useState } from 'react'
import { Input } from './input'
import { useWalletActionsContext } from '@/contexts/wallet-actions-context'

export function AdminActions() {
  const [bid, setBid] = useState('')
  const [commission, setCommission] = useState('')
  const { changeBid, changeCommission } = useWalletActionsContext()

  async function handleChangeBid() {
    await changeBid(bid)
  }

  async function handleChangeCommission() {
    await changeCommission(commission)
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <label className="mb-2 block text-center text-lg" htmlFor="bid">
          Bid (wei):
        </label>
        <div className="flex items-stretch">
          <Input
            onChange={(e) => setBid(e.target.value)}
            id="bid"
            valueType="wei"
          />
          <button
            onClick={handleChangeBid}
            className="rounded-r bg-blue-600 px-4 py-3 text-lg"
          >
            Change Bid
          </button>
        </div>
      </div>
      <div className="flex-1">
        <label className="mb-2 block text-center text-lg" htmlFor="commission">
          Commission (%):
        </label>
        <div className="flex items-stretch">
          <Input
            onChange={(e) => setCommission(e.target.value)}
            id="commission"
            valueType="%"
          />
          <button
            onClick={handleChangeCommission}
            className="rounded-r bg-blue-600 px-4 py-3 text-lg"
          >
            Change Commission
          </button>
        </div>
      </div>
    </div>
  )
}
