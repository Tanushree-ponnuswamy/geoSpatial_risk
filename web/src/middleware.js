import { NextResponse } from 'next/server';

export function middleware(request) {
    // CORS Check
    const origin = request.headers.get('origin');
    console.log(`[Middleware] Request from origin: ${origin}`);

    const response = NextResponse.next();

    // Apply CORS headers to API routes
    if (request.nextUrl.pathname.startsWith('/api')) {
        response.headers.set('Access-Control-Allow-Origin', '*'); // In prod, set to specific domain
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        // Handle Preflight OPTIONS requests directly
        if (request.method === 'OPTIONS') {
            return new NextResponse(null, {
                status: 200,
                headers: response.headers,
            });
        }
    }

    return response;
}

export const config = {
    matcher: '/api/:path*',
};
