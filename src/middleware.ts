import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Delete all cookies present on the incoming request by reading the Cookie header
// and deleting each cookie on the NextResponse. We parse the header instead of
// relying on RequestCookies iteration to keep this resilient across Next.js
// versions / typings.
function clearAllCookies(req: NextRequest, res: NextResponse) {
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) return;
  const names = cookieHeader
    .split(";")
    .map((c) => c.split("=")[0].trim())
    .filter(Boolean);
  for (const name of names) {
    try {
      res.cookies.delete(name);
    } catch {
      // ignore deletion errors per-cookie
    }
  }
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const pathname = req.nextUrl.pathname;
  try {
    if (!token) {
      if (pathname === "/login") {
        return NextResponse.next();
      } else {
        const res = NextResponse.redirect(new URL("/login", req.url));
        clearAllCookies(req, res);
        return res;
      }
    }

    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    const currentTime = Math.floor(Date.now() / 1000);

    if (!payload.exp || payload.exp < currentTime) {
      console.log("Token expired. Redirecting to login.");
      if (pathname === "/login") {
        return NextResponse.next();
      } else {
        const res = NextResponse.redirect(new URL("/login", req.url));
        clearAllCookies(req, res);
        return res;
      }
    } else {
      if (pathname === "/login") {
        return NextResponse.redirect(new URL("/", req.url));
      } else {
        return NextResponse.next();
      }
    }
  } catch (error) {
    console.log("Middleware Token Error:" + error);
    if (pathname === "/login") {
      return NextResponse.next();
    } else {
      const res = NextResponse.redirect(new URL("/login", req.url));
      clearAllCookies(req, res);
      return res;
    }
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
