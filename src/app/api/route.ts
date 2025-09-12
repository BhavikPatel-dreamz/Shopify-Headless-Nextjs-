import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET() {
  return NextResponse.json({ status: "ok" });
}

export async function POST(req: Request) {
  try {
    const { secret, path } = await req.json();
    if (!secret || secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (typeof path !== "string" || path.length === 0) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }
    revalidatePath(path);
    return NextResponse.json({ revalidated: true, path });
  } catch (e: unknown) {
    const message = typeof e === "object" && e && "message" in e ? String((e as { message?: unknown }).message) : "Bad request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}


