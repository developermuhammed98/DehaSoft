"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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
  user?: { name: string; email: string };
};

const currencySymbol = (currency: string) => {
  if (currency === "USD") return "$";
  if (currency === "EUR") return "€";
  return "₺";
};

const formatMoney = (value: string | number, currency: string) => {
  const price = typeof value === "string" ? parseFloat(value) : value;
  return `${currencySymbol(currency)}${price?.toFixed(2)}`;
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openOrderId, setOpenOrderId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");

      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else if (res.status === 401) {
        toast.error("Yetkiniz yok.");
        router.push("/login");
      }
    } catch (e) {
      console.error(e);
      toast.error("Siparişler yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    setUpdatingOrderId(id);

    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        await fetchOrders();
        toast.success("Sipariş durumu güncellendi!");
      } else {
        toast.error("Durum güncellenemedi.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Durum güncellenemedi.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          label: "Beklemede",
          icon: "⏳",
          badge: "border-amber-200 bg-amber-50 text-amber-700",
          dot: "bg-amber-500",
          panel: "from-amber-50 to-white",
        };
      case "completed":
        return {
          label: "Onaylandı, Hazırlanıyor",
          icon: "✅",
          badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
          dot: "bg-emerald-500",
          panel: "from-emerald-50 to-white",
        };
      case "cancelled":
        return {
          label: "İptal Edildi",
          icon: "✕",
          badge: "border-red-200 bg-red-50 text-red-700",
          dot: "bg-red-500",
          panel: "from-red-50 to-white",
        };
      default:
        return {
          label: status,
          icon: "📦",
          badge: "border-slate-200 bg-slate-50 text-slate-700",
          dot: "bg-slate-500",
          panel: "from-slate-50 to-white",
        };
    }
  };

  const filteredOrders = useMemo(() => {
    let list = [...orders];

    if (statusFilter !== "all") {
      list = list.filter((order) => order.status === statusFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter((order) => {
        const orderNo = `ord-${order.id.toString().padStart(6, "0")}`;
        return (
          orderNo.includes(q) ||
          order.user?.name?.toLowerCase().includes(q) ||
          order.user?.email?.toLowerCase().includes(q) ||
          order.items?.some((item) => item.product?.name?.toLowerCase().includes(q))
        );
      });
    }

    return list;
  }, [orders, search, statusFilter]);

  const stats = useMemo(() => {
    const pending = orders.filter((order) => order.status === "pending").length;
    const completed = orders.filter((order) => order.status === "completed").length;
    const cancelled = orders.filter((order) => order.status === "cancelled").length;
    const totalItems = orders.reduce((sum, order) => {
      return sum + (order.items?.reduce((itemSum, item) => itemSum + item.quantity, 0) || 0);
    }, 0);

    return { pending, completed, cancelled, totalItems };
  }, [orders]);

  if (loading) {
    return (
      <main className="relative min-h-[calc(100vh-160px)] overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-cyan-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-emerald-200/50 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-24 h-80 w-80 rounded-full bg-cyan-200/50 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-8 h-64 animate-pulse rounded-[2.4rem] bg-white/80 shadow-2xl shadow-emerald-950/10" />
          <div className="mb-6 h-24 animate-pulse rounded-[2rem] bg-white/80 shadow-lg shadow-emerald-950/5" />
          <div className="space-y-5">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-72 animate-pulse rounded-[2rem] bg-white/90 shadow-xl shadow-emerald-950/5" />
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
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-teal-100/70 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.92),transparent_42%)]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <section className="mb-8 overflow-hidden rounded-[2.4rem] border border-white/80 bg-white/80 shadow-2xl shadow-emerald-950/10 backdrop-blur-xl">
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_420px] lg:p-10">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Yönetici sipariş paneli
              </div>

              <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Sipariş Yönetimi
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
                Müşteri siparişlerini görüntüleyin, ürün detaylarını kontrol edin ve sipariş durumlarını hızlıca yönetin.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-3xl border border-white bg-white/80 p-5 shadow-lg shadow-emerald-950/5">
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">Toplam Sipariş</p>
                <p className="mt-2 text-3xl font-black text-slate-950">{orders.length}</p>
              </div>
              <div className="rounded-3xl border border-white bg-white/80 p-5 shadow-lg shadow-emerald-950/5">
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">Bekleyen</p>
                <p className="mt-2 text-3xl font-black text-amber-600">{stats.pending}</p>
              </div>
              <div className="rounded-3xl border border-white bg-white/80 p-5 shadow-lg shadow-emerald-950/5">
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">Onaylanan</p>
                <p className="mt-2 text-3xl font-black text-emerald-600">{stats.completed}</p>
              </div>
              <div className="rounded-3xl border border-white bg-white/80 p-5 shadow-lg shadow-emerald-950/5">
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">Ürün Adedi</p>
                <p className="mt-2 text-3xl font-black text-cyan-600">{stats.totalItems}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="mb-8 rounded-[2rem] border border-white/80 bg-white/80 p-4 shadow-xl shadow-emerald-950/5 backdrop-blur-xl">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_240px]">
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-slate-400">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="m21 21-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" stroke="currentColor" strokeWidth="2" />
                </svg>
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Sipariş no, müşteri adı, e-posta veya ürün ara..."
                className="w-full rounded-2xl border border-slate-100 bg-white py-4 pl-12 pr-5 font-bold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-400/10"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-2xl border border-slate-100 bg-white px-5 py-4 font-bold text-slate-800 shadow-sm outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-400/10"
            >
              <option value="all">Tüm durumlar</option>
              <option value="pending">Bekleyenler</option>
              <option value="completed">Onaylananlar</option>
              <option value="cancelled">İptal edilenler</option>
            </select>
          </div>
        </section>

        {filteredOrders.length === 0 ? (
          <section className="rounded-[2.2rem] border border-white/80 bg-white/90 p-10 text-center shadow-2xl shadow-emerald-950/10 backdrop-blur-xl sm:p-12">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-emerald-100 to-cyan-100 text-5xl shadow-inner">
              📋
            </div>
            <h2 className="text-3xl font-black text-slate-950">Sipariş bulunamadı</h2>
            <p className="mx-auto mt-3 max-w-md text-slate-500">
              Arama veya durum filtresini değiştirerek tekrar deneyebilirsiniz.
            </p>
          </section>
        ) : (
          <section className="space-y-6">
            {filteredOrders.map((order) => {
              const status = getStatusConfig(order.status);
              const isUpdating = updatingOrderId === order.id;
              const orderNumber = `#ORD-${order.id.toString().padStart(6, "0")}`;
              const itemCount = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
              const isOpen = openOrderId === order.id;

              return (
                <article
                  key={order.id}
                  className="overflow-hidden rounded-[2.2rem] border border-white/80 bg-white/90 shadow-2xl shadow-emerald-950/8 backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-emerald-950/12"
                >
                  <div className={`bg-gradient-to-br ${status.panel} p-5 sm:p-6`}>
                    <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.4rem] bg-gradient-to-br from-emerald-600 to-cyan-500 text-2xl text-white shadow-lg shadow-emerald-500/25">
                          {status.icon}
                        </div>

                        <div className="min-w-0">
                          <div className="mb-3 flex flex-wrap items-center gap-2">
                            <h2 className="text-2xl font-black text-slate-950">{orderNumber}</h2>
                            <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wider ${status.badge}`}>
                              <span className={`h-2 w-2 rounded-full ${status.dot}`} />
                              {status.label}
                            </span>
                          </div>

                          <div className="grid gap-3 sm:grid-cols-3">
                            <div className="rounded-2xl border border-white bg-white/75 px-4 py-3 shadow-sm">
                              <p className="text-xs font-black uppercase tracking-wider text-slate-400">Müşteri</p>
                              <p className="mt-1 truncate font-black text-slate-950">{order.user?.name || "Bilinmiyor"}</p>
                              <p className="truncate text-xs font-bold text-slate-500">{order.user?.email || "E-posta yok"}</p>
                            </div>

                            <div className="rounded-2xl border border-white bg-white/75 px-4 py-3 shadow-sm">
                              <p className="text-xs font-black uppercase tracking-wider text-slate-400">Tarih</p>
                              <p className="mt-1 font-black text-slate-950">{formatDate(order.created_at)}</p>
                              <p className="text-xs font-bold text-slate-500">Oluşturulma tarihi</p>
                            </div>

                            <div className="rounded-2xl border border-white bg-white/75 px-4 py-3 shadow-sm">
                              <p className="text-xs font-black uppercase tracking-wider text-slate-400">Toplam</p>
                              <p className="mt-1 text-xl font-black text-emerald-600">
                                {formatMoney(order.total_price, order.currency)}
                              </p>
                              <p className="text-xs font-bold text-slate-500">{itemCount} ürün · {order.currency}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 sm:flex-row xl:shrink-0">
                        {order.status === "pending" ? (
                          <>
                            <button
                              onClick={() => updateStatus(order.id, "completed")}
                              disabled={isUpdating}
                              className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/30 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                              <span className="absolute inset-0 bg-white/0 transition group-hover:bg-white/10" />
                              <span className="relative flex items-center gap-2">
                                {isUpdating && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                                Onayla
                              </span>
                            </button>

                            <button
                              onClick={() => updateStatus(order.id, "cancelled")}
                              disabled={isUpdating}
                              className="inline-flex items-center justify-center rounded-2xl border border-red-100 bg-red-50 px-5 py-3 text-sm font-black text-red-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-red-500 hover:text-white disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                              İptal Et
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => updateStatus(order.id, "pending")}
                            disabled={isUpdating}
                            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            {isUpdating ? "Güncelleniyor..." : "Beklemeye Al"}
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setOpenOrderId(isOpen ? null : order.id)}
                          className="inline-flex items-center justify-center rounded-2xl border border-cyan-100 bg-cyan-50 px-5 py-3 text-sm font-black text-cyan-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-cyan-100"
                        >
                          {isOpen ? "Detayları Gizle" : "Detayları Göster"}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6">
                    <div className="mb-5 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-600">Sipariş ürünleri</p>
                        <h3 className="mt-1 text-2xl font-black text-slate-950">Ürün Detayları</h3>
                      </div>
                      <span className="rounded-full bg-slate-50 px-4 py-2 text-sm font-black text-slate-500 ring-1 ring-slate-100">
                        {itemCount} adet
                      </span>
                    </div>

                    <div className="grid gap-4">
                      {(isOpen ? order.items : order.items?.slice(0, 2))?.map((item) => {
                        const lineTotal = (typeof item.unit_price === "string" ? parseFloat(item.unit_price) : item.unit_price) * item.quantity;

                        return (
                          <div
                            key={item.id}
                            className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-slate-50 p-4 transition hover:bg-white hover:shadow-lg hover:shadow-emerald-950/5 sm:flex-row sm:items-center sm:justify-between"
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
                                <p className="truncate text-base font-black text-slate-950">{item.product?.name}</p>
                                <p className="mt-1 text-sm font-bold text-slate-500">{item.quantity} adet sipariş edildi</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 sm:min-w-[260px]">
                              <div className="rounded-2xl bg-white px-4 py-3 text-right shadow-sm">
                                <p className="text-xs font-black uppercase tracking-wider text-slate-400">Birim</p>
                                <p className="mt-1 font-black text-slate-800">{formatMoney(item.unit_price, order.currency)}</p>
                              </div>
                              <div className="rounded-2xl bg-white px-4 py-3 text-right shadow-sm">
                                <p className="text-xs font-black uppercase tracking-wider text-slate-400">Satır</p>
                                <p className="mt-1 font-black text-emerald-600">{formatMoney(lineTotal, order.currency)}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
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
