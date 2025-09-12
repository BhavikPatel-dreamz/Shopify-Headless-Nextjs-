import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { token, maxAge } = await req.json();
  if (typeof token !== "string" || token.length === 0) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set("customerAccessToken", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: typeof maxAge === "number" ? maxAge : 60 * 60 * 24 * 30,
  });
  return res;
}


