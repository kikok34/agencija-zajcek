"use client";

import React, { useState, useMemo } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Filter,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Eye,
  CheckCircle2,
  Layers,
} from "lucide-react";
import { CATEGORIES } from "@/data/categories";
import { PRODUCTS, Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useModals } from "@/context/ModalContext";
import { useAnalytics } from "@/context/AnalyticsContext";

export default function CategoryDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const category = CATEGORIES.find((c) => c.slug === slug);
  if (!category) {
    notFound();
  }

  const { addItem } = useCart();
  const { openInquiry } = useModals();
  const { trackEvent } = useAnalytics();

  // Filters state
  const [maxPrice, setMaxPrice] = useState<number>(50);
  const [minQtyFilter, setMinQtyFilter] = useState<string>("all");
  const [selectedMaterial, setSelectedMaterial] = useState<string>("all");
  const [selectedColor, setSelectedColor] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("popular");

  // Products belonging to this category
  const categoryProducts = PRODUCTS.filter((p) => p.category === category.slug);

  // Extract materials & colors
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

  const filteredProducts = useMemo(() => {
    return categoryProducts
      .filter((p) => {
        if (p.priceFrom > maxPrice) return false;
        if (minQtyFilter === "under50" && p.minQuantity >= 50) return false;
        if (minQtyFilter === "over50" && p.minQuantity < 50) return false;

        if (selectedMaterial !== "all") {
          if (!p.materials.toLowerCase().includes(selectedMaterial.toLowerCase())) {
            return false;
          }
        }

        if (selectedColor !== "all") {
          if (!p.colors.some((c) => c.name.toLowerCase().includes(selectedColor.toLowerCase()))) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "priceAsc") return a.priceFrom - b.priceFrom;
        if (sortBy === "priceDesc") return b.priceFrom - a.priceFrom;
        return 0;
      });
  }, [categoryProducts, maxPrice, minQtyFilter, selectedMaterial, selectedColor, sortBy]);

  const resetFilters = () => {
    setMaxPrice(50);
    setMinQtyFilter("all");
    setSelectedMaterial("all");
    setSelectedColor("all");
    setSortBy("popular");
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
      `Dodano v košarico: ${product.name}`,
      `Količina: ${product.minQuantity} kos`
    );
  };

  return (
    <div className="py-10 space-y-12">
      {/* Top Breadcrumb & Category Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Nazaj na domov</span>
        </Link>

        <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent-300 bg-white/10 px-3 py-1 rounded-full">
              <Layers className="w-3.5 h-3.5" />
              B2B Program Izdelkov
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              {category.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {category.longDesc}
            </p>

            <div className="pt-2 flex flex-wrap gap-2 justify-center md:justify-start">
              {category.highlightPoints.map((pt, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-[11px] font-medium bg-white/10 border border-white/15 px-3 py-1 rounded-lg text-slate-200"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent-400" />
                  {pt}
                </span>
              ))}
            </div>
          </div>

          <div className="w-48 sm:w-64 h-48 sm:h-64 rounded-2xl overflow-hidden shadow-2xl flex-shrink-0 border border-white/20">
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Main Filter & Grid Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-200 h-fit">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <Filter className="w-4 h-4 text-brand-700" />
                <span>Filtri kategorije</span>
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

            {/* Min Quantity */}
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
          </div>

          {/* Product Grid Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Sort & Counter */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
              <span className="text-xs text-slate-500">
                Prikazujem <strong className="text-slate-800">{filteredProducts.length}</strong> izdelkov v kategoriji
              </span>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">Razvrsti po:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="p-1.5 rounded-lg border border-slate-300 bg-white font-medium"
                >
                  <option value="popular">Priljubljenosti</option>
                  <option value="priceAsc">Ceni: od najnižje</option>
                  <option value="priceDesc">Ceni: od najvišje</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            {filteredProducts.length === 0 ? (
              <div className="py-16 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500 space-y-2">
                <p>Za izbrane filtre ni izdelkov.</p>
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
                      {/* Image */}
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

                      {/* Content */}
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
                            <span className="text-[10px] text-slate-400 block">Cena že od:</span>
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
                        <span>Ogled</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom CTA on Category Page */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold">
              Potrebujete pomoč pri izbiri?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Niste prepričani glede pravega materiala ali primerne tehnike tiska?
              Zaupajte nam namen in proračun, mi pa vam pripravimo brezplačen predlog z vzorci.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              openInquiry({
                interest: category.slug,
                source: `Category Bottom CTA: ${category.name}`,
              })
            }
            className="px-6 py-3 bg-accent-500 hover:bg-accent-600 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-colors flex-shrink-0"
          >
            Zahtevajte brezplačno ponudbo
          </button>
        </div>
      </div>
    </div>
  );
}
