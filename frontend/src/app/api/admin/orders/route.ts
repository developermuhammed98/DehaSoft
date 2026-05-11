import { NextResponse } from "next/server";
import { fetchBackend } from "@/lib/backend";

export async function GET(request: Request) {
  try {
    const res = await fetchBackend("/admin/orders", { method: "GET" });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
