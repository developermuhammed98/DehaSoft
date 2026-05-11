import { NextResponse } from "next/server";
import { fetchBackend } from "@/lib/backend";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetchBackend("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // Başarılı giriş: Token'ı httpOnly cookie olarak kaydet
    if (data.access_token) {
      const cookieStore = await cookies();
      cookieStore.set({
        name: "auth_token",
        value: data.access_token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: data.expires_in || 3600, // Varsayılan 1 saat
      });
    }

    // Token'ı client'a GÖNDERME! Sadece kullanıcı bilgilerini dön
    return NextResponse.json({
      message: "Giriş başarılı",
      user: data.user
    }, { status: 200 });

  } catch (error) {
    console.error("Login Proxy Error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
