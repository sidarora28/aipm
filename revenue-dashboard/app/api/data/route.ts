import { NextResponse } from "next/server";
import { loadData } from "@/lib/sheet";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const data = await loadData();
    return NextResponse.json({ configured: true, ...data });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg === "NOT_CONFIGURED") {
      return NextResponse.json({ configured: false }, { status: 200 });
    }
    return NextResponse.json({ configured: true, error: msg }, { status: 502 });
  }
}
