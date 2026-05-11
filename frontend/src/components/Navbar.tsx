"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

function ProductsIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 6h7v5H4V6Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M13 6h7v5h-7V6Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M4 13h7v5H4v-5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M13 13h7v5h-7v-5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function CartIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M3 4h2l1.2 6m0 0h11.8l1.5-5H7.2m-1 5 1.1 5h10.9M9 20a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm9 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function OrdersIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M7 4h10l3 3v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M9 9h6M9 13h6M9 17h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function AdminProductsIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M8 10h8M8 14h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function AdminOrdersIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M8 4h8l3 3v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M9 10h6M9 14h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function Navbar() {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [rates, setRates] = useState<{ usd: string; eur: string } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await fetch("/api/auth/me");

        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData);
        } else if (userRes.status === 401) {
          setUser(null);
        }

        const ratesRes = await fetch("/api/exchange-rates");

        if (ratesRes.ok) {
          const ratesData = await ratesRes.json();

          if (ratesData && ratesData.rates) {
            const usdToTry = (1 / parseFloat(ratesData.rates.USD || "0.031")).toFixed(2);
            const eurToTry = (1 / parseFloat(ratesData.rates.EUR || "0.029")).toFixed(2);
            setRates({ usd: usdToTry, eur: eurToTry });
          }
        }
      } catch (error) {
        console.error("Navbar data fetch error:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);

    return () => clearInterval(interval);
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setMobileMenuOpen(false);
    router.push("/login");
  };

  const isActive = (href: string) => pathname === href;

  const navLinkClass = (href: string) =>
    `group relative inline-flex items-center gap-2.5 rounded-2xl px-4 py-2.5 text-sm font-bold transition-all ${
      isActive(href)
        ? "bg-gradient-to-r from-emerald-600 to-cyan-500 text-white shadow-lg shadow-emerald-500/20"
        : "text-slate-300 hover:bg-white/10 hover:text-white"
    }`;

  const mobileNavLinkClass = (href: string) =>
    `flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold transition-all ${
      isActive(href)
        ? "bg-gradient-to-r from-emerald-600 to-cyan-500 text-white shadow-lg shadow-emerald-500/20"
        : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
    }`;

  const navLinks = [
    { href: "/products", label: "Ürünler", icon: ProductsIcon },
    { href: "/orders", label: "Siparişlerim", icon: OrdersIcon },
  ];

  const adminLinks = [
    { href: "/admin/products", label: "Ürün Yönetimi", icon: AdminProductsIcon },
    { href: "/admin/orders", label: "Sipariş Yönetimi", icon: AdminOrdersIcon },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/85 text-white shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/50 to-transparent" />

      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-5 xl:gap-7">
            <Link href="/" className="group flex shrink-0 items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
              <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-cyan-400 text-xl font-black text-white shadow-lg shadow-emerald-500/25 transition group-hover:-translate-y-0.5 group-hover:shadow-xl group-hover:shadow-emerald-500/30">
                D
                <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-slate-950 bg-emerald-300" />
              </div>
              <div className="leading-none">
                <span className="block text-xl font-black tracking-tight text-white">dehasoft</span>
                <span className="mt-1 hidden text-xs font-bold uppercase tracking-[0.22em] text-emerald-300 sm:block">
                  E-Ticaret
                </span>
              </div>
            </Link>

            {rates && (
              <div className="hidden items-center gap-2 rounded-2xl border border-emerald-200/70 bg-white/80 px-3 py-2 text-xs font-bold text-slate-700 shadow-sm backdrop-blur-xl lg:flex">
                <span className="mr-1 text-[11px] font-black uppercase tracking-wider text-emerald-600">Kur</span>

                <div className="flex items-center gap-1.5" title="1 Amerikan Doları Kaç TL">
                  <span className="rounded-lg bg-emerald-50 px-2 py-1 font-black text-emerald-700">1 $</span>
                  <span className="text-slate-400">=</span>
                  <span className="font-black text-slate-900">{rates.usd} ₺</span>
                </div>

                <div className="mx-1 h-5 w-px bg-slate-200" />

                <div className="flex items-center gap-1.5" title="1 Euro Kaç TL">
                  <span className="rounded-lg bg-cyan-50 px-2 py-1 font-black text-cyan-700">1 €</span>
                  <span className="text-slate-400">=</span>
                  <span className="font-black text-slate-900">{rates.eur} ₺</span>
                </div>
              </div>
            )}
          </div>

          <nav className="hidden items-center gap-2 xl:flex">
            {navLinks.map((link) => {
              const Icon = link.icon;

              return (
                <Link key={link.href} href={link.href} className={navLinkClass(link.href)}>
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {user &&
              adminLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <Link key={link.href} href={link.href} className={navLinkClass(link.href)}>
                    <Icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            <Link
              href="/cart"
              className={`relative flex h-12 w-12 items-center justify-center rounded-2xl border transition hover:-translate-y-0.5 ${
                isActive("/cart")
                  ? "border-emerald-300/40 bg-gradient-to-br from-emerald-600 to-cyan-500 text-white shadow-lg shadow-emerald-500/25"
                  : "border-white/10 bg-white/10 text-slate-200 shadow-sm backdrop-blur-xl hover:bg-white/15 hover:text-white"
              }`}
              aria-label="Sepetim"
              title="Sepetim"
              onClick={() => setMobileMenuOpen(false)}
            >
              <CartIcon className="h-6 w-6" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-slate-950 bg-emerald-300 text-[9px] font-black text-emerald-950">
                •
              </span>
            </Link>

            {user ? (
              <div className="hidden items-center gap-3 md:flex">
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-3 py-2 backdrop-blur-xl">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-cyan-400 text-sm font-black text-white shadow-lg shadow-emerald-500/20">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div className="hidden leading-tight lg:block">
                    <p className="text-xs font-bold text-slate-400">Merhaba</p>
                    <p className="max-w-32 truncate text-sm font-black text-white">{user.name}</p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="rounded-2xl border border-red-300/20 bg-red-500/10 px-4 py-2.5 text-sm font-black text-red-200 transition hover:-translate-y-0.5 hover:bg-red-500/20 hover:text-white"
                >
                  Çıkış
                </button>
              </div>
            ) : (
              <div className="hidden items-center gap-3 md:flex">
                <Link
                  href="/login"
                  className="rounded-2xl border border-cyan-300/25 bg-cyan-500/10 px-5 py-2.5 text-sm font-black text-cyan-100 transition hover:-translate-y-0.5 hover:bg-cyan-500/20 hover:text-white"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/register"
                  className="rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-500 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/30"
                >
                  Kayıt Ol
                </Link>
              </div>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white transition hover:bg-white/15 xl:hidden"
              aria-label={mobileMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ) : (
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M4 12h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="pb-5 xl:hidden">
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl">
              {rates && (
                <div className="mb-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-3 text-center">
                    <p className="text-xs font-bold text-emerald-200">1 USD</p>
                    <p className="mt-1 text-lg font-black text-white">{rates.usd} ₺</p>
                  </div>
                  <div className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-3 text-center">
                    <p className="text-xs font-bold text-cyan-200">1 EUR</p>
                    <p className="mt-1 text-lg font-black text-white">{rates.eur} ₺</p>
                  </div>
                </div>
              )}

              <nav className="grid gap-2">
                <Link href="/cart" className={mobileNavLinkClass("/cart")} onClick={() => setMobileMenuOpen(false)}>
                  <span className="flex items-center gap-3">
                    <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                      <CartIcon className="h-5 w-5" />
                      <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-emerald-300" />
                    </span>
                    Sepetim
                  </span>
                  <span>→</span>
                </Link>

                {navLinks.map((link) => {
                  const Icon = link.icon;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={mobileNavLinkClass(link.href)}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                          <Icon className="h-4 w-4" />
                        </span>
                        {link.label}
                      </span>
                      <span>→</span>
                    </Link>
                  );
                })}

                {user &&
                  adminLinks.map((link) => {
                    const Icon = link.icon;

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={mobileNavLinkClass(link.href)}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className="flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                            <Icon className="h-4 w-4" />
                          </span>
                          {link.label}
                        </span>
                        <span>→</span>
                      </Link>
                    );
                  })}
              </nav>

              <div className="mt-4 border-t border-white/10 pt-4">
                {user ? (
                  <div className="grid gap-3">
                    <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-cyan-400 text-sm font-black text-white">
                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400">Giriş yapan kullanıcı</p>
                        <p className="font-black text-white">{user.name}</p>
                      </div>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="rounded-2xl border border-red-300/20 bg-red-500/10 px-4 py-3 text-sm font-black text-red-100 transition hover:bg-red-500/20"
                    >
                      Çıkış Yap
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-2xl border border-cyan-300/25 bg-cyan-500/10 px-4 py-3 text-center text-sm font-black text-cyan-100 transition hover:bg-cyan-500/20"
                    >
                      Giriş Yap
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-500 px-4 py-3 text-center text-sm font-black text-white shadow-lg shadow-emerald-500/25"
                    >
                      Kayıt Ol
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
