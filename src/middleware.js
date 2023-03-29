import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"

const secret = process.env.SECRET;

export async function middleware(req) {
    const session = await getToken({ req, secret, raw: true })
    const { pathname } = req.nextUrl;

    if (pathname.startsWith("/signin") || pathname.startsWith("/signup")) {
        if (session) {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    if (pathname === '/') {
        if (!session) {
            return NextResponse.redirect(new URL("/signin", req.url));
        }
    }
}
