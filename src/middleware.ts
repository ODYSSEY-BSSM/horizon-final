import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken');
  const refreshToken = request.cookies.get('refreshToken');
  const { pathname } = request.nextUrl;

  const isLoggedIn = !!(accessToken && refreshToken);
  const isAuthPage = pathname.startsWith('/signin') || pathname.startsWith('/signup');

  // 로그인 안 됨: (auth) 페이지만 접근 가능
  if (!isLoggedIn) {
    // /signin, /signup만 허용
    if (isAuthPage) {
      return NextResponse.next();
    }
    // 나머지는 모두 /signin으로 리다이렉트
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // 로그인 됨: (auth) 페이지 접근 시 대시보드로
  if (isLoggedIn) {
    if (isAuthPage) {
      const url = new URL('/dashboard', request.url);
      url.searchParams.set('message', 'alreadyLoggedIn');
      return NextResponse.redirect(url);
    }
    // 루트 경로도 대시보드로
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * 페이지 라우트만 매칭 (정적 파일 제외)
     */
    '/',
    '/signin',
    '/signup',
    '/dashboard',
    '/my-roadmaps/:path*',
    '/school-connect',
    '/team-space',
  ],
};
