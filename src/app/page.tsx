"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Clock,
  Users,
  BadgePercent,
  MapPin,
  CheckCircle2,
  Search,
  UploadCloud,
  Eye,
  ShoppingBag,
  Flame,
  ChevronRight,
  Layers,
  Star,
  FileText,
} from "lucide-react";
import { CATEGORIES } from "@/data/categories";
import { PRODUCTS } from "@/data/products";
import { GIFT_PACKS } from "@/data/giftPacks";
import { COMPANY_INFO } from "@/data/company";
import { useModals } from "@/context/ModalContext";
import { useCart } from "@/context/CartContext";
import { useAnalytics } from "@/context/AnalyticsContext";

export default function HomePage() {
  const { openInquiry } = useModals();
  const { addItem } = useCart();
  const { trackEvent } = useAnalytics();

  const handleHeroQuote = () => {
    trackEvent("quote_click", "Hero CTA Klik", "Uporabnik je kliknil na glavni Hero gumb Zahtevaj ponudbo");
    openInquiry({ source: "Homepage Hero Primary CTA" });
  };

  const handleBottomQuote = () => {
    trackEvent("quote_click", "Bottom CTA Klik", "Uporabnik je kliknil na spodnji CTA Zahtevaj ponudbo");
    openInquiry({ source: "Homepage Bottom CTA" });
  };

  const featuredProducts = PRODUCTS.filter((p) => p.featured).slice(0, 4);

  return (
    <div className="space-y-20 sm:space-y-28 pb-16">
      {/* ========================================================
          A) HERO SEKCIJA
          ======================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-950 via-slate-900 to-slate-900 text-white pt-16 sm:pt-24 pb-20 sm:pb-28">
        {/* Subtle geometric background accents */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute top-1/4 -right-24 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-accent-300 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-accent-400" />
                <span>B2B Poslovna darila & Promocijski tisk</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
                Promocijska darila, ki{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-300 via-amber-200 to-accent-400">
                  krepijo prepoznavnost
                </span>{" "}
                vaše blagovne znamke.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Izbira, tisk, embalaža in dobava promocijskih izdelkov za podjetja — od manjših
                naročil do večjih količin. Brezplačen predogled z vašim logotipom v 24 urah.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  type="button"
                  onClick={handleHeroQuote}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-slate-950 font-extrabold text-sm sm:text-base rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-100 transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Zahtevaj ponudbo</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <Link
                  href="/katalogi"
                  className="w-full sm:w-auto px-7 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base rounded-2xl backdrop-blur-md border border-white/20 transition-all flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4 text-accent-300" />
                  <span>Preglej kataloge 2026</span>
                </Link>
              </div>

              {/* 3 Trust Points */}
              <div className="pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-accent-400 flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Več kot 10 let izkušenj</div>
                    <div className="text-[11px] text-slate-400">Preizkušen slovenski partner</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-accent-400 flex-shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Tisk po vašem logotipu</div>
                    <div className="text-[11px] text-slate-400">Gravura, vezenje, sitotisk, DTF</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-accent-400 flex-shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Svetovanje in hitra ponudba</div>
                    <div className="text-[11px] text-slate-400">Odziv v 24 urah z izračunom</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Showcase Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-slate-800/80 backdrop-blur-xl p-3">
                  <img
                    src="https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80"
                    alt="B2B promocijska darila Agencija Zajček"
                    className="w-full h-80 sm:h-96 object-cover rounded-2xl"
                  />

                  {/* Floating badges on image */}
                  <div className="absolute top-6 left-6 bg-slate-950/85 backdrop-blur-md text-white px-3.5 py-2 rounded-xl text-xs font-semibold border border-white/20 shadow-lg flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>Dobava že v 48h (Outlet)</span>
                  </div>

                  <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-md text-slate-900 px-4 py-3 rounded-2xl shadow-xl border border-slate-200 text-xs">
                    <div className="font-extrabold text-brand-950">Brezplačen e-predogled</div>
                    <div className="text-slate-600 text-[11px]">Pred tiskom vedno potrdite postavitev</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          B) KATEGORIJE IZDELKOV (6 kategorij s slikami)
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full">
            <Layers className="w-3.5 h-3.5" />
            Izberite kategorijo
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Celovit nabor promocijskih izdelkov
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Preglejte 6 glavnih skupin izdelkov, primernih za sejme, obdarovanje zaposlenih,
            poslovne partnerje ter promocijo vaše znamke.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {CATEGORIES.map((cat) => {
            const isOutlet = cat.slug === "outlet-shop";
            const targetHref = isOutlet ? "/outlet" : `/kategorije/${cat.slug}`;

            return (
              <div
                key={cat.id}
                className="group bg-white rounded-3xl border border-slate-200 hover:border-brand-500/50 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
              >
                {/* Category Image */}
                <div className="relative h-52 overflow-hidden bg-slate-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {cat.badge && (
                    <div className="absolute top-3 left-3 bg-accent-500 text-slate-950 font-extrabold text-[11px] px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                      {cat.badge}
                    </div>
                  )}
                  <div className="absolute bottom-3 right-3 bg-slate-950/75 backdrop-blur-md text-white text-xs font-medium px-2.5 py-1 rounded-lg">
                    {cat.itemCount} izdelkov
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-900 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {cat.shortDesc}
                    </p>
                  </div>

                  <div className="pt-2">
                    <Link
                      href={targetHref}
                      className="w-full py-2.5 px-4 bg-slate-100 hover:bg-brand-900 hover:text-white text-slate-800 text-xs sm:text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 group-hover:bg-brand-900 group-hover:text-white"
                    >
                      <span>Poglej izdelke</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          C) KAKO DELUJE NAROČILO (4 koraki z ikonami)
          ======================================================== */}
      <section className="bg-slate-50 border-y border-slate-200 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-100 px-3 py-1 rounded-full">
              Preprost postopek
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Kako deluje naročilo pri Agenciji Zajček
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Od vaše začetne ideje do dostave potiskanih izdelkov na vaša vrata v 4 enostavnih korakih.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {COMPANY_INFO.orderSteps.map((s, idx) => {
              const icons = [Search, UploadCloud, Eye, CheckCircle2];
              const IconComponent = icons[idx] || Search;

              return (
                <div
                  key={s.step}
                  className="relative bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between group hover:border-brand-500 hover:shadow-md transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-900 flex items-center justify-center group-hover:bg-brand-900 group-hover:text-white transition-colors">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className="text-2xl font-black text-slate-300 group-hover:text-brand-300 transition-colors">
                        0{s.step}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mb-2">
                      {s.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {s.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={() => openInquiry({ source: "Homepage Steps CTA" })}
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-900 hover:bg-brand-950 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-colors"
            >
              <span>Začnite z naročilom — Zahtevaj ponudbo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          D) ZAKAJ AGENCIJA ZAJČEK (5 prednosti)
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-700 bg-accent-50 px-3 py-1 rounded-full">
              Zanesljiv partner
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Zakaj podjetja izberejo Agencijo Zajček?
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Z več kot desetletjem izkušenj v B2B promociji vemo, da pri poslovnih darilih štejeta
              dve stvari: zanesljivost dobavnega roka ter brezhibna kakovost tiska vašega logotipa.
            </p>
            <div className="pt-2">
              <Link
                href="/o-nas"
                className="inline-flex items-center gap-2 text-brand-900 font-bold text-sm hover:underline"
              >
                <span>Preberite več o našem pristopu</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {COMPANY_INFO.whyUs.map((w, i) => {
              const icons = [Clock, Users, Sparkles, BadgePercent, MapPin];
              const IconComp = icons[i] || Sparkles;

              return (
                <div
                  key={w.title}
                  className={`p-5 rounded-2xl border transition-all ${
                    i === 0
                      ? "bg-brand-900 text-white border-brand-950 sm:col-span-2"
                      : "bg-white text-slate-900 border-slate-200 hover:border-slate-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        i === 0 ? "bg-white/10 text-accent-300" : "bg-brand-50 text-brand-900"
                      }`}
                    >
                      <IconComp className="w-5 h-5" />
                    </div>
                    <h3 className={`font-bold text-sm ${i === 0 ? "text-white" : "text-slate-900"}`}>
                      {w.title}
                    </h3>
                  </div>
                  <p
                    className={`text-xs leading-relaxed ${
                      i === 0 ? "text-slate-300" : "text-slate-600"
                    }`}
                  >
                    {w.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================
          AZ DARILA SPOTLIGHT
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-950 to-slate-900 rounded-3xl text-white p-8 sm:p-12 shadow-xl border border-brand-800/50">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-accent-400 bg-white/10 px-3 py-1 rounded-full">
                Predlagani darilni seti
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                AZ darila — Celoviti promocijski paketi za podjetja
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl">
                Iščete rešitev na ključ? Pripravili smo 3 preizkušene promocijske pakete za zaposlene,
                sejme in ključne stranke — z vključeno personalizirano embalažo in dotiskom.
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/az-darila"
                  className="px-6 py-3 bg-accent-500 hover:bg-accent-600 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md"
                >
                  Preglej AZ darilne pakete
                </Link>
                <button
                  type="button"
                  onClick={() => openInquiry({ source: "AZ Darila Spotlight Banner" })}
                  className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm rounded-xl border border-white/20 transition-colors"
                >
                  Zahtevaj paket po meri
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-1 gap-3">
              {GIFT_PACKS.map((gp) => (
                <Link
                  key={gp.id}
                  href={`/az-darila#${gp.id}`}
                  className="p-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 flex items-center justify-between transition-colors group"
                >
                  <div>
                    <div className="font-bold text-xs text-white group-hover:text-accent-300 transition-colors">
                      {gp.title}
                    </div>
                    <div className="text-[11px] text-slate-400">{gp.suggestedQty}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          E) CTA SEKCIJA (Konverzija na obrazec)
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-slate-900 text-white overflow-hidden p-8 sm:p-14 text-center border border-slate-800 shadow-2xl">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-accent-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-2xl mx-auto space-y-5">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Potrebujete promocijska darila za vaše podjetje?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Pošljite nam zahtevo in pripravili vam bomo ponudbo z možnostmi tiska,
              količino in dobavnim rokom v manj kot 24 urah.
            </p>
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={handleBottomQuote}
                className="w-full sm:w-auto px-8 py-4 bg-accent-500 hover:bg-accent-600 text-slate-950 font-extrabold text-sm sm:text-base rounded-2xl shadow-xl hover:scale-105 active:scale-100 transition-all flex items-center justify-center gap-2"
              >
                <span>Zahtevaj ponudbo</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <Link
                href="/kontakt"
                className="w-full sm:w-auto px-7 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm sm:text-base rounded-2xl border border-slate-700 transition-colors"
              >
                Kontaktirajte nas
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
