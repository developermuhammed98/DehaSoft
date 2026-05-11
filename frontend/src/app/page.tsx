import Link from "next/link";

export default function Home() {
  return (
    <main className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-cyan-50 text-slate-900">
      {/* Açık tema arka plan efektleri */}
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-emerald-200/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-24 h-80 w-80 rounded-full bg-cyan-200/60 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-teal-100/70 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.94),transparent_42%)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        {/* Kampanya barı */}
        <div className="mb-6 overflow-hidden rounded-3xl border border-white/80 bg-white/75 shadow-lg shadow-emerald-950/5 backdrop-blur-xl">
          <div className="flex flex-col items-center justify-between gap-3 px-5 py-3 text-center sm:flex-row sm:text-left">
            <p className="text-sm font-black text-slate-700">
              <span className="mr-2 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">
                Yeni sezon
              </span>
              Güvenli alışveriş, hızlı sepet deneyimi ve çoklu para birimi desteği.
            </p>
            <Link href="/products" className="text-sm font-black text-cyan-700 transition hover:text-cyan-800 hover:underline">
              Ürünleri keşfet →
            </Link>
          </div>
        </div>

        {/* Hero */}
        <section className="relative overflow-hidden rounded-[2.7rem] border border-white/80 bg-white/82 shadow-2xl shadow-emerald-950/10 backdrop-blur-xl">
          <div className="absolute right-0 top-0 h-56 w-56 rounded-bl-[5rem] bg-gradient-to-br from-emerald-200/80 to-cyan-200/70" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-emerald-100/80" />

          <div className="relative grid items-center gap-10 p-6 sm:p-8 lg:grid-cols-[1fr_0.9fr] lg:p-12">
            <div>
              <div className="mb-6 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Güvenli Proxy Mimarisi
                </span>
                <span className="inline-flex items-center rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-black text-cyan-700">
                  Next.js + Laravel
                </span>
                <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-black text-amber-700">
                  httpOnly Cookie
                </span>
              </div>

              <h1 className="max-w-4xl text-4xl font-black leading-[1.04] tracking-tight text-slate-950 sm:text-5xl lg:text-7xl">
                Dehasoft ile
                <span className="block bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                  modern e-ticaret deneyimi.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                Next.js ve Laravel kullanılarak geliştirilmiş, API gizliliği sağlayan proxy katmanlı modern e-ticaret test projesi.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/products"
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-500 px-8 py-4 text-base font-black text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/30"
                >
                  <span className="absolute inset-0 bg-white/0 transition group-hover:bg-white/10" />
                  <span className="relative flex items-center gap-2">
                    Ürünleri İncele
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="m13 6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </Link>

                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-2xl border border-cyan-200 bg-gradient-to-r from-cyan-50 to-emerald-50 px-8 py-4 text-base font-black text-cyan-700 shadow-sm transition hover:-translate-y-1 hover:border-cyan-300 hover:bg-white hover:shadow-xl hover:shadow-cyan-500/15"
                >
                  Giriş Yap
                </Link>
              </div>

              <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
                <div className="rounded-3xl border border-white bg-white/80 p-4 text-center shadow-lg shadow-emerald-950/5">
                  <p className="text-2xl font-black text-slate-950">24/7</p>
                  <p className="mt-1 text-xs font-black uppercase tracking-wider text-slate-400">Erişim</p>
                </div>
                <div className="rounded-3xl border border-white bg-white/80 p-4 text-center shadow-lg shadow-emerald-950/5">
                  <p className="text-2xl font-black text-emerald-600">SSL</p>
                  <p className="mt-1 text-xs font-black uppercase tracking-wider text-slate-400">Güvenlik</p>
                </div>
                <div className="rounded-3xl border border-white bg-white/80 p-4 text-center shadow-lg shadow-emerald-950/5">
                  <p className="text-2xl font-black text-cyan-600">3 Kur</p>
                  <p className="mt-1 text-xs font-black uppercase tracking-wider text-slate-400">Para Birimi</p>
                </div>
              </div>
            </div>

            {/* Sağ vitrin alanı */}
            <div className="relative min-h-[430px]">
              <div className="absolute left-2 top-2 z-20 rounded-[2rem] border border-white bg-white/90 p-4 shadow-2xl shadow-emerald-950/10 backdrop-blur-xl sm:w-72">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-cyan-100 text-3xl shadow-inner">
                    🛒
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-950">Akıllı Sepet</p>
                    <p className="mt-1 text-xs font-bold text-slate-500">Hızlı ve güvenli sipariş akışı</p>
                  </div>
                </div>
              </div>

              <div className="absolute right-0 top-12 z-10 w-[82%] rounded-[2.4rem] border border-white bg-white p-5 shadow-2xl shadow-cyan-950/15">
                <div className="relative flex h-72 items-center justify-center overflow-hidden rounded-[1.8rem] bg-gradient-to-br from-emerald-50 via-white to-cyan-50 shadow-inner">
                  <div className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-xs font-black text-emerald-700 shadow-sm">
                    Vitrin Ürünü
                  </div>
                  <div className="flex h-36 w-36 items-center justify-center rounded-[2.2rem] bg-gradient-to-br from-emerald-500 to-cyan-400 text-7xl shadow-2xl shadow-cyan-500/25">
                    🛍️
                  </div>
                </div>

                <div className="mt-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xl font-black text-slate-950">Premium Teknoloji</p>
                    <div className="mt-2 flex items-center gap-1 text-amber-400">
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                      <span className="text-slate-300">★</span>
                      <span className="ml-2 text-xs font-black text-slate-400">4.8</span>
                    </div>
                  </div>
                  <p className="shrink-0 text-2xl font-black text-emerald-600">₺12.999</p>
                </div>
              </div>

              <div className="absolute bottom-8 left-6 z-30 rounded-[2rem] border border-white bg-white/90 p-5 shadow-2xl shadow-emerald-950/10 backdrop-blur-xl">
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">Kampanya</p>
                <p className="mt-1 text-3xl font-black text-slate-950">%25</p>
                <p className="text-sm font-bold text-emerald-600">sezon fırsatı</p>
              </div>
            </div>
          </div>
        </section>

        {/* Teknoloji / özellik kartları */}
        <section className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="rounded-[2rem] border border-white/80 bg-white/80 p-6 shadow-xl shadow-emerald-950/5 backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-950/10">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-2xl shadow-sm">
              🔒
            </div>
            <h3 className="text-xl font-black text-slate-950">İzole Edilmiş Backend</h3>
            <p className="mt-3 leading-7 text-slate-600">
              Tarayıcı Laravel API&apos;ye doğrudan istek atmaz. İletişim Next.js Proxy Handler üzerinden gerçekleşir.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/80 bg-white/80 p-6 shadow-xl shadow-emerald-950/5 backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-950/10">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 text-2xl shadow-sm">
              🍪
            </div>
            <h3 className="text-xl font-black text-slate-950">httpOnly Cookie</h3>
            <p className="mt-3 leading-7 text-slate-600">
              JWT token&apos;lar localStorage&apos;da saklanmaz. Güvenli çerezler ile XSS riskleri azaltılır.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/80 bg-white/80 p-6 shadow-xl shadow-emerald-950/5 backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-950/10">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-2xl shadow-sm">
              💱
            </div>
            <h3 className="text-xl font-black text-slate-950">Çoklu Para Birimi</h3>
            <p className="mt-3 leading-7 text-slate-600">
              Ürün fiyatlarını TRY, USD ve EUR cinsinden görüntüleyerek daha esnek alışveriş deneyimi sağlar.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
