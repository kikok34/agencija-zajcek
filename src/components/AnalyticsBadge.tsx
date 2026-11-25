"use client";

import React from "react";
import {
  Activity,
  X,
  Trash2,
  CheckCircle,
  Eye,
  ShoppingBag,
  FileText,
  Send,
  Sparkles,
} from "lucide-react";
import { useAnalytics, AnalyticsEvent } from "@/context/AnalyticsContext";

export const AnalyticsBadge: React.FC = () => {
  const { events, clearEvents, isLogOpen, setIsLogOpen } = useAnalytics();

  const getEventBadge = (type: AnalyticsEvent["type"]) => {
    switch (type) {
      case "quote_click":
        return <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">CTA Ponudba</span>;
      case "catalog_view":
        return <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-bold">Katalog</span>;
      case "cart_add":
        return <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">Košarica</span>;
      case "inquiry_submit":
        return <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">Povpraševanje</span>;
      case "order_complete":
        return <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 text-[10px] font-bold">Naročilo</span>;
      default:
        return <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-bold">Dogodek</span>;
    }
  };

  return (
    <>
      {/* Floating Demo Analytics Pill */}
      <div className="fixed bottom-16 sm:bottom-6 left-4 z-30">
        <button
          type="button"
          onClick={() => setIsLogOpen(true)}
          className="flex items-center gap-2 px-3 py-2 bg-slate-900/90 hover:bg-slate-950 text-white rounded-full text-xs font-semibold shadow-lg hover:shadow-xl backdrop-blur-md border border-slate-700/80 transition-all hover:scale-105"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <Activity className="w-3.5 h-3.5 text-accent-400" />
          <span>Demo Analitika</span>
          <span className="bg-slate-800 text-slate-300 text-[10px] px-1.5 py-0.2 rounded-full">
            {events.length}
          </span>
        </button>
      </div>

      {/* Analytics Slide-over modal */}
      {isLogOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setIsLogOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-r border-slate-200 animate-in slide-in-from-left duration-300">
              {/* Header */}
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-accent-400" />
                  <div>
                    <h3 className="font-bold text-sm">Demo B2B Analitika</h3>
                    <div className="text-[11px] text-slate-400">
                      Zabeleženi dogodki v localStorage ({events.length})
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {events.length > 0 && (
                    <button
                      type="button"
                      onClick={clearEvents}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                      title="Počisti zgodovino"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsLogOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Explainer notice */}
              <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs text-slate-600">
                Tukaj se v realnem času beležijo ključne B2B konverzije: klik na »Zahtevaj ponudbo«, ogled in prenos katalogov, dodajanje v košarico ter oddaja povpraševanj.
              </div>

              {/* Events list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {events.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400">
                    Ni zabeleženih dogodkov. Kliknite na gumb za ponudbo ali dodajte artikel v košarico!
                  </div>
                ) : (
                  events.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-3 rounded-xl border border-slate-200 bg-white shadow-xs text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        {getEventBadge(ev.type)}
                        <span className="text-[10px] text-slate-400 font-mono">
                          {ev.timestamp}
                        </span>
                      </div>
                      <div className="font-bold text-slate-900">{ev.title}</div>
                      <div className="text-slate-600 text-[11px] leading-relaxed">
                        {ev.details}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="p-3 bg-slate-50 border-t border-slate-200 text-right">
                <button
                  type="button"
                  onClick={() => setIsLogOpen(false)}
                  className="px-4 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800"
                >
                  Zapri preglednik
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
