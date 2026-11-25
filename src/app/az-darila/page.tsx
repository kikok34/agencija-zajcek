"use client";

import React from "react";
import Link from "next/link";
import {
  Gift,
  ArrowRight,
  Sparkles,
  Check,
  Package,
  Layers,
  CheckCircle2,
  Phone,
  FileCheck,
} from "lucide-react";
import { GIFT_PACKS } from "@/data/giftPacks";
import { useModals } from "@/context/ModalContext";
import { useAnalytics } from "@/context/AnalyticsContext";

export default function AzDarilaPage() {
  const { openInquiry } = useModals();
  const { trackEvent } = useAnalytics();

  const handlePackInquiry = (packTitle: string) => {
    trackEvent(
      "quote_click",
      `Zahtevaj ponudbo za paket: ${packTitle}`,
      `Klik iz strani AZ darila`
    );
    openInquiry({
      productName: packTitle,
      interest: "darila-zaposleni",
      source: `AZ Darila: ${packTitle}`,
    });
  };

  return (
    <div className="py-12 space-y-16">
      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full">
            <Gift className="w-3.5 h-3.5" />
            B2B Rešitve na ključ
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            AZ darila — izbrana promocijska rešitev za vaše podjetje
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            AZ darila so namenjena podjetjem, ki želijo kakovostna promocijska darila
            za zaposlene, stranke, dogodke in poslovne priložnosti. Poskrbimo za celovito
            izvedbo: od izbire izdelkov, vrhunskega tiska vašega logotipa do personalizirane
            darilne embalaže.
          </p>
        </div>
      </div>

      {/* 3 Gift Packs Detailed Showcase */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {GIFT_PACKS.map((pack, idx) => {
          const isEven = idx % 2 === 1;

          return (
            <div
              key={pack.id}
              id={pack.id}
              className={`rounded-3xl border border-slate-200 overflow-hidden bg-white shadow-lg flex flex-col ${
                isEven ? "lg:flex-row-reverse" : "lg:flex-row"
              } gap-8 p-6 sm:p-10`}
            >
              {/* Image side */}
              <div className="lg:w-1/2 flex flex-col justify-between space-y-4">
                <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-slate-100 border border-slate-200">
                  <img
                    src={pack.image}
                    alt={pack.title}
                    className="w-full h-full object-cover"
                  />
                  {pack.badge && (
                    <div className="absolute top-4 left-4 bg-brand-900 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                      {pack.badge}
                    </div>
                  )}
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-brand-700" />
                    <span>Embalaža & Personalizacija:</span>
                  </div>
                  <p className="text-slate-600">{pack.packaging}</p>
                </div>
              </div>

              {/* Content side */}
              <div className="lg:w-1/2 flex flex-col justify-between space-y-6">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-accent-700 bg-accent-50 inline-block px-2.5 py-0.5 rounded-full mb-2">
                    Paket 0{idx + 1}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {pack.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-brand-700 font-semibold mt-1">
                    {pack.subtitle}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    {pack.shortDesc}
                  </p>

                  {/* Included items */}
                  <div className="mt-6 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Vključeni promocijski izdelki v paketu:
                    </h4>
                    <div className="space-y-2">
                      {pack.items.map((it, i) => (
                        <div
                          key={i}
                          className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-3"
                        >
                          <div className="w-5 h-5 rounded bg-brand-100 text-brand-800 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">
                            {i + 1}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">{it.name}</div>
                            <div className="text-[11px] text-slate-500">{it.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Meta stats */}
                  <div className="mt-6 pt-4 border-t border-slate-200 grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                        Predlagana količina:
                      </span>
                      <span className="font-bold text-slate-800">{pack.suggestedQty}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                        Okvirni dobavni rok:
                      </span>
                      <span className="font-bold text-slate-800">{pack.deliveryTime}</span>
                    </div>
                  </div>
                </div>

                {/* Pack CTA */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => handlePackInquiry(pack.title)}
                    className="w-full py-3.5 px-6 bg-brand-900 hover:bg-brand-950 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 group"
                  >
                    <Sparkles className="w-4 h-4 text-accent-300" />
                    <span>Zahtevaj ponudbo za {pack.title}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Strong Bottom CTA on AZ Darila */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-slate-900 text-white overflow-hidden p-8 sm:p-14 text-center border border-slate-800 shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Želite ponudbo za vaše podjetje? Kontaktirajte nas.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Z veseljem se prilagodimo vašemu proračunu in pripravimo individualno sestavljen
              darilni set, ki bo točno ustrezal vaši panogi in dogodku.
            </p>
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() =>
                  openInquiry({
                    interest: "darila-zaposleni",
                    source: "AZ Darila Bottom Strong CTA",
                  })
                }
                className="w-full sm:w-auto px-8 py-3.5 bg-accent-500 hover:bg-accent-600 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-xl transition-all"
              >
                Zahtevaj paketno ponudbo
              </button>
              <Link
                href="/kontakt"
                className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm rounded-xl border border-slate-700 transition-colors"
              >
                Kontaktni podatki in svetovanje
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
