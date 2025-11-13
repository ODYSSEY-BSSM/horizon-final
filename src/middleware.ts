import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken');
  const refreshToken = request.cookies.get('refreshToken');
  const { pathname } = request.nextUrl;

  const isLoggedIn = !!(accessToken && refreshToken);

  const isAuthPage = pathname.startsWith('/signin') || pathname.startsWith('/signup');

  if (isLoggedIn) {
    if (isAuthPage) {
      const url = new URL('/dashboard', request.url);
      url.searchParams.set('message', 'alreadyLoggedIn');
      return NextResponse.redirect(url);
    }
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/signin', request.url));
    }

    if (!isAuthPage) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
