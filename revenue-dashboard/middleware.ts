import { NextResponse, type NextRequest } from "next/server";
import { COOKIE, tokenFor, safeEqual } from "@/lib/auth";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon|login|api/login).*)"],
};

export async function middleware(req: NextRequest) {
  const password = process.env.DASH_PASSWORD;

  // No password configured: fail closed rather than serving revenue data open.
  if (!password) {
    return new NextResponse(
      "DASH_PASSWORD is not set. Add it in Vercel ▸ Settings ▸ Environment Variables, then redeploy.",
      { status: 503, headers: { "content-type": "text/plain" } }
    );
  }

  const got = req.cookies.get(COOKIE)?.value ?? "";
  const want = await tokenFor(password);
  if (got && safeEqual(got, want)) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.search = "";
  return NextResponse.redirect(url);
}
