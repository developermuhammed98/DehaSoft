"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

type Product = {
  id: number;
  name: string;
  description: string;
  price: string | number;
  stock: number;
  image?: string;
};

type ExchangeRate = {
  currency: string;
  rate: string;
};

type SortOption = "featured" | "price-asc" | "price-desc" | "stock-desc";
type StockFilter = "all" | "in-stock" | "out-of-stock";

const fallbackRates: Record<string, number> = { USD: 0.031, EUR: 0.029 };

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [currency, setCurrency] = useState("TRY");
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [zoomTitle, setZoomTitle] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, rateRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/exchange-rates"),
        ]);

        if (prodRes.ok) {
          const prodData = await prodRes.json();
          setProducts(prodData.data || prodData);
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
      } catch (error) {
        console.error("Veri çekme hatası", error);
        toast.error("Ürünler yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setZoomImage(null);
      setZoomTitle("");
    }
  };

  window.addEventListener("keydown", handleEsc);

  return () => {
    window.removeEventListener("keydown", handleEsc);
  };
}, []);

  const parsePrice = (priceVal: string | number) => {
    return typeof priceVal === "string" ? parseFloat(priceVal) : priceVal;
  };

  const getPrice = (priceVal: string | number) => {
    const tryPrice = parsePrice(priceVal);

    if (currency === "TRY") return `₺${tryPrice.toFixed(2)}`;

    const rateObj = rates.find((r) => r.currency === currency);
    const rate = rateObj ? parseFloat(rateObj.rate) : fallbackRates[currency] || 1;
    const converted = tryPrice * rate;

    return currency === "USD" ? `$${converted.toFixed(2)}` : `€${converted.toFixed(2)}`;
  };

  const addToCart = async (productId: number) => {
    setAddingToCart(productId);

    try {
      const res = await fetch("/api/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, quantity: 1 }),
      });

      if (res.ok) {
        toast.success("Ürün sepete eklendi! 🛒");
      } else {
        if (res.status === 401) {
          toast.error("Sepete ürün eklemek için lütfen giriş yapın.");
          router.push("/login");
        } else {
          toast.error("Sepete eklenirken bir hata oluştu.");
        }
      }
    } catch (error) {
      toast.error("Sunucuya ulaşılamadı.");
    } finally {
      setAddingToCart(null);
    }
  };

  const toggleFavorite = (productId: number) => {
    setFavoriteIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const visibleProducts = useMemo(() => {
    let list = [...products];

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (product) =>
          product.name.toLowerCase().includes(q) ||
          product.description.toLowerCase().includes(q)
      );
    }

    if (stockFilter === "in-stock") {
      list = list.filter((product) => product.stock > 0);
    }

    if (stockFilter === "out-of-stock") {
      list = list.filter((product) => product.stock <= 0);
    }

    if (sortBy === "price-asc") {
      list.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    }

    if (sortBy === "price-desc") {
      list.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    }

    if (sortBy === "stock-desc") {
      list.sort((a, b) => b.stock - a.stock);
    }

    return list;
  }, [products, search, sortBy, stockFilter]);

  const totalStock = products.reduce((total, product) => total + product.stock, 0);
  const inStockCount = products.filter((product) => product.stock > 0).length;
  const featuredProduct = products[0];
  const secondProduct = products[1];

  if (loading) {
    return (
      <main className="relative min-h-[calc(100vh-160px)] overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-cyan-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-emerald-200/60 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-24 h-80 w-80 rounded-full bg-cyan-200/60 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-8 h-[420px] animate-pulse rounded-[2.5rem] bg-white/80 shadow-2xl shadow-emerald-950/10" />
          <div className="mb-8 h-28 animate-pulse rounded-[2rem] bg-white/80 shadow-lg shadow-emerald-950/5" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="rounded-[2rem] border border-white/80 bg-white/90 p-4 shadow-xl shadow-emerald-950/5">
                <div className="mb-5 h-56 animate-pulse rounded-[1.5rem] bg-slate-100" />
                <div className="mb-3 h-5 w-2/3 animate-pulse rounded-full bg-slate-100" />
                <div className="mb-6 h-4 w-full animate-pulse rounded-full bg-slate-100" />
                <div className="h-12 animate-pulse rounded-2xl bg-slate-100" />
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-[calc(100vh-160px)] overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-cyan-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      {/* Açık premium arka plan */}
      <div className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-emerald-200/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-28 h-96 w-96 rounded-full bg-cyan-200/60 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-teal-100/70 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.95),transparent_44%)]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Üst kampanya barı */}
        <div className="mb-5 overflow-hidden rounded-3xl border border-white/80 bg-white/70 shadow-lg shadow-emerald-950/5 backdrop-blur-xl">
          <div className="flex flex-col items-center justify-between gap-3 px-5 py-3 text-center sm:flex-row sm:text-left">
            <p className="text-sm font-black text-slate-700">
              <span className="mr-2 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">Bugüne özel</span>
              5.000₺ üzeri alışverişlerde ücretsiz kargo ve ekstra indirim.
            </p>
            <Link href="/cart" className="text-sm font-black text-cyan-700 hover:text-cyan-800 hover:underline">
              Sepete git →
            </Link>
          </div>
        </div>

        {/* Hero */}
        <section className="relative overflow-hidden rounded-[2.7rem] border border-white/80 bg-white/82 shadow-2xl shadow-emerald-950/10 backdrop-blur-xl">
          <div className="absolute right-0 top-0 h-52 w-52 rounded-bl-[5rem] bg-gradient-to-br from-emerald-200/80 to-cyan-200/70" />
          <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-emerald-100/80" />

          <div className="relative grid items-center gap-10 p-6 sm:p-8 lg:grid-cols-[1fr_0.95fr] lg:p-12">
            <div>
              <div className="mb-6 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Yeni sezon ürünleri
                </span>
                <span className="inline-flex items-center rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-black text-cyan-700">
                  Güvenli ödeme
                </span>
                <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-black text-amber-700">
                  Ücretsiz kargo
                </span>
              </div>

              <h1 className="max-w-3xl text-4xl font-black leading-[1.04] tracking-tight text-slate-950 sm:text-5xl lg:text-7xl">
                Alışverişin
                <span className="block bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                  en modern hali.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                Dehasoft mağazasında ürünleri keşfedin, para birimi değiştirin, stok durumunu görün ve güvenli sepet deneyimiyle siparişinizi tamamlayın.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#products"
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-500 px-8 py-4 text-base font-black text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/30"
                >
                  <span className="absolute inset-0 bg-white/0 transition group-hover:bg-white/10" />
                  <span className="relative flex items-center gap-2">
                    Alışverişe Başla
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="m13 6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </a>

                <Link
                  href="/cart"
                  className="inline-flex items-center justify-center rounded-2xl border border-cyan-200 bg-gradient-to-r from-cyan-50 to-emerald-50 px-8 py-4 text-base font-black text-cyan-700 shadow-sm transition hover:-translate-y-1 hover:border-cyan-300 hover:bg-white hover:shadow-xl hover:shadow-cyan-500/15"
                >
                  Sepeti Görüntüle
                </Link>
              </div>

              <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
                <div className="rounded-3xl border border-white bg-white/80 p-4 text-center shadow-lg shadow-emerald-950/5">
                  <p className="text-2xl font-black text-slate-950">{products.length}</p>
                  <p className="mt-1 text-xs font-black uppercase tracking-wider text-slate-400">Ürün</p>
                </div>
                <div className="rounded-3xl border border-white bg-white/80 p-4 text-center shadow-lg shadow-emerald-950/5">
                  <p className="text-2xl font-black text-emerald-600">{inStockCount}</p>
                  <p className="mt-1 text-xs font-black uppercase tracking-wider text-slate-400">Stokta</p>
                </div>
                <div className="rounded-3xl border border-white bg-white/80 p-4 text-center shadow-lg shadow-emerald-950/5">
                  <p className="text-2xl font-black text-cyan-600">{totalStock}</p>
                  <p className="mt-1 text-xs font-black uppercase tracking-wider text-slate-400">Adet</p>
                </div>
              </div>
            </div>

            {/* Sağ vitrin */}
            <div className="relative min-h-[430px]">
              <div className="absolute left-2 top-2 z-20 rounded-[2rem] border border-white bg-white/90 p-4 shadow-2xl shadow-emerald-950/10 backdrop-blur-xl sm:w-72">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-cyan-50 text-3xl shadow-inner">
                    {featuredProduct?.image ? (
                      <img src={featuredProduct.image} alt={featuredProduct.name} className="h-full w-full object-cover" />
                    ) : (
                      "🛍️"
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-slate-950">{featuredProduct?.name || "Öne çıkan ürün"}</p>
                    <p className="mt-1 text-lg font-black text-emerald-600">
                      {featuredProduct ? getPrice(featuredProduct.price) : "₺0.00"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute right-0 top-12 z-10 w-[82%] rounded-[2.4rem] border border-white bg-white p-5 shadow-2xl shadow-cyan-950/15">
                <div className="relative flex h-72 items-center justify-center overflow-hidden rounded-[1.8rem] bg-gradient-to-br from-emerald-50 via-white to-cyan-50 shadow-inner">
                  <div className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-xs font-black text-emerald-700 shadow-sm">
                    Çok Satan
                  </div>
                  {secondProduct?.image ? (
                    <img src={secondProduct.image} alt={secondProduct.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-36 w-36 items-center justify-center rounded-[2.2rem] bg-gradient-to-br from-emerald-500 to-cyan-400 text-7xl shadow-2xl shadow-cyan-500/25">
                      🎧
                    </div>
                  )}
                </div>

                <div className="mt-5 flex items-end justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-xl font-black text-slate-950">
                      {secondProduct?.name || "Premium Teknoloji Ürünü"}
                    </p>
                    <div className="mt-2 flex items-center gap-1 text-amber-400">
                      <span>★</span><span>★</span><span>★</span><span>★</span><span className="text-slate-300">★</span>
                      <span className="ml-2 text-xs font-black text-slate-400">4.8</span>
                    </div>
                  </div>
                  <p className="shrink-0 text-2xl font-black text-emerald-600">
                    {secondProduct ? getPrice(secondProduct.price) : "₺0.00"}
                  </p>
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

        {/* Güven / avantaj kartları */}
        <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-[2rem] border border-white/80 bg-white/80 p-5 shadow-xl shadow-emerald-950/5 backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-950/10">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-3xl">🚚</div>
              <div>
                <p className="font-black text-slate-950">Hızlı Teslimat</p>
                <p className="text-sm leading-6 text-slate-500">Siparişleriniz hızlıca hazırlanır.</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/80 bg-white/80 p-5 shadow-xl shadow-emerald-950/5 backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-950/10">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 text-3xl">🔒</div>
              <div>
                <p className="font-black text-slate-950">Güvenli Alışveriş</p>
                <p className="text-sm leading-6 text-slate-500">Proxy mimarisiyle korumalı istekler.</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/80 bg-white/80 p-5 shadow-xl shadow-emerald-950/5 backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-950/10">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-3xl">💱</div>
              <div>
                <p className="font-black text-slate-950">Çoklu Para Birimi</p>
                <p className="text-sm leading-6 text-slate-500">TRY, USD ve EUR fiyat görünümü.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Filtre paneli */}
        <section id="products" className="mt-12">
          <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.28em] text-emerald-600">Mağaza vitrini</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">Ürünlerimiz</h2>
              <p className="mt-3 max-w-2xl text-slate-600">Aradığınız ürünü bulun, stok durumunu kontrol edin ve favorilerinizi sepete ekleyin.</p>
            </div>

            <div className="inline-flex rounded-2xl border border-white/80 bg-white/85 p-1.5 shadow-lg shadow-emerald-950/5 backdrop-blur-xl">
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

          <div className="mb-8 rounded-[2rem] border border-white/80 bg-white/80 p-4 shadow-2xl shadow-emerald-950/8 backdrop-blur-xl">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_220px_220px]">
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
                  placeholder="Ürün adı veya açıklamada ara..."
                  className="w-full rounded-2xl border border-slate-100 bg-white py-4 pl-12 pr-5 font-bold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-400/10"
                />
              </div>

              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value as StockFilter)}
                className="rounded-2xl border border-slate-100 bg-white px-5 py-4 font-bold text-slate-800 shadow-sm outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-400/10"
              >
                <option value="all">Tüm ürünler</option>
                <option value="in-stock">Stokta olanlar</option>
                <option value="out-of-stock">Tükenenler</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="rounded-2xl border border-slate-100 bg-white px-5 py-4 font-bold text-slate-800 shadow-sm outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-400/10"
              >
                <option value="featured">Öne çıkanlar</option>
                <option value="price-asc">Fiyat: düşükten yükseğe</option>
                <option value="price-desc">Fiyat: yüksekten düşüğe</option>
                <option value="stock-desc">Stok: çoktan aza</option>
              </select>
            </div>
          </div>

          {visibleProducts.length === 0 ? (
            <div className="rounded-[2.2rem] border border-white/80 bg-white/90 p-12 text-center shadow-2xl shadow-emerald-950/10 backdrop-blur-xl">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-gradient-to-br from-emerald-100 to-cyan-100 text-4xl">🔎</div>
              <h3 className="text-3xl font-black text-slate-950">Ürün bulunamadı</h3>
              <p className="mx-auto mt-3 max-w-md text-slate-500">Arama veya filtreleri değiştirerek tekrar deneyebilirsiniz.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleProducts.map((product, index) => {
                const isOutOfStock = product.stock <= 0;
                const isFavorite = favoriteIds.includes(product.id);
                const stockPercent = Math.min(Math.max(product.stock, 0), 20) * 5;
                const fakeOldPrice = parsePrice(product.price) * 1.18;

                return (
                  <article
                    key={product.id}
                    className="group relative flex h-full flex-col overflow-hidden rounded-[2.2rem] border border-white/80 bg-white p-4 shadow-xl shadow-emerald-950/7 transition duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-950/14"
                  >
                    <div className="absolute left-6 top-6 z-20 rounded-full bg-gradient-to-r from-emerald-600 to-cyan-500 px-3 py-1.5 text-xs font-black text-white shadow-lg shadow-emerald-500/20">
                      {index % 3 === 0 ? "Çok Satan" : index % 3 === 1 ? "Yeni" : "Fırsat"}
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleFavorite(product.id)}
                      className={`absolute right-6 top-6 z-20 flex h-10 w-10 items-center justify-center rounded-full border shadow-sm backdrop-blur transition hover:scale-105 ${
                        isFavorite
                          ? "border-red-100 bg-red-50 text-red-500"
                          : "border-white bg-white/85 text-slate-400 hover:text-red-500"
                      }`}
                      aria-label="Favorilere ekle"
                    >
                      ♥
                    </button>

                    <div className="relative mb-5 overflow-hidden rounded-[1.8rem] bg-gradient-to-br from-emerald-50 via-white to-cyan-50 shadow-inner">
                      <div
                        className={`absolute bottom-4 right-4 z-10 rounded-full px-3 py-1.5 text-xs font-black shadow-sm backdrop-blur ${
                          isOutOfStock ? "bg-red-50 text-red-600" : "bg-white/90 text-emerald-700"
                        }`}
                      >
                        {isOutOfStock ? "Tükendi" : `${product.stock} stok`}
                      </div>

                      <div className="flex h-64 items-center justify-center overflow-hidden">
                           {product.image ? (
                          <button
                            type="button"
                            onClick={() => {
                              setZoomImage(product.image || null);
                              setZoomTitle(product.name);
                            }}
                            className="group/image relative h-full w-full cursor-zoom-in overflow-hidden"
                            aria-label={`${product.name} görselini büyüt`}
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                            />

                            <div className="absolute inset-0 bg-slate-950/0 transition group-hover/image:bg-slate-950/10" />

                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-4 py-2 text-xs font-black text-slate-700 opacity-0 shadow-lg backdrop-blur transition group-hover/image:opacity-100">
                              Yakınlaştır
                            </div>
                          </button>
                           ) : (
                          <div className="flex h-32 w-32 items-center justify-center rounded-[2.2rem] bg-white text-5xl font-black uppercase tracking-tighter text-slate-300 shadow-xl shadow-emerald-950/5 transition duration-700 group-hover:scale-110">
                            {product.name.substring(0, 2)}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col px-1 pb-1">
                      <div className="mb-2 flex items-center gap-1 text-amber-400">
                        <span>★</span><span>★</span><span>★</span><span>★</span><span className="text-slate-300">★</span>
                        <span className="ml-2 text-xs font-black text-slate-400">4.{8 - (index % 3)}</span>
                      </div>

                      <h3 className="line-clamp-2 text-lg font-black leading-snug text-slate-950">{product.name}</h3>
                      <p className="mb-5 mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{product.description}</p>

                      <div className="mb-4 rounded-2xl bg-slate-50 p-3">
                        <div className="mb-2 flex items-center justify-between text-xs font-black text-slate-400">
                          <span>Stok durumu</span>
                          <span>{isOutOfStock ? "Tükendi" : "Mevcut"}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className={`h-full rounded-full ${isOutOfStock ? "bg-red-400" : "bg-gradient-to-r from-emerald-500 to-cyan-400"}`}
                            style={{ width: `${isOutOfStock ? 100 : Math.max(stockPercent, 16)}%` }}
                          />
                        </div>
                      </div>

                      <div className="mt-auto rounded-[1.6rem] bg-gradient-to-br from-slate-50 to-white p-4 ring-1 ring-slate-100">
                        <div className="mb-4 flex items-end justify-between gap-3">
                          <div>
                            <span className="text-xs font-black uppercase tracking-wider text-slate-400">Fiyat</span>
                            <div className="mt-1 flex items-end gap-2">
                              <p className="text-2xl font-black text-emerald-600">{getPrice(product.price)}</p>
                              <p className="pb-1 text-xs font-bold text-slate-400 line-through">{getPrice(fakeOldPrice)}</p>
                            </div>
                          </div>
                          <div className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-500 shadow-sm ring-1 ring-slate-100">{currency}</div>
                        </div>

                        <button
                          onClick={() => addToCart(product.id)}
                          disabled={isOutOfStock || addingToCart === product.id}
                          className="group/btn relative flex w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-500 px-4 py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/30 disabled:translate-y-0 disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-400 disabled:shadow-none"
                        >
                          <span className="absolute inset-0 bg-white/0 transition group-hover/btn:bg-white/10" />
                          <span className="relative flex items-center gap-2">
                            {addingToCart === product.id ? (
                              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : (
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13 5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
                              </svg>
                            )}
                            {isOutOfStock ? "Stokta Yok" : addingToCart === product.id ? "Ekleniyor..." : "Sepete Ekle"}
                          </span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
        {zoomImage && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-md"
            onClick={() => {
              setZoomImage(null);
              setZoomTitle("");
            }}
          >
            <div
              className="relative w-full max-w-6xl animate-[zoomIn_0.18s_ease-out]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Glow efektleri */}
              <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-emerald-400/25 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-cyan-400/25 blur-3xl" />

              {/* Kapat butonu */}
              <button
                type="button"
                onClick={() => {
                  setZoomImage(null);
                  setZoomTitle("");
                }}
                className="absolute -right-2 -top-14 z-20 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/70 bg-white/95 text-xl font-black text-slate-700 shadow-2xl shadow-slate-950/25 backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-red-50 hover:text-red-600"
                aria-label="Görseli kapat"
              >
                ✕
              </button>

              <div className="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/95 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
                {/* Üst başlık */}
                <div className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-r from-emerald-50 via-white to-cyan-50 px-5 py-4 sm:px-7">
                  <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-[2.5rem] bg-gradient-to-br from-emerald-200/70 to-cyan-200/60" />

                  <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-wider text-emerald-700">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Ürün görseli
                      </div>

                      <h3 className="line-clamp-1 text-xl font-black text-slate-950 sm:text-2xl">
                        {zoomTitle}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1.5 text-xs font-black text-cyan-700">
                        Yakınlaştırılmış görünüm
                      </span>

                      <span className="hidden rounded-full border border-slate-100 bg-white px-3 py-1.5 text-xs font-black text-slate-500 shadow-sm sm:inline-flex">
                        ESC ile kapat
                      </span>
                    </div>
                  </div>
                </div>

                {/* Görsel alanı */}
                <div className="relative flex max-h-[78vh] min-h-[360px] items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_center,rgba(236,253,245,0.95),rgba(255,255,255,1)_45%,rgba(207,250,254,0.55))] p-4 sm:p-8">
                  <div className="pointer-events-none absolute left-6 top-6 h-24 w-24 rounded-full bg-emerald-200/40 blur-2xl" />
                  <div className="pointer-events-none absolute bottom-6 right-6 h-28 w-28 rounded-full bg-cyan-200/50 blur-2xl" />

                  <img
                    src={zoomImage}
                    alt={zoomTitle}
                    className="relative max-h-[68vh] w-auto max-w-full rounded-[2rem] border border-white bg-white object-contain p-2 shadow-2xl shadow-emerald-950/15"
                  />
                </div>

                {/* Alt bilgi */}
                <div className="flex flex-col gap-3 border-t border-slate-100 bg-white px-5 py-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                  <p className="font-bold">
                    Görseli kapatmak için boş alana tıklayabilir veya ESC tuşuna basabilirsiniz.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setZoomImage(null);
                      setZoomTitle("");
                    }}
                    className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/30"
                  >
                    Kapat
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
    </main>
  );
}