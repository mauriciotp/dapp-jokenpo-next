'use client'

import { logout } from '@/data/actions/auth/logout'
import { ButtonHTMLAttributes } from 'react'

export function LogoutButton({
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  async function handleLogout() {
    await logout()
  }

  return (
    <button
      {...props}
      onClick={handleLogout}
      className="rounded border border-red-500 px-4 py-2 transition hover:bg-red-500"
    >
      Logout
    </button>
  )
}
