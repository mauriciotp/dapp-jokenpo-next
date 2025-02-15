'use client'

import { useWalletActionsContext } from '@/contexts/wallet-actions-context'
import { Button } from './button'
import { InstallMetamaskLink } from './install-metamask-link'

export function CallToAction() {
  const { isMetamaskInstalled } = useWalletActionsContext()

  return <>{isMetamaskInstalled ? <Button /> : <InstallMetamaskLink />}</>
}
