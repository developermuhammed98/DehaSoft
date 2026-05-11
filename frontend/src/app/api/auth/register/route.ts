import { NextResponse } from "next/server";
import { fetchBackend } from "@/lib/backend";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetchBackend("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // Register sonrası direkt token dönüyorsa (backend login yapıyorsa) onu da cookie'ye alabiliriz.
    // Ancak senaryomuzda register sonrası login sayfasına yönlendirilir genelde.
    return NextResponse.json({
      message: "Kayıt başarılı",
      user: data.user
    }, { status: 201 });

  } catch (error) {
    console.error("Register Proxy Error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
