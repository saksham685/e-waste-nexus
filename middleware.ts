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

  // 3. Always allow dedicated authentication routes to open
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/logout') ||
    pathname.startsWith('/auth')
  ) {
    return NextResponse.next();
  }

  // 4. Allow all features (Overview, Centers, Pickups, EPR, Analytics, Portals)
  // to open directly for all visitors with a seamless default session!
  const response = NextResponse.next();
  if (!token) {
    response.cookies.set('nexus_token', 'mock_jwt_citizen', { path: '/', maxAge: 86400 });
  }

  // 5. Attach Security Headers (Next.js Unit VI: Industry Practices & Security Best Practices)
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
