import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow static files, Next.js internal bundles, and API endpoints
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. Read session token from cookie
  const token = request.cookies.get('nexus_token')?.value;

  // 3. Public accessible routes (Landing, Centers Map, Pickups Board, Verification)
  const isPublicRoute =
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/logout') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/centers') ||
    pathname.startsWith('/verify') ||
    pathname.startsWith('/pickups') ||
    pathname === '/';

  // If user is already authenticated and visits /login or /signup, direct to dashboard
  if (token && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If on public page, let them proceed directly with auto guest session
  if (isPublicRoute) {
    const response = NextResponse.next();
    if (!token) {
      response.cookies.set('nexus_token', 'mock_jwt_citizen', { path: '/', maxAge: 86400 });
    }
    return response;
  }

  // 4. Role-Gated Admin & Partner Routes: require login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    if (pathname !== '/') {
      loginUrl.searchParams.set('redirect', pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // 5. Attach Security Headers (Next.js Unit VI: Industry Practices & Security Best Practices)
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
