import { NavbarHeader } from './navbar-header'

export function Header() {
  return (
    <header className="flex h-[80px] items-center justify-between py-4">
      <div>
        <h1 className="text-4xl font-bold">Dapp JoKenPo</h1>
      </div>
      <div>
        <NavbarHeader />
      </div>
    </header>
  )
}
