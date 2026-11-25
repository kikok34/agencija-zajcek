"use client";

import React, { useState, useMemo } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import {
  Download,
  Sparkles,
  ArrowLeft,
  Filter,
  Check,
  ChevronDown,
  ShoppingBag,
  Eye,
  BookOpen,
} from "lucide-react";
import { CATALOGS } from "@/data/catalogs";
import { PRODUCTS, Product } from "@/data/products";
import { useModals } from "@/context/ModalContext";
import { useCart } from "@/context/CartContext";
import { useAnalytics } from "@/context/AnalyticsContext";

export default function CatalogDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const catalog = CATALOGS.find((c) => c.slug === slug);
  if (!catalog) {
    notFound();
  }

  const { openInquiry, openPdf } = useModals();
  const { addItem } = useCart();
  const { trackEvent } = useAnalytics();

  // Filters state
  const [maxPrice, setMaxPrice] = useState<number>(50);
  const [minQtyFilter, setMinQtyFilter] = useState<string>("all");
  const [selectedMaterial, setSelectedMaterial] = useState<string>("all");
  const [selectedColor, setSelectedColor] = useState<string>("all");
  const [selectedTechnique, setSelectedTechnique] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("popular");

  // Get products matching this catalog's category
  const categoryProducts = PRODUCTS.filter(
    (p) => p.category === catalog.categorySlug || catalog.featuredProductIds.includes(p.id)
  );

  // Collect available filter options dynamically
  const availableMaterials = useMemo(() => {
    const set = new Set<string>();
    categoryProducts.forEach((p) => {
      if (p.materials.toLowerCase().includes("bombaž")) set.add("Bombaž");
      if (p.materials.toLowerCase().includes("poliester") || p.materials.toLowerCase().includes("rpet")) set.add("rPET / Poliester");
      if (p.materials.toLowerCase().includes("kovina") || p.materials.toLowerCase().includes("aluminij")) set.add("Aluminij / Kovina");
      if (p.materials.toLowerCase().includes("bambus")) set.add("Bambus");
      if (p.materials.toLowerCase().includes("jeklo")) set.add("Nerjaveče jeklo");
      if (p.materials.toLowerCase().includes("keramika")) set.add("Keramika");
    });
    return Array.from(set);
  }, [categoryProducts]);

  const availableColors = useMemo(() => {
    const map = new Map<string, string>();
    categoryProducts.forEach((p) => {
      p.colors.forEach((c) => {
        if (!map.has(c.name)) map.set(c.name, c.hex);
      });
    });
    return Array.from(map.entries()).map(([name, hex]) => ({ name, hex }));
  }, [categoryProducts]);

  const availableTechniques = useMemo(() => {
    const set = new Set<string>();
    categoryProducts.forEach((p) => {
      p.printTechniques.forEach((t) => set.add(t));
    });
    return Array.from(set);
  }, [categoryProducts]);

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return categoryProducts
      .filter((p) => {
        // Price filter
        if (p.priceFrom > maxPrice) return false;

        // Min quantity
        if (minQtyFilter === "under50" && p.minQuantity >= 50) return false;
        if (minQtyFilter === "over50" && p.minQuantity < 50) return false;

        // Material filter
        if (selectedMaterial !== "all") {
          if (!p.materials.toLowerCase().includes(selectedMaterial.toLowerCase())) {
            return false;
          }
        }

        // Color filter
        if (selectedColor !== "all") {
          if (!p.colors.some((c) => c.name.toLowerCase().includes(selectedColor.toLowerCase()))) {
            return false;
          }
        }

        // Print technique
        if (selectedTechnique !== "all") {
          if (!p.printTechniques.includes(selectedTechnique)) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "priceAsc") return a.priceFrom - b.priceFrom;
        if (sortBy === "priceDesc") return b.priceFrom - a.priceFrom;
        return 0; // popularity default
      });
  }, [
    categoryProducts,
    maxPrice,
    minQtyFilter,
    selectedMaterial,
    selectedColor,
    selectedTechnique,
    sortBy,
  ]);

  const resetFilters = () => {
    setMaxPrice(50);
    setMinQtyFilter("all");
    setSelectedMaterial("all");
    setSelectedColor("all");
    setSelectedTechnique("all");
    setSortBy("popular");
  };

  const handleInquiryCatalog = () => {
    trackEvent(
      "quote_click",
      `Zahtevaj ponudbo za katalog: ${catalog.title}`,
      `Klik iz notranje strani kataloga`
    );
    openInquiry({
      catalogTitle: catalog.title,
      interest: catalog.categorySlug,
      source: `Notranja stran: ${catalog.title}`,
    });
  };

  const handleOpenPdf = () => {
    trackEvent("catalog_view", `Ogled PDF simulatorja: ${catalog.title}`, "Odpira se PDF viewer modal");
    openPdf(catalog);
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      sku: product.sku,
      name: product.name,
      price: product.priceFrom,
      image: product.images[0],
      color: product.colors[0]?.name,
      minQuantity: product.minQuantity,
    }, product.minQuantity);

    trackEvent(
      "cart_add",
      `Dodano v košarico iz kataloga: ${product.name}`,
      `${product.minQuantity} kos (${product.sku})`
    );
  };

  return (
    <div className="py-10 space-y-10">
      {/* Breadcrumb & Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/katalogi"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Nazaj na vse kataloge</span>
        </Link>

        {/* Hero Banner for this Catalog */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-accent-300 text-xs font-bold rounded-full uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{catalog.year} • {catalog.itemCount}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {catalog.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {catalog.fullIntro}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <button
                type="button"
                onClick={handleInquiryCatalog}
                className="px-6 py-3 bg-accent-500 hover:bg-accent-600 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Zahtevaj ponudbo za ta katalog</span>
              </button>

              <button
                type="button"
                onClick={handleOpenPdf}
                className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm rounded-xl border border-white/20 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4 text-accent-300" />
                <span>Prenesi PDF (Demo)</span>
              </button>
            </div>
          </div>

          <div className="w-48 sm:w-56 h-64 sm:h-72 rounded-2xl overflow-hidden shadow-2xl flex-shrink-0 border-2 border-white/20">
            <img
              src={catalog.coverImage}
              alt={catalog.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Main Filter & Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-200 h-fit">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <Filter className="w-4 h-4 text-brand-700" />
                <span>Filtri kataloga</span>
              </div>
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs text-brand-700 hover:underline"
              >
                Ponastavi
              </button>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Maksimalna cena: <span className="font-bold text-brand-900">{maxPrice} €</span>
              </label>
              <input
                type="range"
                min={1}
                max={50}
                step={1}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-brand-800"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>1 €</span>
                <span>50 €+</span>
              </div>
            </div>

            {/* Quantity Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Minimalna količina naročila
              </label>
              <select
                value={minQtyFilter}
                onChange={(e) => setMinQtyFilter(e.target.value)}
                className="w-full text-xs p-2 rounded-xl border border-slate-300 bg-white"
              >
                <option value="all">Vse količine</option>
                <option value="under50">Manjša naročila (do 50 kos)</option>
                <option value="over50">Večja naročila (50+ kos)</option>
              </select>
            </div>

            {/* Material Filter */}
            {availableMaterials.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Material
                </label>
                <select
                  value={selectedMaterial}
                  onChange={(e) => setSelectedMaterial(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="all">Vsi materiali</option>
                  {availableMaterials.map((mat) => (
                    <option key={mat} value={mat}>
                      {mat}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Color Filter */}
            {availableColors.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Barva artikla
                </label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedColor("all")}
                    className={`px-2.5 py-1 text-[11px] rounded-lg border transition-colors ${
                      selectedColor === "all"
                        ? "bg-slate-900 text-white border-slate-900 font-semibold"
                        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    Vse
                  </button>
                  {availableColors.slice(0, 8).map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColor(c.name)}
                      className={`inline-flex items-center gap-1.5 px-2 py-1 text-[11px] rounded-lg border transition-colors ${
                        selectedColor === c.name
                          ? "bg-brand-900 text-white border-brand-900 font-semibold"
                          : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-black/20"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name.split(" ")[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Print Technique Filter */}
            {availableTechniques.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Možnost tiska / dodelave
                </label>
                <select
                  value={selectedTechnique}
                  onChange={(e) => setSelectedTechnique(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="all">Vse tehnike tiska</option>
                  {availableTechniques.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Product Grid Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Sort & Counter Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
              <span className="text-xs text-slate-500">
                Prikazujem <strong className="text-slate-800">{filteredProducts.length}</strong> izdelkov v katalogu
              </span>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">Razvrsti po:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="p-1.5 rounded-lg border border-slate-300 bg-white font-medium"
                >
                  <option value="popular">Priljubljenosti (B2B)</option>
                  <option value="priceAsc">Ceni: od najnižje</option>
                  <option value="priceDesc">Ceni: od najvišje</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="py-16 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500 space-y-2">
                <p>Za izbrane filtre ni ujemajočih se izdelkov.</p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="font-bold text-brand-700 hover:underline"
                >
                  Počisti filtre
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden group"
                  >
                    <div>
                      {/* Product Image */}
                      <Link href={`/izdelki/${p.id}`} className="block relative h-48 bg-slate-100 overflow-hidden">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {p.badge && (
                          <div className="absolute top-2.5 left-2.5 bg-brand-900 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                            {p.badge}
                          </div>
                        )}
                      </Link>

                      {/* Info */}
                      <div className="p-4 space-y-2">
                        <div className="text-[11px] text-slate-400 font-mono">
                          Šifra: {p.sku}
                        </div>
                        <Link href={`/izdelki/${p.id}`}>
                          <h4 className="text-sm font-bold text-slate-900 hover:text-brand-900 transition-colors line-clamp-2">
                            {p.name}
                          </h4>
                        </Link>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {p.shortDescription}
                        </p>

                        <div className="pt-2 flex items-baseline justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 block">Cena od:</span>
                            <span className="text-base font-extrabold text-slate-900">
                              {p.priceFrom.toFixed(2)} €
                            </span>
                          </div>
                          <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            min. {p.minQuantity} kos
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleAddToCart(p)}
                        className="py-2 px-3 bg-brand-900 hover:bg-brand-950 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>V košarico</span>
                      </button>

                      <Link
                        href={`/izdelki/${p.id}`}
                        className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Podrobnosti</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
