import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  console.log("Middleware running for URL: " + req.url);
}

export const config = {
  matcher: ["/((?!/login|api|_next/static|_next/image|favicon.ico).*)"],
};
