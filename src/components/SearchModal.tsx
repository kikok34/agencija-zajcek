"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, X, BookOpen, Tag, ArrowRight, Flame } from "lucide-react";
import { useModals } from "@/context/ModalContext";
import { PRODUCTS } from "@/data/products";
import { CATALOGS } from "@/data/catalogs";

export const SearchModal: React.FC = () => {
  const { isSearchOpen, closeSearch } = useModals();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { products: [], catalogs: [] };

    const matchingProducts = PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.materials.toLowerCase().includes(q) ||
        p.printTechniques.some((t) => t.toLowerCase().includes(q))
    ).slice(0, 8);

    const matchingCatalogs = CATALOGS.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.shortDesc.toLowerCase().includes(q) ||
        c.fullIntro.toLowerCase().includes(q)
    ).slice(0, 4);

    return { products: matchingProducts, catalogs: matchingCatalogs };
  }, [query]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Iščite po imenu izdelka, šifri (SKU), materialu ali katalogu..."
            className="w-full text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 rounded bg-slate-100"
            >
              Počisti
            </button>
          )}
          <button
            type="button"
            onClick={closeSearch}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-5">
          {!query.trim() ? (
            <div className="py-6 text-center text-xs text-slate-400">
              <p>Začnite tipkati za iskanje med več kot 50 demo izdelki in 6 katalogi.</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                <span className="text-slate-500 font-medium">Predlogi:</span>
                {["Majica", "Bambus", "Notesnik", "Powerbank", "Torba", "Termo steklenica", "Outlet"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setQuery(s)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : filtered.products.length === 0 && filtered.catalogs.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              Ni zadetkov za poizvedbo »<strong>{query}</strong>«. Poskusite s splošnejšim iskalnim pojmom.
            </div>
          ) : (
            <>
              {/* Catalogs Matches */}
              {filtered.catalogs.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    Katalogi ({filtered.catalogs.length})
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {filtered.catalogs.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/katalogi/${cat.slug}`}
                        onClick={closeSearch}
                        className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50/50 transition-all group"
                      >
                        <img
                          src={cat.coverImage}
                          alt={cat.title}
                          className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-brand-900 truncate">
                            {cat.title}
                          </h4>
                          <span className="text-[11px] text-slate-500 block">
                            {cat.itemCount} • {cat.pages} strani
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Products Matches */}
              {filtered.products.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    Izdelki ({filtered.products.length})
                  </div>
                  <div className="space-y-2">
                    {filtered.products.map((prod) => (
                      <Link
                        key={prod.id}
                        href={`/izdelki/${prod.id}`}
                        onClick={closeSearch}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            className="w-12 h-12 object-cover rounded-lg flex-shrink-0 bg-slate-100"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-slate-900 group-hover:text-brand-900 truncate">
                                {prod.name}
                              </h4>
                              {prod.isOutlet && (
                                <span className="text-[10px] bg-accent-100 text-accent-700 px-1.5 py-0.2 rounded font-bold">
                                  OUTLET
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              <span>Šifra: {prod.sku}</span> • <span>{prod.categoryName}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right pl-3 flex-shrink-0">
                          <span className="text-xs font-bold text-slate-900 block">
                            od {prod.priceFrom.toFixed(2)} €
                          </span>
                          <span className="text-[10px] text-slate-400">
                            min. {prod.minQuantity} kos
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Pritisnite ESC za izhod</span>
          <Link
            href="/katalogi"
            onClick={closeSearch}
            className="text-brand-700 hover:underline flex items-center gap-1 font-medium"
          >
            <span>Preglej vse kataloge</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};
