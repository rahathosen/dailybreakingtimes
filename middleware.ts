import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname;

  // Check if it's an admin path
  const isAdminPath = path.startsWith("/admin");
  const isAdminLoginPage = path === "/admin-login";

  // Check if it's a customer account path that needs protection
  const isAccountPath = path.startsWith("/account");

  // Get the auth tokens
  const adminSession = request.cookies.get("admin_session")?.value;
  const authToken = request.cookies.get("auth_token")?.value;

  // Handle admin routes (existing logic)
  if (isAdminPath && !isAdminLoginPage && !adminSession) {
    const url = new URL("/admin-login", request.url);
    return NextResponse.redirect(url);
  }

  if (isAdminLoginPage && adminSession) {
    try {
      const session = JSON.parse(
        Buffer.from(adminSession, "base64").toString()
      );

      if (session.exp > Date.now()) {
        const url = new URL("/admin", request.url);
        return NextResponse.redirect(url);
      }
    } catch (error) {
      console.error("Session parsing error:", error);
    }
  }

  // Continue with the request for all other cases
  return NextResponse.next();
}

// Configure the middleware to run on specific routes
export const config = {
  matcher: ["/admin/:path*", "/admin-login"],
};
