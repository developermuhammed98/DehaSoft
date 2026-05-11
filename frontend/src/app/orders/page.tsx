"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type OrderItem = {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: string | number;
  product: { name: string; image?: string };
};

type Order = {
  id: number;
  status: string;
  total_price: string | number;
  currency: string;
  created_at: string;
  items: OrderItem[];
};

const getCurrencySymbol = (currency: string) => {
  if (currency === "USD") return "$";
  if (currency === "EUR") return "€";
  return "₺";
};

const formatPrice = (value: string | number, currency: string) => {
  const price = typeof value === "string" ? parseFloat(value) : value;
  return `${getCurrencySymbol(currency)}${price?.toFixed(2)}`;
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [openOrderId, setOpenOrderId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setOrders(data || []);
      }
    } catch (e) {
      console.error("Siparişler yüklenirken hata:", e);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "completed":
        return {
          badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
          dot: "bg-emerald-500",
          icon: "✅",
          text: "Onaylandı, Hazırlanıyor",
          step: 2,
        };
      case "cancelled":
        return {
          badge: "border-red-200 bg-red-50 text-red-700",
          dot: "bg-red-500",
          icon: "✕",
          text: "İptal Edildi",
          step: 0,
        };
      default:
        return {
          badge: "border-amber-200 bg-amber-50 text-amber-700",
          dot: "bg-amber-500",
          icon: "⏳",
          text: "Beklemede",
          step: 1,
        };
    }
  };

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const totalItems = orders.reduce((sum, order) => {
      return sum + (order.items?.reduce((itemSum, item) => itemSum + item.quantity, 0) || 0);
    }, 0);
    const activeOrders = orders.filter((order) => order.status !== "cancelled").length;

    return { totalOrders, totalItems, activeOrders };
  }, [orders]);

  if (loading) {
    return (
      <main className="relative min-h-[calc(100vh-160px)] overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-cyan-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-emerald-200/50 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-24 h-80 w-80 rounded-full bg-cyan-200/50 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-8 h-56 animate-pulse rounded-[2rem] bg-white/75 shadow-xl shadow-emerald-950/5" />
          <div className="space-y-5">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-60 animate-pulse rounded-[2rem] bg-white/85 shadow-sm" />
            ))}
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
          <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Sipariş takip merkezi
              </div>

              <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Siparişlerim
              </h1>

              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                Geçmiş siparişlerinizi inceleyin, durumlarını takip edin ve ürün detaylarını hızlıca görüntüleyin.
              </p>
            </div>

            {orders.length > 0 && (
              <div className="grid grid-cols-3 gap-3 sm:min-w-[420px]">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 text-center shadow-sm">
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400">Sipariş</p>
                  <p className="mt-1 text-2xl font-black text-slate-950">{stats.totalOrders}</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 text-center shadow-sm">
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400">Aktif</p>
                  <p className="mt-1 text-2xl font-black text-emerald-600">{stats.activeOrders}</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 text-center shadow-sm">
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400">Ürün</p>
                  <p className="mt-1 text-2xl font-black text-cyan-600">{stats.totalItems}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {orders.length === 0 ? (
          <section className="rounded-[2.2rem] border border-white/80 bg-white/85 p-8 text-center shadow-2xl shadow-emerald-950/10 backdrop-blur-xl sm:p-12">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-emerald-100 to-cyan-100 text-5xl shadow-inner">
              📦
            </div>

            <h2 className="text-3xl font-black tracking-tight text-slate-950">Henüz siparişiniz yok</h2>
            <p className="mx-auto mt-3 max-w-md text-slate-500">
              Ürünleri inceleyip ilk siparişinizi oluşturabilir, sipariş geçmişinizi burada takip edebilirsiniz.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/products"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-500 px-8 py-4 text-base font-black text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/30"
              >
                <span className="absolute inset-0 bg-white/0 transition group-hover:bg-white/10" />
                <span className="relative flex items-center gap-2">
                  Ürünlere Git
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="m13 6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>

              <Link
                href="/cart"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-8 py-4 text-base font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
              >
                Sepetimi Gör
              </Link>
            </div>
          </section>
        ) : (
          <section className="space-y-6">
            {orders.map((order) => {
              const status = getStatusStyle(order.status);
              const orderNumber = `#ORD-${order.id.toString().padStart(6, "0")}`;
              const isOpen = openOrderId === order.id;
              const orderItemCount = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

              return (
                <article
                  key={order.id}
                  className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 shadow-2xl shadow-emerald-950/8 backdrop-blur-xl transition hover:-translate-y-0.5 hover:shadow-emerald-950/12"
                >
                  <div className="border-b border-slate-100 bg-gradient-to-r from-white via-emerald-50/60 to-cyan-50/60 p-5 sm:p-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-cyan-500 text-2xl text-white shadow-lg shadow-emerald-500/25">
                          {status.icon}
                        </div>
                        <div>
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <h2 className="text-xl font-black text-slate-950">{orderNumber}</h2>
                            <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-black ${status.badge}`}>
                              <span className={`h-2 w-2 rounded-full ${status.dot}`} />
                              {status.text}
                            </span>
                          </div>
                          <p className="text-sm font-bold text-slate-500">
                            {formatDate(order.created_at)} tarihinde oluşturuldu
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:min-w-[470px]">
                        <div className="rounded-2xl border border-white bg-white/75 p-4 shadow-sm">
                          <p className="text-xs font-black uppercase tracking-wider text-slate-400">Toplam</p>
                          <p className="mt-1 text-xl font-black text-emerald-600">
                            {formatPrice(order.total_price, order.currency)}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-white bg-white/75 p-4 shadow-sm">
                          <p className="text-xs font-black uppercase tracking-wider text-slate-400">Ürün</p>
                          <p className="mt-1 text-xl font-black text-slate-950">{orderItemCount} adet</p>
                        </div>
                        <div className="col-span-2 rounded-2xl border border-white bg-white/75 p-4 shadow-sm sm:col-span-1">
                          <p className="text-xs font-black uppercase tracking-wider text-slate-400">Para Birimi</p>
                          <p className="mt-1 text-xl font-black text-cyan-600">{order.currency}</p>
                        </div>
                      </div>
                    </div>

                    {order.status !== "cancelled" && (
                      <div className="mt-6 rounded-2xl border border-white bg-white/70 p-4 shadow-sm">
                        <div className="grid grid-cols-3 gap-3 text-center text-xs font-black text-slate-500">
                          <div className={status.step >= 1 ? "text-emerald-700" : "text-slate-400"}>Sipariş Alındı</div>
                          <div className={status.step >= 2 ? "text-emerald-700" : "text-slate-400"}>Hazırlanıyor</div>
                          <div className="text-slate-400">Teslimat</div>
                        </div>
                        <div className="mt-3 grid grid-cols-[1fr_1fr_1fr] items-center gap-2">
                          {[1, 2, 3].map((step) => (
                            <div key={step} className="flex items-center gap-2">
                              <div
                                className={`h-3 w-3 shrink-0 rounded-full ${
                                  status.step >= step ? "bg-gradient-to-r from-emerald-600 to-cyan-500" : "bg-slate-200"
                                }`}
                              />
                              <div
                                className={`h-1 flex-1 rounded-full ${
                                  status.step > step ? "bg-gradient-to-r from-emerald-600 to-cyan-500" : "bg-slate-200"
                                } ${step === 3 ? "hidden" : ""}`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-5 sm:p-6">
                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-600">Sipariş İçeriği</p>
                        <h3 className="mt-1 text-2xl font-black text-slate-950">Ürün Detayları</h3>
                      </div>

                      <button
                        type="button"
                        onClick={() => setOpenOrderId(isOpen ? null : order.id)}
                        className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
                      >
                        {isOpen ? "Detayları Gizle" : "Detayları Göster"}
                      </button>
                    </div>

                    <div className="grid gap-4">
                      {(isOpen ? order.items : order.items?.slice(0, 2))?.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white bg-white text-sm font-black uppercase tracking-tighter text-slate-300 shadow-sm">
                              {item.product?.image ? (
                                <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                              ) : (
                                item.product?.name.substring(0, 2).toUpperCase()
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-base font-black text-slate-900">{item.product?.name}</p>
                              <p className="mt-1 text-sm font-bold text-slate-500">Adet: {item.quantity}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-4 sm:block sm:text-right">
                            <p className="text-xs font-black uppercase tracking-wider text-slate-400">Birim Fiyat</p>
                            <p className="mt-1 text-lg font-black text-emerald-600">
                              {formatPrice(item.unit_price, order.currency)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {!isOpen && order.items?.length > 2 && (
                      <p className="mt-4 rounded-2xl bg-cyan-50 px-4 py-3 text-center text-sm font-bold text-cyan-700">
                        +{order.items.length - 2} ürün daha var. Tümünü görmek için detayları açın.
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
