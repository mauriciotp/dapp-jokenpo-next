'use client'

import { logout } from '@/data/actions/auth/logout'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavbarHeaderProps {
  isAuthenticated: boolean
}

export function NavbarHeader({ isAuthenticated }: NavbarHeaderProps) {
  const pathname = usePathname()

  return (
    <nav>
      <ul className="flex items-center gap-4 text-lg">
        <li>
          <Link
            href="/"
            className={`py-1 ${pathname === '/' ? 'border-b-2' : 'hover:border-b-2'}`}
          >
            Home
          </Link>
        </li>
        <li>
          <Link href="#" className="py-1 hover:border-b-2">
            About
          </Link>
        </li>
        {isAuthenticated ? (
          <li>
            <button
              onClick={logout}
              className="rounded border border-red-500 px-4 py-2 transition hover:bg-red-500"
            >
              Logout
            </button>
          </li>
        ) : null}
      </ul>
    </nav>
  )
}
