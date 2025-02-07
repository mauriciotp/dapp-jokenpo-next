'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function NavbarHeader() {
  const pathname = usePathname()

  return (
    <nav>
      <ul className="flex gap-4 text-lg">
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
      </ul>
    </nav>
  )
}
