import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from '@/lib/auth/session'

export async function proxy(request: NextRequest) {
    if (!(await getSession())) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
    }
}

export const config = {
    matcher: '/admin/:path*',
}