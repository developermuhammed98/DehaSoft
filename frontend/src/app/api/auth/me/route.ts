import { NextResponse } from "next/server";
import { fetchBackend } from "@/lib/backend";

export async function GET() {
  try {
    const response = await fetchBackend("/auth/me", {
      method: "GET",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Me Proxy Error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
