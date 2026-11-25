"use client";

import React, { useEffect } from "react";
import { CheckCircle2, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

export const Toast: React.FC = () => {
  const { toastMessage, clearToast, setIsCartOpen } = useCart();

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      clearToast();
    }, 4500);
    return () => clearTimeout(timer);
  }, [toastMessage, clearToast]);

  if (!toastMessage) return null;

  return (
    <div className="fixed top-24 right-4 z-50 max-w-sm w-full animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-slate-700 flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
          <CheckCircle2 className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            Dodano v košarico
          </div>
          <div className="text-xs text-slate-200 mt-0.5 leading-snug">
            {toastMessage}
          </div>
          <div className="mt-2.5 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                clearToast();
                setIsCartOpen(true);
              }}
              className="px-3 py-1 bg-brand-700 hover:bg-brand-600 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Odpri košarico</span>
            </button>
            <button
              type="button"
              onClick={clearToast}
              className="text-xs text-slate-400 hover:text-white px-2 py-1"
            >
              Zapri
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={clearToast}
          className="text-slate-400 hover:text-white p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
