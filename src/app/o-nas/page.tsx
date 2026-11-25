"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Users,
  Award,
  Layers,
  CheckCircle2,
  Phone,
  Clock,
  MapPin,
} from "lucide-react";
import { useModals } from "@/context/ModalContext";
import { useAnalytics } from "@/context/AnalyticsContext";
import { COMPANY_INFO } from "@/data/company";

export default function AboutPage() {
  const { openInquiry } = useModals();
  const { trackEvent } = useAnalytics();

  const handleQuoteClick = () => {
    trackEvent("quote_click", "O nas CTA klik", "Zahtevaj ponudbo s strani O nas");
    openInquiry({ source: "O nas stran CTA" });
  };

  return (
    <div className="py-12 space-y-20">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full">
            <Award className="w-3.5 h-3.5" />
            10+ let uspešnih B2B projektov
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Zanesljiv partner pri grajenju prepoznavnosti vaše znamke
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            V Agenciji Zajček že več kot desetletje pomagamo podjetjem, organizacijam
            in agencijam izbrati ter izdelati promocijska darila, ki navdušijo prejemnike
            in trajno utrdijo ugled podjetja.
          </p>
        </div>
      </div>

      {/* Story & Image Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5 text-sm sm:text-base text-slate-600 leading-relaxed">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Naša zgodba: Od ideje do popolnega dotiska
            </h2>
            <p>
              Agencija Zajček je nastala z jasno vizijo: odpraviti generične promocijske
              kataloge in podjetjem ponuditi osredotočeno, premišljeno svetovanje ter
              brezkompromisno kakovost izvedbe.
            </p>
            <p>
              Zavedamo se, da poslovno darilo ni le artikel s potiskom, temveč neposreden
              odraz vaše organizacije. Zato vsakemu projektu posvetimo osebno pozornost —
              od predloga optimalnega materiala in barvne lestvice do natančnega nadzora
              kakovosti tiska pred pošiljanjem.
            </p>
            <p>
              Danes uspešno sodelujemo z več kot 500 vodilnimi slovenskimi in mednarodnimi
              podjetji, HR oddelki, marketinškimi ekipami ter organizatorji največjih
              poslovnih dogodkov.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleQuoteClick}
                className="px-6 py-3 bg-brand-900 hover:bg-brand-950 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-colors flex items-center gap-2"
              >
                <span>Zahtevaj ponudbo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200 aspect-4/3 bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                alt="Ekipa Agencije Zajček"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3 Glavne prednosti */}
      <div className="bg-slate-50 border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-100 px-3 py-1 rounded-full">
              Naša zaveza
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
              3 ključne prednosti sodelovanja z nami
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Prednost 1: Izkušnje */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-brand-500 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-900 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">1. Večletne izkušnje</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Poznamo pasti tiskarskih tehnik in vedenje različnih materialov. Naše
                  izkušnje vam prihranijo čas, denar in neprijetna presenečenja pri končnem izdelku.
                </p>
              </div>
              <ul className="text-xs text-slate-500 space-y-1 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent-600" />
                  Preizkušene tiskarske tehnologije
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent-600" />
                  Strogo spoštovanje dogovorjenih rokov
                </li>
              </ul>
            </div>

            {/* Prednost 2: Osebni pristop */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-brand-500 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-accent-50 text-accent-700 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">2. Osebni pristop in svetovanje</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Za vaš projekt skrbi osebni komercialist, ki pozna vaše zahteve, vam pošlje
                  fizične vzorce ter pripravi digitalne simulacije pred potrditvijo naročila.
                </p>
              </div>
              <ul className="text-xs text-slate-500 space-y-1 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent-600" />
                  Brezplačen e-predogled v 24h
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent-600" />
                  Možnost ogleda vzorcev v živo v Ljubljani
                </li>
              </ul>
            </div>

            {/* Prednost 3: Široka izbira */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-brand-500 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">3. Široka izbira & hitra zaloga</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Dostop do več kot 40.000 artiklov evropskih proizvajalcev in bogat domači outlet
                  s takojšnjo dobavo za nujne promocijske akcije.
                </p>
              </div>
              <ul className="text-xs text-slate-500 space-y-1 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent-600" />
                  Ekološki in certificirani artikli (GOTS, OEKO-TEX)
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent-600" />
                  Outlet artikli na zalogi s popusti do -55%
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-14 text-center border border-slate-800 shadow-xl space-y-5">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Pripravljeni na uspešno promocijsko kampanjo?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Kontaktirajte nas z vašimi željami in v roku enega delovnega dne vam bomo pripravili
            natančno ponudbo z brezplačnim predogledom tiska.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={handleQuoteClick}
              className="px-8 py-3.5 bg-accent-500 hover:bg-accent-600 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Zahtevaj ponudbo</span>
            </button>
            <Link
              href="/kontakt"
              className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm rounded-xl border border-slate-700 transition-colors"
            >
              Kontaktni obrazec
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
