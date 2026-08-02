import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET_VALUE = process.env.JWT_SECRET;

if (!JWT_SECRET_VALUE) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_VALUE);

async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as {
      id: string;
      role: string;
    };
  } catch {
    return null;
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api/backend")) {
    const backendUrl =
      process.env.API_BASE_URL ??
      "https://personal-book-manager-backend-xeat.onrender.com";

    const cleanPath = pathname.replace("/api/backend", "/api");
    const targetUrl = new URL(cleanPath + req.nextUrl.search, backendUrl);

    return NextResponse.rewrite(targetUrl);
  }

  const token = req.cookies.get("token")?.value;

  const publicRoutes = ["/login", "/register"];
  const isPublicRoute = publicRoutes.includes(pathname);
  const isLoginPage = pathname === "/login";

  const user = token ? await verifyToken(token) : null;

  if (isLoginPage && user) {
    return NextResponse.redirect(new URL("/analytics", req.url));
  }

  if (!isPublicRoute && !user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
