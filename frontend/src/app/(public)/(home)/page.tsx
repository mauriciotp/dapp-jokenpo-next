'use client'

import { useEffect, useState } from 'react'
import { Button } from './_components/button'
import { InstallMetamaskLink } from './_components/install-metamask-link'

export default function Home() {
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    setIsMetamaskInstalled(typeof window.ethereum !== 'undefined')
  }, [])

  return (
    <div className="flex-1 content-center text-center">
      <h1 className="mb-2 text-3xl font-bold">Log in and play with us</h1>
      <p className="mb-4 text-xl">Play Rock Paper Scissors and earn prizes.</p>
      {isClient && (isMetamaskInstalled ? <Button /> : <InstallMetamaskLink />)}
    </div>
  )
}
