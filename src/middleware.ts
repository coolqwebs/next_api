import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, "1 h"),
});

export default withAuth(
  async function middleware(req) {
    const pathName = req.nextUrl.pathname;

    if (pathName.startsWith("/api")) {
      const ip = req.ip ?? "127.0.0.1";
      try {
        const { success } = await ratelimit.limit(ip);

        if (!success) {
          return NextResponse.json({ error: "Too Many Requests" });
        }

        return NextResponse.next();
      } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" });
      }
    }

    const token = await getToken({ req });
    const isAuth = !!token;

    const isAuthPage = pathName.startsWith("/login");

    const sensitiveRoutes = ["/dashboard"];

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      return null;
    }

    if (
      !isAuth &&
      sensitiveRoutes.some((route) => pathName.startsWith(route))
    ) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  },
  {
    callbacks: {
      async authorized() {
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/", "/login", "/dashboard/:path*", "/api/:path*"],
};
