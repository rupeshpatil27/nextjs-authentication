import { getToken } from "next-auth/jwt";
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
} from "./routes";
export { default } from "next-auth/middleware";

export async function proxy(request) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;
  const isLoggedIn = !!token;

  const isApiAuthRoute = url.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(url.pathname);
  const isAuthRoute = authRoutes.includes(url.pathname);
  
  if (isApiAuthRoute) {
    return null;
  }
  
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, url));
    }
    
    return null;
  }
  
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/sign-in", url));
  }

  return null;
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

// import { getToken } from "next-auth/jwt";
// import { NextResponse } from "next/server";
// export { default } from "next-auth/middleware";

// export async function proxy(request) {
//   const token = await getToken({ req: request });
//   const url = request.nextUrl;

//   if (
//     token &&
//     (url.pathname.startsWith("/sign-in") ||
//       url.pathname.startsWith("/sign-up") ||
//       url.pathname.startsWith("/verify") ||
//       url.pathname === "/")
//   ) {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }

//   if (!token && url.pathname.startsWith("/dashboard")) {
//     return NextResponse.redirect(new URL("/sign-in", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: "/sign-in",
//   matcher: "/sign-up",
//   matcher: "/",
//   matcher: "/verify/:path*",
// };
