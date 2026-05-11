import { NextResponse } from "next/server";
import { fetchBackend } from "@/lib/backend";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const response = await fetchBackend("/auth/logout", {
      method: "POST",
    });

    // Başarılı da olsa, token geçersiz de olsa çerezi Next.js tarafından temizliyoruz
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");

    if (!response.ok) {
      return NextResponse.json({ message: "Çıkış yapıldı" }, { status: 200 });
    }

    return NextResponse.json({ message: "Çıkış başarılı" }, { status: 200 });

  } catch (error) {
    console.error("Logout Proxy Error:", error);
    // Hata olsa bile güvenliği sağlamak için cookie'yi siliyoruz
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");
    return NextResponse.json({ message: "Çıkış yapıldı" }, { status: 200 });
  }
}
