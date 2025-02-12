import { verifySession } from '@/data/actions/auth/verify-session'
import { NavbarHeader } from './navbar-header'

export async function Header() {
  const { isAuthenticated } = await verifySession()

  return (
    <header className="flex h-[80px] items-center justify-between py-4">
      <div>
        <h1 className="text-4xl font-bold">Dapp JoKenPo</h1>
      </div>
      <div>
        <NavbarHeader isAuthenticated={isAuthenticated} />
      </div>
    </header>
  )
}
