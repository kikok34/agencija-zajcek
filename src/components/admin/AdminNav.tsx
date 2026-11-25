"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Truck,
  ShoppingCart,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { useProducts } from "@/context/ProductContext";
import { useOrders } from "@/context/OrderContext";

export const AdminNav: React.FC = () => {
  const pathname = usePathname();
  const { metrics, resetAllDemoData } = useProducts();
  const { newOrdersCount, ordersCount } = useOrders();

  const navItems = [
    {
      label: "Nadzorna plošča",
      href: "/admin",
      icon: LayoutDashboard,
      active: pathname === "/admin",
    },
    {
      label: "Katalog izdelkov",
      href: "/admin/izdelki",
      icon: Package,
      active: pathname.startsWith("/admin/izdelki"),
      badge: metrics.needsReviewCount > 0 ? `${metrics.needsReviewCount} v pregledu` : undefined,
      badgeColor: "bg-amber-100 text-amber-800",
    },
    {
      label: "Dobavitelji (sinhronizacija)",
      href: "/admin/dobavitelji",
      icon: Truck,
      active: pathname.startsWith("/admin/dobavitelji"),
      badge: "Simulirano",
      badgeColor: "bg-blue-100 text-blue-800",
    },
    {
      label: "Prejeta naročila",
      href: "/admin/narocila",
      icon: ShoppingCart,
      active: pathname.startsWith("/admin/narocila"),
      badge: newOrdersCount > 0 ? `${newOrdersCount} novih` : `${ordersCount}`,
      badgeColor: newOrdersCount > 0 ? "bg-emerald-100 text-emerald-800 font-bold animate-pulse" : "bg-slate-100 text-slate-700",
    },
  ];

  return (
    <div className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      {/* Top Demo Disclaimer Ribbon */}
      <div className="bg-slate-950 text-slate-400 text-xs px-4 py-1.5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-semibold text-slate-200">
            DEMO 2 ADMINISTRACIJA:
          </span>
          <span className="hidden sm:inline">
            Predstavitveni modul za upravljanje izdelkov, cen, dobaviteljev in testnih B2B naročil.
          </span>
          <span className="text-amber-400 font-medium ml-auto hidden md:inline">
            Podatki se hranijo lokalno v vašem brskalniku (IndexedDB & LocalStorage).
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Environment Badge */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white shadow font-bold text-base">
                AZ
              </div>
              <div>
                <div className="font-extrabold text-sm tracking-tight text-white flex items-center gap-2">
                  <span>Agencija Zajček</span>
                  <span className="bg-slate-800 text-brand-400 border border-slate-700 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                    Admin Demo
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Upravljanje kataloga in naročil
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                    item.active
                      ? "bg-brand-600 text-white shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg transition-colors border border-slate-700"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Trgovina</span>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden overflow-x-auto py-2 border-t border-slate-800 gap-1 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 ${
                  item.active
                    ? "bg-brand-600 text-white"
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] px-1 py-0.2 rounded ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
