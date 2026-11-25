"use client";

import React, { useState } from "react";
import {
  X,
  Download,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  FileText,
  Printer,
  Sparkles,
  Share2,
  CheckCircle2,
} from "lucide-react";
import { useModals } from "@/context/ModalContext";
import { useAnalytics } from "@/context/AnalyticsContext";

export const PdfViewerModal: React.FC = () => {
  const { isPdfOpen, activeCatalog, closePdf, openInquiry } = useModals();
  const { trackEvent } = useAnalytics();
  const [currentPage, setCurrentPage] = useState(0);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isPdfOpen || !activeCatalog) return null;

  const totalPages = activeCatalog.pdfSimPages.length;
  const activePageData = activeCatalog.pdfSimPages[currentPage] || activeCatalog.pdfSimPages[0];

  const handleSimulateDownload = () => {
    trackEvent(
      "catalog_view",
      `Prenos PDF kataloga: ${activeCatalog.title}`,
      `Simulacija prenosa PDF datoteke za ${activeCatalog.title}`
    );
    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
    }, 3500);
  };

  const handleInquiryForCatalog = () => {
    closePdf();
    openInquiry({
      catalogTitle: activeCatalog.title,
      interest: activeCatalog.categorySlug,
      source: `PDF Viewer: ${activeCatalog.title}`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-4xl w-full h-[90vh] shadow-2xl border border-slate-300 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* PDF Viewer Top Bar */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-red-600/90 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
              PDF
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold truncate">
                {activeCatalog.title}
              </h3>
              <div className="text-[11px] text-slate-400">
                Stran {currentPage + 1} od {totalPages} • Digitalna simulacija kataloga 2026
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSimulateDownload}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-700 hover:bg-brand-600 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Prenesi PDF (Demo)</span>
            </button>

            <button
              type="button"
              onClick={closePdf}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Zapri"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Download notification banner if clicked */}
        {downloadSuccess && (
          <div className="bg-emerald-600 text-white text-xs px-4 py-2 flex items-center justify-between animate-in slide-in-from-top duration-200">
            <span className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              Demo prenos: Datoteka »{activeCatalog.title.toLowerCase().replace(/ /g, "_")}.pdf«
              je bila uspešno generirana in simulirano prenesena!
            </span>
            <button
              type="button"
              onClick={() => setDownloadSuccess(false)}
              className="text-white/80 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {/* PDF Simulated Viewer Content */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row bg-slate-100">
          {/* Sidebar: Table of contents */}
          <div className="hidden md:block w-64 bg-slate-50 border-r border-slate-200 p-3 overflow-y-auto">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1 mb-2">
              Vsebina kataloga
            </div>
            <div className="space-y-1">
              {activeCatalog.pdfSimPages.map((pg, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentPage(idx)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors flex items-start gap-2 ${
                    currentPage === idx
                      ? "bg-brand-900 text-white font-semibold shadow-sm"
                      : "text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded text-[10px] flex items-center justify-center font-bold flex-shrink-0 ${
                      currentPage === idx ? "bg-brand-800 text-white" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate">{pg.title}</div>
                    <div
                      className={`text-[10px] truncate ${
                        currentPage === idx ? "text-brand-200" : "text-slate-400"
                      }`}
                    >
                      {pg.section}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Simulated Page Canvas */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 max-w-xl w-full p-6 sm:p-10 min-h-[480px] flex flex-col justify-between relative">
              {/* Top Watermark / Brand Header of PDF Page */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-brand-950 text-white text-[10px] font-bold flex items-center justify-center">
                    AZ
                  </div>
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Agencija Zajček • Poslovna darila
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-slate-400">
                  {activePageData.section} | Stran {currentPage + 1}
                </span>
              </div>

              {/* Main Simulated Page Content */}
              <div className="my-6 space-y-4">
                <div className="inline-block px-2.5 py-0.5 rounded bg-brand-50 text-brand-900 text-xs font-semibold">
                  {activeCatalog.year}
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {activePageData.title}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {activePageData.previewSummary}
                </p>

                {/* Page Cover or Graphic Preview */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-4">
                  <img
                    src={activeCatalog.coverImage}
                    alt={activeCatalog.title}
                    className="w-20 h-20 object-cover rounded-lg shadow-sm"
                  />
                  <div className="text-xs text-slate-600 space-y-1">
                    <p className="font-semibold text-slate-800">
                      Celotna tiskana izdaja: {activeCatalog.pages} strani
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Vključuje podrobne tehnične specifikacije, barvne lestvice, pozicije tiska in količinske tabele za B2B naročila.
                    </p>
                  </div>
                </div>
              </div>

              {/* Page Footer */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                <span>Tel: +386 41 947 065 • info@agencija-zajcek.net</span>
                <span className="font-medium text-slate-700">www.agencija-zajcek.net</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Pagination & Action Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between gap-2">
          {/* Pagination controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 0}
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              className="p-2 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold text-slate-700">
              {currentPage + 1} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage === totalPages - 1}
              onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
              className="p-2 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSimulateDownload}
              className="sm:hidden px-3 py-2 bg-slate-100 text-slate-800 rounded-xl text-xs font-semibold"
            >
              Prenesi PDF
            </button>

            <button
              type="button"
              onClick={handleInquiryForCatalog}
              className="px-4 py-2 bg-brand-900 hover:bg-brand-950 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Zahtevaj ponudbo za ta katalog</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
