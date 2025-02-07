'use client'

import Image from 'next/image'

export function Button() {
  return (
    <button className="flex w-full items-center justify-center gap-2 rounded bg-white px-4 py-3 transition hover:bg-orange-200">
      <Image
        width={40}
        height={40}
        src="/assets/metamask.svg"
        alt="Metamask logo"
      />
      <p className="text-xl font-bold text-black">Log in with MetaMask</p>
    </button>
  )
}
