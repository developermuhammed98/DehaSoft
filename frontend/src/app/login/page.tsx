"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/products");
        router.refresh();
      } else {
        setError(data.error || data.message || "Giriş yapılamadı. Bilgilerinizi kontrol edin.");
      }
    } catch (err) {
      setError("Sunucuya bağlanılamadı.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-[calc(100vh-160px)] overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-cyan-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      {/* Product sayfasıyla uyumlu açık tema arka plan efektleri */}
      <div className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-emerald-200/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-28 h-96 w-96 rounded-full bg-cyan-200/60 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-teal-100/70 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.95),transparent_44%)]" />

      <section className="relative mx-auto grid min-h-[calc(100vh-240px)] w-full max-w-7xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left visual panel */}
        <div className="hidden lg:block">
          <div className="relative overflow-hidden rounded-[2.7rem] border border-white/80 bg-white/82 p-10 shadow-2xl shadow-emerald-950/10 backdrop-blur-xl">
            <div className="absolute right-0 top-0 h-56 w-56 rounded-bl-[5rem] bg-gradient-to-br from-emerald-200/80 to-cyan-200/70" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-emerald-100/80" />

            <div className="relative">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Güvenli oturum açma
              </div>

              <h1 className="max-w-xl text-5xl font-black leading-tight tracking-tight text-slate-950">
                Mağazanıza kaldığınız yerden devam edin.
              </h1>

              <p className="mt-5 max-w-md text-lg leading-8 text-slate-600">
                Ürünlerinizi, siparişlerinizi ve stok süreçlerinizi modern Dehasoft panelinizden hızlıca yönetin.
              </p>

              <div className="mt-10 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-3xl border border-white bg-white/80 p-4 shadow-lg shadow-emerald-950/5">
                  <p className="text-2xl font-black text-slate-950">24/7</p>
                  <p className="mt-1 text-xs font-black uppercase tracking-wider text-slate-400">Erişim</p>
                </div>
                <div className="rounded-3xl border border-white bg-white/80 p-4 shadow-lg shadow-emerald-950/5">
                  <p className="text-2xl font-black text-emerald-600">SSL</p>
                  <p className="mt-1 text-xs font-black uppercase tracking-wider text-slate-400">Güvenlik</p>
                </div>
                <div className="rounded-3xl border border-white bg-white/80 p-4 shadow-lg shadow-emerald-950/5">
                  <p className="text-2xl font-black text-cyan-600">3 Kur</p>
                  <p className="mt-1 text-xs font-black uppercase tracking-wider text-slate-400">Para Birimi</p>
                </div>
              </div>

              <div className="mt-10 space-y-4">
                <div className="flex items-start gap-4 rounded-3xl border border-white bg-white/80 p-5 shadow-lg shadow-emerald-950/5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
                      <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-black text-slate-950">Hızlı erişim</p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">Hesabınıza giriş yaparak ürün ve sipariş süreçlerinize hemen ulaşın.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-3xl border border-white bg-white/80 p-5 shadow-lg shadow-emerald-950/5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700">
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
                      <path d="M12 3 4 7v6c0 5 3.4 7.7 8 9 4.6-1.3 8-4 8-9V7l-8-4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-black text-slate-950">Güvenli giriş</p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">Proxy mimarisi ve güvenli oturum yapısıyla kontrollü erişim sağlayın.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-3xl border border-white bg-white/80 p-5 shadow-lg shadow-emerald-950/5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
                      <path d="M4 19V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M8 17V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M12 17V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M16 17v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M20 19H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-black text-slate-950">Satış takibi</p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">Sipariş, stok ve ürün süreçlerinizi tek merkezden takip edin.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Login card */}
        <div className="mx-auto w-full max-w-md">
          <div className="overflow-hidden rounded-[2.4rem] border border-white/80 bg-white/90 shadow-2xl shadow-emerald-950/10 backdrop-blur-xl">
            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-cyan-50 px-6 pb-7 pt-8 text-center sm:px-8">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-[3.5rem] bg-gradient-to-br from-emerald-200/80 to-cyan-200/70" />
              <div className="absolute -bottom-14 -left-14 h-32 w-32 rounded-full bg-emerald-100/80" />

              <div className="relative">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-600 to-cyan-400 text-white shadow-lg shadow-emerald-500/25">
                  <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden="true">
                    <path d="M12 3 4 7v6c0 5 3.4 7.7 8 9 4.6-1.3 8-4 8-9V7l-8-4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                    <path d="m9.5 12.5 1.8 1.8 3.7-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-black uppercase tracking-wider text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Güvenli giriş
                </div>

                <h2 className="text-3xl font-black tracking-tight text-slate-950">Tekrar Hoş Geldiniz</h2>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
                  Devam etmek için hesabınıza giriş yapın.
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              {error && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold leading-6 text-red-700"
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-black text-slate-700" htmlFor="email">
                    E-posta Adresi
                  </label>
                  <div className="group relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 transition group-focus-within:text-emerald-600">
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                        <path d="M4 6.5h16v11H4v-11Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                        <path d="m4.5 7 7.5 6 7.5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <input
                      id="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 font-bold text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                      placeholder="ornek@gmail.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-black text-slate-700" htmlFor="password">
                    Şifre
                  </label>
                  <div className="group relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 transition group-focus-within:text-emerald-600">
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                        <path d="M7 10V8a5 5 0 0 1 10 0v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M6 10h12v10H6V10Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-14 font-bold text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-sm font-black text-slate-500 transition hover:text-emerald-700"
                      aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                    >
                      {showPassword ? "Gizle" : "Göster"}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-500 px-5 py-3.5 text-base font-black text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/30 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span className="absolute inset-0 bg-white/0 transition group-hover:bg-white/10" />
                  <span className="relative flex items-center gap-2">
                    {loading && (
                      <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z" />
                      </svg>
                    )}
                    {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
                  </span>
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-slate-600">
                Hesabınız yok mu?{" "}
                <Link href="/register" className="font-extrabold text-emerald-600 transition hover:text-emerald-700 hover:underline">
                  Hemen Kayıt Olun
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
