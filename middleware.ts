import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

import { env } from "@/env";

const secret = new TextEncoder().encode(env.sessionSecret);
const cookieName = "travel_session";

const publicPaths = ["/login"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(cookieName)?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const result = await jwtVerify(token, secret);
    const role = result.payload.role;

    if (pathname === "/admin" || pathname.startsWith("/admin/")) {
      if (role !== "admin") {
        return NextResponse.redirect(new URL("/login?error=admin", request.url));
      }

      const url = request.nextUrl.clone();
      url.pathname = "/schedule";
      url.searchParams.set("mode", "admin");
      url.searchParams.set("subpage", pathname === "/admin" ? "overview" : pathname.replace("/admin/", ""));
      return NextResponse.rewrite(url);
    }

    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete(cookieName);
    return response;
  }
}

export const config = {
  matcher: ["/((?!.*\\.).*)"]
};
