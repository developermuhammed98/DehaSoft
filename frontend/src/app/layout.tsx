import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dehasoft E-Ticaret",
  description: "Dehasoft E-Ticaret Test Projesi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${inter.className} min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 text-slate-900 antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <Navbar />

          <main className="flex-1">
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  borderRadius: "18px",
                  padding: "16px 18px",
                  color: "#0f172a",
                  background: "rgba(255,255,255,0.96)",
                  border: "1px solid rgba(226,232,240,0.9)",
                  boxShadow: "0 24px 70px -24px rgba(15,23,42,0.35)",
                  backdropFilter: "blur(16px)",
                  fontWeight: 700,
                },
                success: {
                  iconTheme: {
                    primary: "#059669",
                    secondary: "#ffffff",
                  },
                },
                error: {
                  iconTheme: {
                    primary: "#dc2626",
                    secondary: "#ffffff",
                  },
                },
              }}
            />
            {children}
          </main>

          <footer className="relative overflow-hidden border-t border-white/10 bg-slate-950 text-slate-300">
            {/* Footer glow */}
            <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-emerald-400/15 blur-3xl" />
            <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/50 to-transparent" />

            <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
              <div className="grid gap-8 lg:grid-cols-[1.15fr_0.75fr_0.75fr_0.9fr]">
                <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
                  <Link href="/" className="group inline-flex items-center gap-3">
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-cyan-400 text-xl font-black text-white shadow-lg shadow-emerald-500/25 transition group-hover:-translate-y-0.5 group-hover:shadow-xl group-hover:shadow-emerald-500/30">
                      D
                      <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-slate-950 bg-emerald-300" />
                    </div>
                    <div className="leading-none">
                      <span className="block text-2xl font-black tracking-tight text-white">dehasoft</span>
                      <span className="mt-1 block text-xs font-bold uppercase tracking-[0.24em] text-emerald-300">
                        E-Ticaret
                      </span>
                    </div>
                  </Link>

                  <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
                    Güvenli proxy katmanı, modern ürün yönetimi ve çoklu para birimi desteğiyle hazırlanmış e-ticaret test projesi.
                  </p>

                  <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
                      <p className="text-xl">🔒</p>
                      <p className="mt-1 text-xs font-black text-slate-400">Güvenli</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
                      <p className="text-xl">🛒</p>
                      <p className="mt-1 text-xs font-black text-slate-400">Sepet</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
                      <p className="text-xl">💱</p>
                      <p className="mt-1 text-xs font-black text-slate-400">Kur</p>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <h4 className="mb-4 text-sm font-black uppercase tracking-[0.24em] text-white">
                    Mağaza
                  </h4>
                  <ul className="space-y-3 text-sm font-bold">
                    <li>
                      <Link href="/products" className="group inline-flex items-center gap-2 text-slate-400 transition hover:text-white">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 transition group-hover:w-4" />
                        Ürünlerimiz
                      </Link>
                    </li>
                    <li>
                      <Link href="/cart" className="group inline-flex items-center gap-2 text-slate-400 transition hover:text-white">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 transition group-hover:w-4" />
                        Sepetim
                      </Link>
                    </li>
                    <li>
                      <Link href="/orders" className="group inline-flex items-center gap-2 text-slate-400 transition hover:text-white">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 transition group-hover:w-4" />
                        Siparişlerim
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="p-2">
                  <h4 className="mb-4 text-sm font-black uppercase tracking-[0.24em] text-white">
                    Yönetim
                  </h4>
                  <ul className="space-y-3 text-sm font-bold">
                    <li>
                      <Link href="/admin/products" className="group inline-flex items-center gap-2 text-slate-400 transition hover:text-white">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 transition group-hover:w-4" />
                        Ürün Yönetimi
                      </Link>
                    </li>
                    <li>
                      <Link href="/admin/orders" className="group inline-flex items-center gap-2 text-slate-400 transition hover:text-white">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 transition group-hover:w-4" />
                        Sipariş Yönetimi
                      </Link>
                    </li>
                    <li>
                      <Link href="/login" className="group inline-flex items-center gap-2 text-slate-400 transition hover:text-white">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 transition group-hover:w-4" />
                        Giriş Yap
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl">
                  <h4 className="text-sm font-black uppercase tracking-[0.24em] text-white">
                    Teknolojiler
                  </h4>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-black text-emerald-200">
                      Next.js 14
                    </span>
                    <span className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-black text-cyan-200">
                      Laravel 11
                    </span>
                    <span className="rounded-full border border-sky-300/20 bg-sky-400/10 px-3 py-1.5 text-xs font-black text-sky-200">
                      TailwindCSS
                    </span>
                    <span className="rounded-full border border-violet-300/20 bg-violet-400/10 px-3 py-1.5 text-xs font-black text-violet-200">
                      JWT Auth
                    </span>
                    <span className="rounded-full border border-amber-300/20 bg-amber-400/10 px-3 py-1.5 text-xs font-black text-amber-200">
                      httpOnly Cookie
                    </span>
                  </div>

                  <div className="mt-6 rounded-2xl border border-white/10 bg-white/10 p-4">
                    <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Sistem
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      API gizliliği için Next.js proxy handler üzerinden güvenli iletişim.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-slate-500 sm:flex-row">
                <p>© 2026 Dehasoft E-Ticaret Test Projesi. Tüm hakları saklıdır.</p>
                <div className="flex items-center gap-3 font-bold">
                  <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-emerald-300 ring-1 ring-emerald-300/20">
                    Güvenli Proxy
                  </span>
                  <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-cyan-300 ring-1 ring-cyan-300/20">
                    Modern Panel
                  </span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
