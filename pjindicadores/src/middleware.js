import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token');

  const isAuthPage = request.nextUrl.pathname.startsWith('/login');

  // ❌ No autenticado → lo mando al login
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // ✅ Ya autenticado → evitar volver al login
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/login']
};