"use client";

import React, { useState } from "react";
import {
  X,
  Check,
  CheckCircle2,
  Sparkles,
  Info,
  Maximize2,
  Layers,
} from "lucide-react";
import { PrintingPosition, Product } from "@/types/products";

interface PrintingPositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  selectedPosition: PrintingPosition | null;
  onSelectPosition: (position: PrintingPosition) => void;
  logoPreviewUrl?: string;
}

export const PrintingPositionModal: React.FC<PrintingPositionModalProps> = ({
  isOpen,
  onClose,
  product,
  selectedPosition,
  onSelectPosition,
  logoPreviewUrl,
}) => {
  // Default positions if product has none configured
  const positions: PrintingPosition[] = product.printingPositions?.length
    ? product.printingPositions
    : [
        {
          id: "spredaj",
          name: "Sprednja stran",
          description: "Osrednja pozicija na artiklu",
          maxPrintArea: "80 × 50 mm (demo)",
          technique: "Sitotisk ali tamponski tisk",
          dashedArea: { top: "30%", left: "30%", width: "40%", height: "40%" },
        },
        {
          id: "hrbet",
          name: "Zadnja stran",
          description: "Zadnji del za logotip ali spletno stran",
          maxPrintArea: "80 × 50 mm (demo)",
          technique: "Sitotisk ali tamponski tisk",
          dashedArea: { top: "30%", left: "30%", width: "40%", height: "40%" },
        },
      ];

  const [activeTemp, setActiveTemp] = useState<PrintingPosition>(
    selectedPosition || positions[0]
  );

  if (!isOpen) return null;

  const handleConfirm = () => {
    onSelectPosition(activeTemp);
    onClose();
  };

  const productImage = product.images[0] || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 my-4 animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between shrink-0 bg-slate-50/80 rounded-t-3xl">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Izbira pozicije za tisk / gravuro
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">
              {product.name}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Izberite želeno mesto tiska logotipa. Prikazane so maksimalne dimenzije tiska.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Main Visual Preview Area with Dashed Area Overlay */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-slate-50 p-5 rounded-2xl border border-slate-200">
            {/* Interactive Image with Overlay */}
            <div className="relative aspect-square max-w-sm mx-auto w-full bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden flex items-center justify-center">
              <img
                src={productImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {/* Dashed Printable Area Overlay */}
              <div
                className="absolute border-2 border-dashed border-brand-600 bg-brand-500/15 rounded-lg flex flex-col items-center justify-center p-1 shadow-sm transition-all animate-pulse"
                style={{
                  top: activeTemp.dashedArea.top,
                  left: activeTemp.dashedArea.left,
                  width: activeTemp.dashedArea.width,
                  height: activeTemp.dashedArea.height,
                }}
              >
                {/* Optional illustrative logo preview if uploaded */}
                {logoPreviewUrl ? (
                  <div className="w-full h-full flex items-center justify-center p-1">
                    <img
                      src={logoPreviewUrl}
                      alt="Logo predogled"
                      className="max-h-full max-w-full object-contain filter drop-shadow-sm opacity-90"
                    />
                  </div>
                ) : (
                  <div className="text-center p-1">
                    <span className="text-[10px] font-bold text-brand-900 bg-white/90 px-1.5 py-0.5 rounded shadow-2xs">
                      {activeTemp.name}
                    </span>
                    <span className="text-[9px] text-brand-800 font-semibold block mt-0.5 bg-white/80 px-1 rounded">
                      {activeTemp.maxPrintArea}
                    </span>
                  </div>
                )}
              </div>

              {/* Printable area badge */}
              <div className="absolute bottom-2 left-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] py-1 px-2.5 rounded-lg text-center font-medium">
                Črtkana površina prikazuje cono tiska: <strong>{activeTemp.name}</strong>
              </div>
            </div>

            {/* Position specs info */}
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Izbrana pozicija
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                  {activeTemp.name}
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  {activeTemp.description}
                </p>
              </div>

              <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Maksimalna površina:</span>
                  <span className="font-bold text-brand-800">{activeTemp.maxPrintArea}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Priporočena tehnika:</span>
                  <span className="font-semibold text-slate-800">{activeTemp.technique}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Status vzorca:</span>
                  <span className="font-medium text-emerald-700">Na voljo za naročilo</span>
                </div>
              </div>

              {logoPreviewUrl && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-snug">
                  <strong>Informativni prikaz logotipa:</strong> Prikaz služi zgolj za ponazoritev umestitve in ne predstavlja končne grafične priprave za tisk.
                </div>
              )}
            </div>
          </div>

          {/* Cards for each available position */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Izberite med razpoložljivimi conami tiska:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {positions.map((pos) => {
                const isSelected = activeTemp.id === pos.id;
                return (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => setActiveTemp(pos)}
                    className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? "border-brand-600 bg-brand-50/70 ring-2 ring-brand-600 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-extrabold text-sm text-slate-900">
                          {pos.name}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {pos.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-2 border-t border-slate-200/60 text-[11px]">
                      <span className="text-slate-400 block">Maks. dimenzija:</span>
                      <span className="font-bold text-slate-700">{pos.maxPrintArea}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-slate-200 flex items-center justify-between shrink-0 bg-slate-50/80 rounded-b-3xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Prekliči
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="px-6 py-2.5 text-xs font-bold text-white bg-brand-700 hover:bg-brand-800 rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Potrdi izbiro (cona: {activeTemp.name})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
