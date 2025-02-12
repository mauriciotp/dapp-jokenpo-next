import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from './data/actions/auth/verify-session'

const publicRoutes = [
  {
    path: '/',
    whenAuthenticated: 'redirect',
  },
] as const

const REDIRECT_WHEN_AUTHENTICATED_ROUTE = '/dashboard'
const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = '/'

export default async function Middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  const publicRoute = publicRoutes.find((route) => route.path === path)

  const { isAuthenticated } = await verifySession()

  if (
    publicRoute &&
    isAuthenticated &&
    publicRoute.whenAuthenticated === 'redirect'
  ) {
    const redirectUrl = req.nextUrl.clone()

    redirectUrl.pathname = REDIRECT_WHEN_AUTHENTICATED_ROUTE

    return NextResponse.redirect(redirectUrl)
  }

  if (!publicRoute && !isAuthenticated) {
    const redirectUrl = req.nextUrl.clone()

    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE

    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

// Routes Middleware should not run on
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|assets/).*)',
  ],
}
