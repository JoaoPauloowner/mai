import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type Experience = "mai" | "wact" | "shoppers";

function getExperience(pathname: string, cookie?: string): Experience {
  if (pathname === "/wact" || pathname.startsWith("/wact/")) return "wact";
  if (pathname === "/shoppers" || pathname.startsWith("/shoppers/")) return "shoppers";
  if (pathname === "/mai" || pathname.startsWith("/mai/")) return "mai";
  if (cookie === "wact" || cookie === "shoppers") return cookie;
  return "mai";
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const experience = getExperience(pathname, request.cookies.get("mai-experience")?.value);
  const isDashboard = pathname === "/dashboard" || pathname.startsWith("/dashboard/")
    || pathname === "/wact/dashboard" || pathname.startsWith("/wact/dashboard/")
    || pathname === "/mai/dashboard" || pathname.startsWith("/mai/dashboard/")
    || pathname === "/shoppers/dashboard" || pathname.startsWith("/shoppers/dashboard/");

  if (isDashboard && !request.cookies.has("omni-session")) {
    const loginUrl = new URL(`/${experience}/login`, request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-mai-experience", experience);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  if (pathname !== "/api" && !pathname.startsWith("/api/")) {
    response.cookies.set("mai-experience", experience, {
      path: "/",
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
