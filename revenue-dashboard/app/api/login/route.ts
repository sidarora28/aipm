import { NextResponse } from "next/server";
import { COOKIE, tokenFor, safeEqual } from "@/lib/auth";

export async function POST(req: Request) {
  const password = process.env.DASH_PASSWORD;
  if (!password) {
    return NextResponse.json({ ok: false, error: "Server has no DASH_PASSWORD set." }, { status: 503 });
  }

  let supplied = "";
  try {
    const body = (await req.json()) as { password?: string };
    supplied = String(body.password ?? "");
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  const want = await tokenFor(password);
  const got = await tokenFor(supplied);
  if (!safeEqual(got, want)) {
    return NextResponse.json({ ok: false, error: "Wrong password." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: COOKIE,
    value: want,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
