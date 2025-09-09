import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  console.log("Middleware running for URL: " + req.url);

  //   const pathname = req.nextUrl.pathname;
  //   // Cho phép truy cập /login, /not_found và / cho tất cả
  //   if (
  //     pathname.startsWith("/login") ||
  //     pathname === "/not_found" ||
  //     pathname === "/"
  //   ) {
  //     return NextResponse.next();
  //   }
  //   const token = req.cookies.get("token")?.value;
  //   if (!token) {
  //     return NextResponse.redirect(new URL("/", req.url));
  //   }
  //   // decode token, nếu lỗi thì đưa về login
  //   try {
  //     const base64Url = token.split(".")[1];
  //     const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  //     const payload = JSON.parse(atob(base64));
  //     const currentTime = Math.floor(Date.now() / 1000);
  //     // Kiểm tra token hết hạn
  //     if (!payload.exp || payload.exp < currentTime) {
  //       console.log("Token expired. Redirecting to login.");
  //       return NextResponse.redirect(new URL("/", req.url));
  //     }
  //     // Lấy role từ token
  //     const role = payload.roleCode;
  //     // Kiểm tra phân quyền
  //     if (role === "R2" && !pathname.startsWith("/hr")) {
  //       // R2 chỉ được truy cập /hr
  //       return NextResponse.redirect(new URL("/not_found", req.url));
  //     } else if (role === "R3" && !pathname.startsWith("/manager")) {
  //       // R3 chỉ được truy cập /manager
  //       return NextResponse.redirect(new URL("/not_found", req.url));
  //     } else if (role === "R1" && !pathname.startsWith("/admin")) {
  //       // R1 chỉ được truy cập /admin
  //       return NextResponse.redirect(new URL("/not_found", req.url));
  //     } else if (
  //       role === "R4" &&
  //       (pathname.startsWith("/hr") ||
  //         pathname.startsWith("/manager") ||
  //         pathname.startsWith("/admin"))
  //     ) {
  //       // R4 không được truy cập /hr, /manager, /admin
  //       return NextResponse.redirect(new URL("/", req.url));
  //     }
  //   } catch (error) {
  //     console.log("Middleware Token Error:" + error);
  //     return NextResponse.redirect(new URL("/", req.url));
  //   }
  //   return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - login
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!/login|api|_next/static|_next/image|favicon.ico).*)",
  ],
};
