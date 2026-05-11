import { NextResponse } from "next/server";
import { fetchBackend } from "@/lib/backend";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const res = await fetchBackend(`/products?${searchParams.toString()}`, { method: "GET" });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const res = await fetchBackend("/products", { method: "POST", body: JSON.stringify(body) });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
