"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useCart, getItemKey } from "@/context/CartContext";
import { useModals } from "@/context/ModalContext";

export const CartDrawer: React.FC = () => {
  const router = useRouter();
  const { items, isCartOpen, setIsCartOpen, removeItem, updateQuantity, subtotal, totalItems } = useCart();
  const { openInquiry } = useModals();

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    router.push("/kosarica");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-900" />
              <h3 className="font-bold text-slate-900 text-lg">
                Košarica / Povpraševanje
              </h3>
              <span className="text-xs bg-brand-100 text-brand-800 font-semibold px-2 py-0.5 rounded-full">
                {totalItems} kos
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items list */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="text-base font-semibold text-slate-800 mb-1">
                  Vaša košarica je prazna
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mb-6">
                  Preglejte našo ponudbo promocijskih izdelkov ali outlet artiklov in dodajte želene količine.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    router.push("/kategorije/promo-tekstil");
                  }}
                  className="px-5 py-2.5 bg-brand-900 hover:bg-brand-950 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
                >
                  Razišči ponudbo izdelkov
                </button>
              </div>
            ) : (
              items.map((item) => {
                const key = getItemKey(item);
                const itemTotal = item.price * item.quantity;
                return (
                  <div
                    key={key}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 shadow-sm transition-all flex gap-3.5 items-start"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg bg-slate-100 flex-shrink-0 border border-slate-100"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {item.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeItem(key)}
                          className="text-slate-400 hover:text-red-500 transition-colors p-0.5"
                          title="Odstrani artikel"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-slate-500 flex flex-wrap gap-2 mt-0.5">
                        <span>Šifra: {item.sku}</span>
                        {item.color && (
                          <span className="font-medium text-slate-700">• {item.color}</span>
                        )}
                        {item.size && (
                          <span className="font-medium text-slate-700">• Velikost: {item.size}</span>
                        )}
                      </div>

                      {item.printTechnique && (
                        <div className="text-[10px] text-brand-700 font-medium mt-0.5">
                          Tisk: {item.printTechnique}
                        </div>
                      )}

                      <div className="mt-2.5 flex items-center justify-between">
                        {/* Quantity controls */}
                        <div className="inline-flex items-center border border-slate-200 rounded-lg bg-slate-50">
                          <button
                            type="button"
                            onClick={() => updateQuantity(key, item.quantity - 1)}
                            className="p-1 hover:bg-slate-200 text-slate-600 rounded-l-lg transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-semibold text-slate-800 min-w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(key, item.quantity + 1)}
                            className="p-1 hover:bg-slate-200 text-slate-600 rounded-r-lg transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="text-xs font-bold text-slate-900">
                            {itemTotal.toFixed(2)} €
                          </div>
                          <div className="text-[10px] text-slate-400">
                            ({item.price.toFixed(2)} €/kos)
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer calculation & checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-slate-50/70 space-y-3">
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Okvirni znesek (brez DDV):</span>
                  <span className="font-semibold text-slate-800">{subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Informativni DDV (22%):</span>
                  <span className="font-semibold text-slate-800">
                    {(subtotal * 0.22).toFixed(2)} €
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-1.5 border-t border-slate-200">
                  <span>Skupaj z DDV:</span>
                  <span className="text-brand-900 font-extrabold text-base">
                    {(subtotal * 1.22).toFixed(2)} €
                  </span>
                </div>
              </div>

              <div className="p-2.5 bg-brand-50 border border-brand-100 rounded-xl text-[11px] text-brand-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-700 flex-shrink-0" />
                <span>
                  B2B opomba: Cene so informativne. Ob oddaji vam pripravimo natančen izračun s popustom na količino.
                </span>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleCheckoutClick}
                  className="w-full py-3 px-4 bg-brand-900 hover:bg-brand-950 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>Nadaljuj na demo zaključek naročila</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    openInquiry({
                      source: "Košarica Hitro Povpraševanje",
                      notes: `Zanima me celotna vsebina košarice (${items.length} artiklov, skupaj ${totalItems} kosov).`,
                    });
                  }}
                  className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl font-semibold text-xs transition-colors"
                >
                  Pošlji vsebino košarice kot povpraševanje
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
