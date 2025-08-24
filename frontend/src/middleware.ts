import { auth } from "@/lib/auth/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const username = req.auth?.user?.username;
  const pathname = req.nextUrl.pathname;

  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password");

  const isApiAuthRoute = pathname.startsWith("/api/auth");
  const isHomePage = pathname === "/";

  // Allow auth API routes and public pages
  if (isApiAuthRoute || isHomePage) {
    return NextResponse.next();
  }

  // Redirect logged-in users away from auth pages to their profile
  if (isAuthPage && isLoggedIn && username) {
    return NextResponse.redirect(new URL(`/${username}`, req.url));
  }

  // User profile routes are protected by the (protected) layout
  // so we don't need additional checks here

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
