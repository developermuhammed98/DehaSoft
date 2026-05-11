"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

type CartItem = {
  id: number;
  product_id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: string | number;
    image?: string;
  };
};

type ExchangeRate = {
  currency: string;
  rate: string;
};

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [currency, setCurrency] = useState("TRY");
  const [loading, setLoading] = useState(true);
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const [cartRes, rateRes] = await Promise.all([
        fetch("/api/cart"),
        fetch("/api/exchange-rates"),
      ]);

      if (cartRes.status === 401) {
        router.push("/login");
        return;
      }

      if (cartRes.ok) {
        const data = await cartRes.json();
        setItems(data.cart?.items || []);
      }

      if (rateRes.ok) {
        const rateData = await rateRes.json();

        if (rateData.rates) {
          const ratesArray = Object.keys(rateData.rates).map((key) => ({
            currency: key,
            rate: rateData.rates[key],
          }));
          setRates(ratesArray);
        }
      }
    } catch (e) {
      console.error("Sepet yüklenirken hata:", e);
      toast.error("Sepet yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const parsePrice = (priceVal: string | number) => {
    return typeof priceVal === "string" ? parseFloat(priceVal) : priceVal;
  };

  const getPrice = (priceVal: string | number) => {
    const tryPrice = parsePrice(priceVal);

    if (currency === "TRY") return `₺${tryPrice.toFixed(2)}`;

    const rateObj = rates.find((r) => r.currency === currency);
    const fallbackRates: Record<string, number> = { USD: 0.031, EUR: 0.029 };
    const rate = rateObj ? parseFloat(rateObj.rate) : fallbackRates[currency] || 1;
    const converted = tryPrice * rate;

    return currency === "USD" ? `$${converted.toFixed(2)}` : `€${converted.toFixed(2)}`;
  };

  const updateQuantity = async (id: number, quantity: number) => {
    if (quantity < 1) return;

    setUpdatingItemId(id);

    try {
      const res = await fetch(`/api/cart/items/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });

      if (!res.ok) {
        toast.error("Miktar güncellenemedi.");
        return;
      }

      await fetchCart();
    } catch (e) {
      toast.error("Miktar güncellenemedi.");
    } finally {
      setUpdatingItemId(null);
    }
  };

  const removeItem = async (id: number) => {
    setUpdatingItemId(id);

    try {
      const res = await fetch(`/api/cart/items/${id}`, { method: "DELETE" });

      if (!res.ok) {
        toast.error("Ürün silinemedi.");
        return;
      }

      await fetchCart();
      toast.success("Ürün sepetten çıkarıldı.");
    } catch (e) {
      toast.error("Ürün silinemedi.");
    } finally {
      setUpdatingItemId(null);
    }
  };

  const checkout = async () => {
    setCheckingOut(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currency }),
      });

      if (res.ok) {
        toast.success("Siparişiniz başarıyla oluşturuldu! 🚀");
        router.push("/orders");
      } else {
        toast.error("Sipariş oluşturulamadı. Stok yetersiz olabilir.");
      }
    } catch (e) {
      toast.error("Bir hata oluştu.");
    } finally {
      setCheckingOut(false);
    }
  };

  const tryTotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const price = parsePrice(item.product.price);
      return sum + price * item.quantity;
    }, 0);
  }, [items]);

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const shippingPrice = 0;
  const discount = tryTotal > 5000 ? tryTotal * 0.05 : 0;
  const grandTotal = Math.max(tryTotal + shippingPrice - discount, 0);

  if (loading) {
    return (
      <main className="relative min-h-[calc(100vh-160px)] overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-cyan-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-emerald-200/50 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-24 h-80 w-80 rounded-full bg-cyan-200/50 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-8 h-56 animate-pulse rounded-[2rem] bg-white/70 shadow-xl" />
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-36 animate-pulse rounded-[2rem] bg-white/80 shadow-sm" />
              ))}
            </div>
            <div className="h-96 animate-pulse rounded-[2rem] bg-white/80 shadow-sm" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-[calc(100vh-160px)] overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-cyan-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      {/* Açık tema arka plan efektleri */}
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-emerald-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-24 h-80 w-80 rounded-full bg-cyan-200/50 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),transparent_42%)]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <section className="mb-8 overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 p-6 shadow-2xl shadow-emerald-950/10 backdrop-blur-xl sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Güvenli alışveriş sepeti
              </div>

              <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Sepetim
              </h1>

              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                Ürünlerinizi kontrol edin, adetleri düzenleyin ve siparişinizi güvenli şekilde tamamlayın.
              </p>
            </div>

            {items.length > 0 && (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-center shadow-sm">
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400">Sepette</p>
                  <p className="mt-1 text-2xl font-black text-slate-950">{totalQuantity} ürün</p>
                </div>

                <div className="inline-flex rounded-2xl border border-slate-100 bg-white p-1.5 shadow-sm">
                  {["TRY", "USD", "EUR"].map((curr) => (
                    <button
                      key={curr}
                      onClick={() => setCurrency(curr)}
                      className={`rounded-xl px-5 py-2.5 text-sm font-black transition-all ${
                        currency === curr
                          ? "bg-gradient-to-r from-emerald-600 to-cyan-500 text-white shadow-lg shadow-emerald-500/20"
                          : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {items.length === 0 ? (
          <section className="rounded-[2.2rem] border border-white/80 bg-white/85 p-8 text-center shadow-2xl shadow-emerald-950/10 backdrop-blur-xl sm:p-12">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-emerald-100 to-cyan-100 text-5xl shadow-inner">
              🛒
            </div>

            <h2 className="text-3xl font-black tracking-tight text-slate-950">Sepetiniz Boş</h2>
            <p className="mx-auto mt-3 max-w-md text-slate-500">
              Beğendiğiniz ürünleri sepete ekleyerek alışverişe başlayabilirsiniz.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/products"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-500 px-8 py-4 text-base font-black text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/30"
              >
                <span className="absolute inset-0 bg-white/0 transition group-hover:bg-white/10" />
                <span className="relative flex items-center gap-2">
                  Alışverişe Başla
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="m13 6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>

              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-8 py-4 text-base font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
              >
                Ana Sayfaya Dön
              </Link>
            </div>
          </section>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* Cart items */}
            <section className="space-y-4">
              {items.map((item) => {
                const itemTotal = parsePrice(item.product.price) * item.quantity;
                const isUpdating = updatingItemId === item.id;

                return (
                  <article
                    key={item.id}
                    className="group overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 p-4 shadow-xl shadow-emerald-950/5 backdrop-blur-xl transition hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-emerald-950/10 sm:p-5"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                      <div className="relative h-28 w-full overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-slate-100 to-cyan-50 shadow-inner sm:h-28 sm:w-28 sm:shrink-0">
                        {item.product?.image ? (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-3xl font-black uppercase tracking-tighter text-slate-300">
                            {item.product?.name.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1 text-center sm:text-left">
                        <div className="mb-2 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                          Sepette
                        </div>
                        <h3 className="truncate text-xl font-black text-slate-950">{item.product?.name}</h3>
                        <p className="mt-1 text-sm font-bold text-slate-400">Birim fiyat</p>
                        <p className="text-lg font-black text-emerald-600">{getPrice(item.product?.price)}</p>
                      </div>

                      <div className="flex items-center justify-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-2 shadow-inner">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || isUpdating}
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg font-black text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                          aria-label="Adedi azalt"
                        >
                          -
                        </button>
                        <span className="min-w-8 text-center text-lg font-black text-slate-900">
                          {isUpdating ? "…" : item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={isUpdating}
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg font-black text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                          aria-label="Adedi artır"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-center sm:min-w-32 sm:text-right">
                        <p className="text-xs font-black uppercase tracking-wider text-slate-400">Toplam</p>
                        <p className="mt-1 text-2xl font-black text-slate-950">{getPrice(itemTotal)}</p>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={isUpdating}
                        className="flex h-12 w-full items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-red-500 transition hover:-translate-y-0.5 hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:w-12 sm:shrink-0"
                        title="Kaldır"
                        aria-label="Ürünü sepetten kaldır"
                      >
                        {isUpdating ? (
                          <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </article>
                );
              })}
            </section>

            {/* Order summary */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 shadow-2xl shadow-emerald-950/10 backdrop-blur-xl">
                <div className="bg-gradient-to-r from-emerald-600 to-cyan-500 p-6 text-white">
                  <p className="text-sm font-black uppercase tracking-[0.22em] text-white/75">Ödeme</p>
                  <h3 className="mt-2 text-2xl font-black">Sipariş Özeti</h3>
                  <p className="mt-2 text-sm text-white/80">Siparişinizi kontrol edip güvenli şekilde tamamlayın.</p>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Ara Toplam</span>
                      <span className="font-black text-slate-900">{getPrice(tryTotal)}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600">
                      <span>Kargo</span>
                      <span className="font-black text-emerald-600">Ücretsiz</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600">
                      <span>Sepet İndirimi</span>
                      <span className="font-black text-emerald-600">
                        {discount > 0 ? `-${getPrice(discount)}` : "₺0.00"}
                      </span>
                    </div>
                  </div>

                  {discount > 0 ? (
                    <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-bold text-emerald-700">
                      5.000₺ üzeri alışveriş indirimi uygulandı.
                    </div>
                  ) : (
                    <div className="mt-5 rounded-2xl border border-cyan-100 bg-cyan-50 p-4 text-sm font-bold text-cyan-700">
                      5.000₺ üzeri sepetlerde ekstra %5 indirim kazanırsınız.
                    </div>
                  )}

                  <div className="my-6 h-px bg-slate-100" />

                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-sm font-black uppercase tracking-wider text-slate-400">Genel Toplam</p>
                      <p className="mt-1 text-xs font-bold text-slate-400">Seçili para birimi: {currency}</p>
                    </div>
                    <p className="text-3xl font-black text-emerald-600">{getPrice(grandTotal)}</p>
                  </div>

                  <button
                    onClick={checkout}
                    disabled={checkingOut}
                    className="group relative mt-7 flex w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-500 px-5 py-4 text-base font-black text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/30 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <span className="absolute inset-0 bg-white/0 transition group-hover:bg-white/10" />
                    <span className="relative flex items-center gap-2">
                      {checkingOut && <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                      {checkingOut ? "Sipariş oluşturuluyor..." : "Siparişi Tamamla"}
                    </span>
                  </button>

                  <Link
                    href="/products"
                    className="mt-3 flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-4 text-base font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
                  >
                    Alışverişe Devam Et
                  </Link>

                  <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <p className="text-xl">🔒</p>
                      <p className="mt-1 text-xs font-black text-slate-500">Güvenli</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <p className="text-xl">🚚</p>
                      <p className="mt-1 text-xs font-black text-slate-500">Ücretsiz</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <p className="text-xl">💱</p>
                      <p className="mt-1 text-xs font-black text-slate-500">Çoklu Kur</p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
