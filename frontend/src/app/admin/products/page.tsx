"use client";

import { type ChangeEvent, type FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Product = {
  id: number;
  name: string;
  description: string;
  price: string | number;
  stock: number;
  image?: string;
};

type FormData = {
  name: string;
  description: string;
  price: string;
  stock: string;
  image: string;
};

type StockFilter = "all" | "in-stock" | "out-of-stock";
type ViewMode = "table" | "grid";

const emptyForm: FormData = {
  name: "",
  description: "",
  price: "",
  stock: "",
  image: "",
};

const parsePrice = (price: string | number) => {
  const value = typeof price === "string" ? parseFloat(price) : price;
  return Number.isFinite(value) ? value : 0;
};

const formatPrice = (price: string | number) => {
  return `₺${parsePrice(price).toFixed(2)}`;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [formLoading, setFormLoading] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");

      if (res.ok) {
        const data = await res.json();
        setProducts(data.data || data);
      } else if (res.status === 401) {
        toast.error("Yetkiniz yok.");
        router.push("/login");
      }
    } catch (e) {
      toast.error("Ürünler yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;

    setDeletingProductId(id);

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });

      if (res.ok) {
        await fetchProducts();
        toast.success("Ürün silindi.");
      } else if (res.status === 401) {
        toast.error("Yetkiniz yok.");
        router.push("/login");
      } else {
        toast.error("Ürün silinemedi.");
      }
    } catch (e) {
      toast.error("Ürün silinemedi.");
    } finally {
      setDeletingProductId(null);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      stock: product.stock.toString(),
      image: product.image || "",
    });
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (formLoading) return;
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData(emptyForm);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      const img = new Image();

      img.onload = () => {
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else if (height > MAX_HEIGHT) {
          width = Math.round((width * MAX_HEIGHT) / height);
          height = MAX_HEIGHT;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7);
        setFormData((prev) => ({ ...prev, image: compressedDataUrl }));
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);

    const url = editingProduct ? `/api/products/${editingProduct.id}` : "/api/products";
    const method = editingProduct ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock, 10),
          image: formData.image,
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingProduct(null);
        setFormData(emptyForm);
        await fetchProducts();
        toast.success(editingProduct ? "Ürün güncellendi!" : "Yeni ürün eklendi!");
      } else if (res.status === 401) {
        toast.error("Yetkiniz yok.");
        router.push("/login");
      } else {
        toast.error("İşlem başarısız.");
      }
    } catch (e) {
      toast.error("İşlem sırasında bir hata oluştu.");
    } finally {
      setFormLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (product) =>
          product.name.toLowerCase().includes(q) ||
          product.description?.toLowerCase().includes(q)
      );
    }

    if (stockFilter === "in-stock") list = list.filter((product) => product.stock > 0);
    if (stockFilter === "out-of-stock") list = list.filter((product) => product.stock <= 0);

    return list;
  }, [products, search, stockFilter]);

  const stats = useMemo(() => {
    const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
    const inStock = products.filter((product) => product.stock > 0).length;
    const outOfStock = products.filter((product) => product.stock <= 0).length;
    const inventoryValue = products.reduce((sum, product) => sum + parsePrice(product.price) * product.stock, 0);

    return { totalStock, inStock, outOfStock, inventoryValue };
  }, [products]);

  if (loading) {
    return (
      <main className="relative min-h-[calc(100vh-160px)] overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-cyan-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-emerald-200/50 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-24 h-80 w-80 rounded-full bg-cyan-200/50 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-8 h-64 animate-pulse rounded-[2.5rem] bg-white/80 shadow-2xl shadow-emerald-950/10" />
          <div className="mb-6 h-24 animate-pulse rounded-[2rem] bg-white/80 shadow-lg shadow-emerald-950/5" />
          <div className="grid gap-5 lg:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-36 animate-pulse rounded-[2rem] bg-white/90 shadow-xl shadow-emerald-950/5" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-[calc(100vh-160px)] overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-cyan-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-emerald-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-24 h-80 w-80 rounded-full bg-cyan-200/50 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-teal-100/70 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.92),transparent_42%)]" />

      <div className="relative mx-auto max-w-7xl">
        <section className="mb-8 overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/80 shadow-2xl shadow-emerald-950/10 backdrop-blur-xl">
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_460px] lg:p-10">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Yönetici ürün paneli
              </div>

              <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Ürün Yönetimi
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
                Ürünleri ekleyin, düzenleyin, stok durumunu takip edin ve mağaza vitrininizi profesyonel şekilde yönetin.
              </p>

              <button
                onClick={handleAddNew}
                className="group relative mt-7 inline-flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-500 px-7 py-4 text-base font-black text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/30"
              >
                <span className="absolute inset-0 bg-white/0 transition group-hover:bg-white/10" />
                <span className="relative flex items-center gap-2">
                  <span className="text-xl">+</span>
                  Yeni Ürün Ekle
                </span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-3xl border border-white bg-white/80 p-5 shadow-lg shadow-emerald-950/5">
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">Toplam Ürün</p>
                <p className="mt-2 text-3xl font-black text-slate-950">{products.length}</p>
              </div>
              <div className="rounded-3xl border border-white bg-white/80 p-5 shadow-lg shadow-emerald-950/5">
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">Stokta</p>
                <p className="mt-2 text-3xl font-black text-emerald-600">{stats.inStock}</p>
              </div>
              <div className="rounded-3xl border border-white bg-white/80 p-5 shadow-lg shadow-emerald-950/5">
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">Tükenen</p>
                <p className="mt-2 text-3xl font-black text-red-500">{stats.outOfStock}</p>
              </div>
              <div className="rounded-3xl border border-white bg-white/80 p-5 shadow-lg shadow-emerald-950/5">
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">Envanter</p>
                <p className="mt-2 text-2xl font-black text-cyan-600">{formatPrice(stats.inventoryValue)}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8 rounded-[2rem] border border-white/80 bg-white/80 p-4 shadow-xl shadow-emerald-950/5 backdrop-blur-xl">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_240px_210px]">
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

            <div className="grid grid-cols-2 rounded-2xl border border-slate-100 bg-white p-1.5 shadow-sm">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`rounded-xl px-4 py-2.5 text-sm font-black transition ${
                  viewMode === "table"
                    ? "bg-gradient-to-r from-emerald-600 to-cyan-500 text-white shadow-lg shadow-emerald-500/20"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                Liste
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`rounded-xl px-4 py-2.5 text-sm font-black transition ${
                  viewMode === "grid"
                    ? "bg-gradient-to-r from-emerald-600 to-cyan-500 text-white shadow-lg shadow-emerald-500/20"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                Kart
              </button>
            </div>
          </div>
        </section>

        {filteredProducts.length === 0 ? (
          <section className="rounded-[2.2rem] border border-white/80 bg-white/90 p-10 text-center shadow-2xl shadow-emerald-950/10 backdrop-blur-xl sm:p-12">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-emerald-100 to-cyan-100 text-5xl shadow-inner">
              🛍️
            </div>
            <h2 className="text-3xl font-black text-slate-950">Ürün bulunamadı</h2>
            <p className="mx-auto mt-3 max-w-md text-slate-500">Arama veya stok filtresini değiştirerek tekrar deneyebilirsiniz.</p>
            <button
              onClick={handleAddNew}
              className="mt-8 rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-500 px-7 py-4 text-base font-black text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/30"
            >
              Yeni Ürün Ekle
            </button>
          </section>
        ) : viewMode === "grid" ? (
          <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => {
              const isOutOfStock = product.stock <= 0;
              const stockPercent = Math.min(Math.max(product.stock, 0), 20) * 5;
              const isDeleting = deletingProductId === product.id;

              return (
                <article
                  key={product.id}
                  className="group overflow-hidden rounded-[2.2rem] border border-white/80 bg-white p-4 shadow-xl shadow-emerald-950/7 transition hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-950/12"
                >
                  <div className="relative mb-5 h-56 overflow-hidden rounded-[1.8rem] bg-gradient-to-br from-emerald-50 via-white to-cyan-50 shadow-inner">
                    <span
                      className={`absolute left-4 top-4 z-10 rounded-full px-3 py-1.5 text-xs font-black shadow-sm ${
                        isOutOfStock ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {isOutOfStock ? "Tükendi" : "Aktif"}
                    </span>
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-5xl font-black uppercase text-slate-300">
                        {product.name.substring(0, 2)}
                      </div>
                    )}
                  </div>

                  <h3 className="line-clamp-1 text-xl font-black text-slate-950">{product.name}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{product.description || "Açıklama eklenmemiş."}</p>

                  <div className="mt-5 rounded-3xl bg-slate-50 p-4">
                    <div className="mb-4 flex items-end justify-between">
                      <div>
                        <p className="text-xs font-black uppercase tracking-wider text-slate-400">Fiyat</p>
                        <p className="mt-1 text-2xl font-black text-emerald-600">{formatPrice(product.price)}</p>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-500 shadow-sm">{product.stock} adet</span>
                    </div>

                    <div className="mb-4 h-2 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className={`h-full rounded-full ${isOutOfStock ? "bg-red-400" : "bg-gradient-to-r from-emerald-500 to-cyan-400"}`}
                        style={{ width: `${isOutOfStock ? 100 : Math.max(stockPercent, 14)}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-black text-amber-700 transition hover:-translate-y-0.5 hover:bg-amber-100"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={isDeleting}
                        className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-black text-red-600 transition hover:-translate-y-0.5 hover:bg-red-500 hover:text-white disabled:opacity-70"
                      >
                        {isDeleting ? "Siliniyor..." : "Sil"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        ) : (
          <section className="overflow-hidden rounded-[2.2rem] border border-white/80 bg-white/90 shadow-2xl shadow-emerald-950/10 backdrop-blur-xl">
            <div className="hidden grid-cols-[92px_1fr_150px_150px_210px] gap-4 border-b border-slate-100 bg-gradient-to-r from-white via-emerald-50/70 to-cyan-50/70 px-6 py-4 text-sm font-black uppercase tracking-wider text-slate-500 lg:grid">
              <div>Görsel</div>
              <div>Ürün Bilgisi</div>
              <div>Fiyat</div>
              <div>Stok</div>
              <div className="text-right">İşlemler</div>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredProducts.map((product) => {
                const isOutOfStock = product.stock <= 0;
                const isDeleting = deletingProductId === product.id;
                const stockPercent = Math.min(Math.max(product.stock, 0), 20) * 5;

                return (
                  <article
                    key={product.id}
                    className="grid gap-5 p-5 transition hover:bg-emerald-50/35 lg:grid-cols-[92px_1fr_150px_150px_210px] lg:items-center lg:gap-4 lg:px-6"
                  >
                    <div className="flex items-center gap-4 lg:block">
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white bg-gradient-to-br from-emerald-50 to-cyan-50 text-sm font-black uppercase tracking-tighter text-slate-300 shadow-inner">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                        ) : (
                          product.name.substring(0, 2).toUpperCase()
                        )}
                      </div>
                      <div className="lg:hidden">
                        <p className="text-lg font-black text-slate-950">{product.name}</p>
                        <p className="mt-1 text-sm font-bold text-slate-500">{formatPrice(product.price)}</p>
                      </div>
                    </div>

                    <div className="min-w-0">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-lg font-black text-slate-950">{product.name}</h3>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-black ${
                            isOutOfStock ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {isOutOfStock ? "Tükendi" : "Aktif"}
                        </span>
                      </div>
                      <p className="line-clamp-2 max-w-2xl text-sm leading-6 text-slate-500">
                        {product.description || "Bu ürün için açıklama eklenmemiş."}
                      </p>
                    </div>

                    <div className="hidden lg:block">
                      <p className="text-xs font-black uppercase tracking-wider text-slate-400">Fiyat</p>
                      <p className="mt-1 text-xl font-black text-emerald-600">{formatPrice(product.price)}</p>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="text-xs font-black uppercase tracking-wider text-slate-400">Stok</span>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-black ${
                            isOutOfStock ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {product.stock} adet
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${isOutOfStock ? "bg-red-400" : "bg-gradient-to-r from-emerald-500 to-cyan-400"}`}
                          style={{ width: `${isOutOfStock ? 100 : Math.max(stockPercent, 14)}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row lg:justify-end">
                      <button
                        onClick={() => handleEdit(product)}
                        className="inline-flex items-center justify-center rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-black text-amber-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-amber-100"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={isDeleting}
                        className="inline-flex items-center justify-center rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-black text-red-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-red-500 hover:text-white disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {isDeleting ? "Siliniyor..." : "Sil"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
          <div className="relative max-h-[92vh] w-full max-w-2xl overflow-hidden rounded-[2.2rem] border border-white/80 bg-white shadow-2xl shadow-slate-950/25">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 bg-gradient-to-r from-emerald-50 via-white to-cyan-50 p-6 sm:p-8">
              <div>
                <div className="mb-3 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-wider text-emerald-700">
                  {editingProduct ? "Ürün düzenleme" : "Yeni ürün"}
                </div>
                <h2 className="text-3xl font-black tracking-tight text-slate-950">
                  {editingProduct ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
                </h2>
                <p className="mt-2 text-sm text-slate-500">Ürün bilgilerini doldurun ve mağaza vitrininizi güncelleyin.</p>
              </div>

              <button
                onClick={closeModal}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm transition hover:bg-slate-100 hover:text-slate-900"
                aria-label="Modalı kapat"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[calc(92vh-155px)] overflow-y-auto p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="rounded-[1.8rem] border border-slate-100 bg-slate-50 p-4">
                  <label className="mb-3 block text-sm font-black text-slate-700">Ürün Görseli</label>

                  <div className="grid gap-4 sm:grid-cols-[96px_1fr] sm:items-center">
                    <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border border-white bg-white text-xs font-black text-slate-300 shadow-inner">
                      {formData.image ? (
                        <img src={formData.image} alt="Ön izleme" className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-center">Görsel Yok</span>
                      )}
                    </div>

                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full cursor-pointer text-sm font-bold text-slate-500 file:mr-4 file:rounded-2xl file:border-0 file:bg-gradient-to-r file:from-emerald-600 file:to-cyan-500 file:px-5 file:py-3 file:text-sm file:font-black file:text-white hover:file:opacity-90"
                      />
                      <p className="mt-2 text-xs font-bold text-slate-400">JPG veya PNG yükleyin. Görsel otomatik olarak sıkıştırılır.</p>

                      {formData.image && (
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, image: "" }))}
                          className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-600 transition hover:bg-red-100"
                        >
                          Görseli Kaldır
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-black text-slate-700">Ürün İsmi</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 font-bold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-400/10"
                    placeholder="Örn: Kablosuz Kulaklık"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-black text-slate-700">Açıklama</label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-400/10"
                    placeholder="Ürünün kısa açıklamasını yazın..."
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-black text-slate-700">Fiyat (TRY)</label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 font-bold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-400/10"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-black text-slate-700">Stok Adedi</label>
                    <input
                      required
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData((prev) => ({ ...prev, stock: e.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 font-bold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-400/10"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="grid gap-3 pt-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-base font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
                  >
                    Vazgeç
                  </button>

                  <button
                    disabled={formLoading}
                    type="submit"
                    className="group relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-500 px-5 py-4 text-base font-black text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/30 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <span className="absolute inset-0 bg-white/0 transition group-hover:bg-white/10" />
                    <span className="relative flex items-center gap-2">
                      {formLoading && <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                      {formLoading ? "Kaydediliyor..." : editingProduct ? "Ürünü Güncelle" : "Ürünü Kaydet"}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
