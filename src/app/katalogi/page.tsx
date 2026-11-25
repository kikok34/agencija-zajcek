"use client";

import React from "react";
import Link from "next/link";
import {
  BookOpen,
  ArrowRight,
  Download,
  Eye,
  Sparkles,
  Flame,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { CATALOGS } from "@/data/catalogs";
import { useModals } from "@/context/ModalContext";
import { useAnalytics } from "@/context/AnalyticsContext";

export default function CatalogsPage() {
  const { openInquiry, openPdf } = useModals();
  const { trackEvent } = useAnalytics();

  const handleInquiry = (catalogTitle: string, categorySlug: string) => {
    trackEvent(
      "quote_click",
      `Zahtevaj ponudbo za katalog: ${catalogTitle}`,
      `Klik iz kartice kataloga ${catalogTitle}`
    );
    openInquiry({
      catalogTitle,
      interest: categorySlug,
      source: `Katalog Kartica: ${catalogTitle}`,
    });
  };

  const handleQuickPdf = (catalog: (typeof CATALOGS)[0]) => {
    trackEvent("catalog_view", `Hitri ogled PDF: ${catalog.title}`, `Predogled PDF v brskalniku`);
    openPdf(catalog);
  };

  return (
    <div className="py-12 sm:py-16 space-y-16">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full">
            <BookOpen className="w-3.5 h-3.5" />
            Letna B2B Izdaja 2026
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Katalogi promocijskih daril
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Preglejte naše kataloge in izberite izdelke za vašo naslednjo kampanjo,
            dogodek ali poslovno darilo. Za vsak katalog lahko prenesete simuliran PDF
            ali neposredno oddate povpraševanje za izbrane artikle.
          </p>
        </div>
      </div>

      {/* 6 Catalog Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CATALOGS.map((cat) => {
            const isOutlet = cat.slug === "outlet-shop";

            return (
              <div
                key={cat.id}
                className="bg-white rounded-3xl border border-slate-200 hover:border-brand-500/50 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
              >
                {/* Catalog Cover */}
                <div className="relative h-64 overflow-hidden bg-slate-100">
                  <img
                    src={cat.coverImage}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {cat.badge && (
                    <div className="absolute top-3 left-3 bg-brand-900 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                      {cat.badge}
                    </div>
                  )}
                  <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-lg">
                    {cat.itemCount} • {cat.pages} str.
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      {cat.year}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-900 transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                      {cat.shortDesc}
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="pt-2 space-y-2">
                    <Link
                      href={`/katalogi/${cat.slug}`}
                      className="w-full py-2.5 px-4 bg-brand-900 hover:bg-brand-950 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Ogled kataloga & izdelkov</span>
                    </Link>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleInquiry(cat.title, cat.categorySlug)}
                        className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-accent-600" />
                        <span>Zahtevaj ponudbo</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleQuickPdf(cat)}
                        className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs font-medium rounded-xl transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Prenesi PDF</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom B2B Help Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 rounded-3xl p-8 sm:p-10 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-bold text-slate-900">
              Iščete specifičen artikel, ki ga ni v katalogih?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Naša ekipa ima dostop do več kot 40.000 promocijskih artiklov evropskih dobaviteljev.
              Pošljite nam vašo referenčno sliko ali idejo in pripravili vam bomo ujemajoče predloge.
            </p>
          </div>
          <button
            type="button"
            onClick={() => openInquiry({ source: "Katalogi Bottom Specific Search" })}
            className="px-6 py-3 bg-brand-900 hover:bg-brand-950 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition-colors flex-shrink-0"
          >
            Pošljite povpraševanje za iskanje
          </button>
        </div>
      </div>
    </div>
  );
}
