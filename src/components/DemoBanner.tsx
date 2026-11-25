"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Info, Settings, RefreshCw, ShieldAlert, Check } from "lucide-react";
import { useProducts } from "@/context/ProductContext";

export const DemoBanner: React.FC = () => {
  const pathname = usePathname();
  const { resetAllDemoData } = useProducts();
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    setIsResetting(true);
    await resetAllDemoData();
    setIsResetting(false);
    setShowConfirmReset(false);
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3000);
    // Reload window to refresh all state
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      <aside aria-label="Demo obvestilo" className="bg-amber-500/10 border-b border-amber-500/20 text-amber-900 text-xs px-4 py-1.5 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-800 uppercase tracking-wider">
              Demo 2
            </span>
            <span className="font-medium">
              Predstavitvena različica — podatki in naročila so testni.
            </span>
          </div>

          <div className="flex items-center gap-3">
            {!isAdmin ? (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 font-semibold text-brand-900 hover:text-brand-700 hover:underline bg-white/70 px-2.5 py-1 rounded-md border border-amber-200 transition-colors shadow-2xs"
              >
                <Settings className="w-3.5 h-3.5 text-brand-700" />
                <span>Admin nadzorna plošča</span>
              </Link>
            ) : (
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 font-semibold text-slate-700 hover:text-slate-900 hover:underline bg-white/70 px-2.5 py-1 rounded-md border border-slate-200 transition-colors shadow-2xs"
              >
                <span>← Nazaj v spletno trgovino</span>
              </Link>
            )}

            <button
              type="button"
              onClick={() => setShowConfirmReset(true)}
              className="inline-flex items-center gap-1 text-[11px] text-amber-800 hover:text-amber-950 hover:underline py-0.5"
              title="Povrni privzete demo izdelke, naročila in počisti naložene datoteke"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Ponastavi demo</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Confirmation Modal for Resetting Demo Data */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Ponastavi vse demo podatke?
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Ta akcija bo povrnila začetni katalog izdelkov, ponastavila dobaviteljske sinhronizacije, izbrisala vsa oddana testna naročila ter počistila lokalno shranjene logotipe iz IndexedDB.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmReset(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                disabled={isResetting}
              >
                Prekliči
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={isResetting}
                className="px-4 py-2 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-sm transition-all flex items-center gap-2"
              >
                {isResetting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Ponastavljanje...</span>
                  </>
                ) : (
                  <span>Da, ponastavi podatke</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {resetSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-700 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-sm animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4" />
          <span>Demo podatki so bili uspešno ponastavljeni.</span>
        </div>
      )}
    </>
  );
};
