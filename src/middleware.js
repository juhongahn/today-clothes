import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";


export async function middleware(req, res, event) {
    const session = await getToken({ req });
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
