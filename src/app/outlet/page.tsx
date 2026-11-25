"use client";

import React from "react";
import Link from "next/link";
import {
  Flame,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Clock,
  ShieldCheck,
  PackageCheck,
  Tag,
  CheckCircle2,
} from "lucide-react";
import { PRODUCTS, Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useModals } from "@/context/ModalContext";
import { useAnalytics } from "@/context/AnalyticsContext";

export default function OutletPage() {
  const { addItem, setIsCartOpen } = useCart();
  const { openInquiry } = useModals();
  const { trackEvent } = useAnalytics();

  const outletProducts = PRODUCTS.filter((p) => p.isOutlet);

  const handleAddToCart = (product: Product) => {
    const qty = product.minQuantity || 10;
    const price = product.outletPrice || product.priceFrom;

    addItem(
      {
        id: product.id,
        sku: product.sku,
        name: product.name,
        price: price,
        image: product.images[0],
        color: product.colors[0]?.name,
        minQuantity: product.minQuantity,
        stock: product.stock,
        isOutlet: true,
      },
      qty
    );

    trackEvent(
      "cart_add",
      `Outlet dodano v košarico: ${product.name}`,
      `${qty} kos po ceni ${price.toFixed(2)} € (Zaloga: ${product.stock})`
    );
  };

  return (
    <div className="py-10 space-y-14">
      {/* Outlet Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-accent-950 via-slate-900 to-brand-950 text-white p-8 sm:p-14 border border-accent-800/40 shadow-2xl">
          <div className="relative max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-500/20 text-accent-300 border border-accent-500/30 text-xs font-extrabold uppercase tracking-wider">
              <Flame className="w-4 h-4 text-accent-400" />
              <span>Zadnji kosi & skladiščna odprodaja</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Outlet Shop — ugodne promocijske rešitve
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Izbrane izdelke po ugodnejših cenah, primerne za hitrejša naročila in manjše
              količine. Vsi artikli so fizično na zalogi v skladišču v Ljubljani z možnostjo
              takojšnjega prevzema ali hitrega dotiska.
            </p>

            {/* Badges */}
            <div className="pt-2 flex flex-wrap gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
                <PackageCheck className="w-4 h-4 text-emerald-400" />
                Takojšnja odprema (24–48h)
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
                <Tag className="w-4 h-4 text-accent-400" />
                Popusti do -55%
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                100% preverjena B2B kakovost
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Product List Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Trenutno razpoložljiva outlet zaloga ({outletProducts.length} artiklov)
            </h2>
            <p className="text-xs text-slate-500">
              Zaloge se posodabljajo dnevno. Ob oddaji naročila je izdelek takoj rezerviran.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-brand-900 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-xl transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Prikaži košarico</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {outletProducts.map((p) => {
            const regular = p.regularPrice || p.priceFrom * 1.8;
            const outletPrice = p.outletPrice || p.priceFrom;
            const savingsPercent = Math.round(((regular - outletPrice) / regular) * 100);

            return (
              <div
                key={p.id}
                className="bg-white rounded-3xl border border-slate-200 hover:border-accent-500/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Image with discount badge */}
                  <Link href={`/izdelki/${p.id}`} className="block relative h-52 bg-slate-100 overflow-hidden">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                      -{savingsPercent}%
                    </div>
                    <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md text-emerald-400 text-[11px] font-bold px-2.5 py-0.5 rounded-lg">
                      Zaloga: {p.stock} kos
                    </div>
                  </Link>

                  {/* Body */}
                  <div className="p-5 space-y-3">
                    <div className="text-[11px] text-slate-400 font-mono">
                      Šifra: {p.sku}
                    </div>

                    <Link href={`/izdelki/${p.id}`}>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand-900 transition-colors line-clamp-2">
                        {p.name}
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {p.shortDescription}
                    </p>

                    {/* Price Comparison */}
                    <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400 line-through">
                            {regular.toFixed(2)} €
                          </span>
                          <span className="text-xl font-black text-red-600">
                            {outletPrice.toFixed(2)} €
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">brez DDV / kos</span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Min. količina:</span>
                        <span className="text-xs font-bold text-slate-800">
                          {p.minQuantity} kos
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Add to Cart CTA */}
                <div className="p-5 pt-0 space-y-2">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(p)}
                    className="w-full py-2.5 px-4 bg-brand-900 hover:bg-brand-950 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 group-hover:bg-accent-500 group-hover:text-slate-950"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Dodaj v košarico ({p.minQuantity} kos)</span>
                  </button>

                  <Link
                    href={`/izdelki/${p.id}`}
                    className="w-full py-1.5 text-center text-xs text-slate-500 hover:text-brand-900 block font-medium"
                  >
                    Podrobne specifikacije
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Outlet Special Request Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-bold text-slate-900">
              Želite odkup celotne preostale zaloge določenega artikla?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Pri prevzemu celotne serije vam omogočamo dodaten paketni popust in brezplačno
              skladiščenje ali delno dostavo po vaših lokacijah.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              openInquiry({
                interest: "outlet-shop",
                source: "Outlet Veleprodaja odkup zaloge",
              })
            }
            className="px-6 py-3 bg-brand-900 hover:bg-brand-950 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-colors flex-shrink-0"
          >
            Zahtevajte veleprodajno ponudbo
          </button>
        </div>
      </div>
    </div>
  );
}
