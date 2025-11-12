import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken');
  const refreshToken = request.cookies.get('refreshToken');
  const { pathname } = request.nextUrl;

  const isLoggedIn = accessToken && refreshToken;

  // 로그인이 필요한 페이지 경로
  const protectedPaths = ['/dashboard', '/my-roadmaps', '/school-connect', '/team-space'];
  // 로그인 상태에서 접근하면 안 되는 페이지 경로
  const publicOnlyPaths = ['/signin', '/signup'];

  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));
  const isPublicOnlyPath = publicOnlyPaths.some((path) => pathname.startsWith(path));

  if (isProtectedPath && !isLoggedIn) {
    // 보호된 경로에 로그인 없이 접근 시 로그인 페이지로 리디렉션
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  if (isPublicOnlyPath && isLoggedIn) {
    // 로그인 상태에서 public-only 경로 접근 시 대시보드로 리디렉션
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 루트 경로 접근 시 로그인 상태에 따라 리디렉션
  if (pathname === '/') {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  return NextResponse.next();
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
