import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Workaround/Patch for Next.js CVE: Unbounded postponed resume buffering
  // Block requests containing the 'next-resume' header.
  // This header is never valid when sent from an untrusted client and could lead to DoS if PPR is enabled.
  if (request.headers.get('next-resume')) {
    return new NextResponse(null, { status: 400, statusText: 'Bad Request' });
  }

  // Workaround/Patch for Next.js CVE: HTTP request smuggling in rewrites #19
  // Block chunked DELETE/OPTIONS requests on rewritten routes.
  if (
    (request.method === 'DELETE' || request.method === 'OPTIONS') &&
    request.headers.get('transfer-encoding')?.toLowerCase().includes('chunked')
  ) {
    return new NextResponse(null, { status: 400, statusText: 'Bad Request' });
  }

  // Workaround/Patch for Next.js CVEs: 
  // 1. 'null' origin can bypass Server Actions CSRF checks #17
  // 2. 'null' origin can bypass dev HMR websocket CSRF checks #16
  // Block explicit 'null' origin universally to prevent CSRF from sandboxed iframes (opaque contexts).
  // This also protects the /_next/webpack-hmr websocket upgrade endpoint during local development.
  if (request.headers.get('origin') === 'null') {
    return new NextResponse(null, { status: 403, statusText: 'Forbidden' });
  }

  return NextResponse.next();
}

// Optionally, you can configure the matcher to apply this only to certain paths, or leave it globally applied.
export const config = {
  matcher: '/:path*',
};
