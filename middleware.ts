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

  // 2. ROOT LINK DIRECT TO LOGIN: Jab koi link open kare, sabse pehle Login Page aayega!
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. Dedicated authentication routes (Always accessible)
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/logout') ||
    pathname.startsWith('/auth')
  ) {
    return NextResponse.next();
  }

  // 4. Read session token from cookie
  const token = request.cookies.get('nexus_token')?.value;
  const isAuthenticated = Boolean(token && token !== 'mock_jwt_citizen');

  // If not authenticated and visiting protected pages, redirect to login
  if (!isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 5. Attach Security Headers
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
