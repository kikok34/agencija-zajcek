"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { DemoOrder, OrderStatus } from "@/types/orders";

interface OrderContextType {
  orders: DemoOrder[];
  addOrder: (order: DemoOrder) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  getOrder: (idOrNumber: string) => DemoOrder | undefined;
  ordersCount: number;
  newOrdersCount: number;
}

const STORAGE_KEY_ORDERS = "az_demo_orders_v2";

const INITIAL_DEMO_ORDERS: DemoOrder[] = [
  {
    id: "ord-demo-01",
    orderNumber: "ZJ-2026-0041",
    createdAt: new Date(Date.now() - 3600000 * 26).toLocaleDateString("sl-SI", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    status: "V pregledu",
    customer: {
      company: "Inovativne Rešitve d.o.o.",
      fullName: "Maja Novak",
      email: "maja.novak@inovacije-resitve.si",
      phone: "+386 40 123 456",
      vatNumber: "SI12345678",
      address: "Slovenska cesta 55, 1000 Ljubljana",
      requestedDeliveryDate: "15. 12. 2026",
      notes: "Logotip želimo v beli barvi na prsih in graviran na pokrovu posode.",
    },
    items: [
      {
        id: "home-04",
        sku: "AZ-HOM-504",
        name: "Bento eko posoda za malico z bambusovim pokrovom 1000ml",
        price: 6.80,
        quantity: 100,
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
        color: "Bambus / Antracit siva",
        printOption: "branded",
        printingPosition: {
          id: "pokrov",
          name: "Pokrov (bambus)",
          description: "Zgornja površina bambusovega pokrova",
          maxPrintArea: "100 × 60 mm (demo)",
          technique: "Laserska gravura",
          dashedArea: { top: "25%", left: "20%", width: "60%", height: "50%" },
        },
        artworkFileName: "logo_inovacije_vektor.pdf",
        artworkFileSize: 1420500,
        artworkFileType: "application/pdf",
        notes: "Prosimo za vizualni predogled gravure pred zagonom.",
      },
      {
        id: "tek-01",
        sku: "AZ-TEK-101",
        name: "Organska unisex majica Organic Creator 180g",
        price: 4.85,
        quantity: 100,
        image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
        color: "Mornarsko modra",
        size: "L",
        printOption: "branded",
        printingPosition: {
          id: "prsa_levo",
          name: "Prsa levo (srčna stran)",
          description: "Klasična pozicija za logotip",
          maxPrintArea: "100 × 100 mm (demo)",
          technique: "Sitotisk ali vezenje",
          dashedArea: { top: "28%", left: "55%", width: "20%", height: "18%" },
        },
        artworkFileName: "logo_inovacije_vektor.pdf",
        artworkFileSize: 1420500,
        artworkFileType: "application/pdf",
        notes: "Bela barva tiska na temno modro podlago.",
      },
    ],
    subtotal: 1165.00,
    hasBrandedItems: true,
    vatRate: 22,
    vatAmount: 256.30,
    totalEstimatedWithVat: 1421.30,
    generalArtworkFileName: "brandbook_2026.pdf",
    acknowledgedDemoNotice: true,
  },
  {
    id: "ord-demo-02",
    orderNumber: "ZJ-2026-0040",
    createdAt: new Date(Date.now() - 3600000 * 72).toLocaleDateString("sl-SI", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    status: "Novo",
    customer: {
      company: "Alpski Turizem & Hoteli d.o.o.",
      fullName: "Gregor Kovač",
      email: "gregor@alpski-hoteli.si",
      phone: "+386 31 987 654",
      vatNumber: "SI87654321",
      address: "Triglavska cesta 12, 4260 Bled",
      requestedDeliveryDate: "01. 12. 2026",
      notes: "Nujno potrebujemo za otvoritev zimske sezone.",
    },
    items: [
      {
        id: "home-01",
        sku: "AZ-HOM-501",
        name: "Termo steklenica iz nerjavečega jekla HydroLock 500ml",
        price: 6.90,
        quantity: 150,
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80",
        color: "Mat nočno modra",
        printOption: "branded",
        printingPosition: {
          id: "telo_spredaj",
          name: "Telo spredaj",
          description: "Vzdolžna gravura logotipa hotela",
          maxPrintArea: "35 × 120 mm (demo)",
          technique: "Laserska gravura 360°",
          dashedArea: { top: "30%", left: "35%", width: "30%", height: "40%" },
        },
        artworkFileName: "alpski_hotel_logo.svg",
        artworkFileSize: 84200,
        artworkFileType: "image/svg+xml",
      },
    ],
    subtotal: 1035.00,
    hasBrandedItems: true,
    vatRate: 22,
    vatAmount: 227.70,
    totalEstimatedWithVat: 1262.70,
    acknowledgedDemoNotice: true,
  },
];

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<DemoOrder[]>(INITIAL_DEMO_ORDERS);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ORDERS);
      if (stored) {
        setOrders(JSON.parse(stored));
      } else {
        localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(INITIAL_DEMO_ORDERS));
      }
    } catch (e) {
      console.error("Failed to load orders from localStorage", e);
    }
  }, []);

  const saveOrders = (updated: DemoOrder[]) => {
    setOrders(updated);
    try {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save orders to localStorage", e);
    }
  };

  const addOrder = (order: DemoOrder) => {
    const updated = [order, ...orders];
    saveOrders(updated);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    const updated = orders.map((ord) => {
      if (ord.id === orderId || ord.orderNumber === orderId) {
        return {
          ...ord,
          status,
          customer: {
            ...ord.customer,
            notes: note ? `${ord.customer.notes || ""}\n[Opomba skrbnika]: ${note}` : ord.customer.notes,
          },
        };
      }
      return ord;
    });
    saveOrders(updated);
  };

  const getOrder = (idOrNumber: string) => {
    return orders.find((o) => o.id === idOrNumber || o.orderNumber === idOrNumber);
  };

  const newOrdersCount = orders.filter((o) => o.status === "Novo").length;

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        updateOrderStatus,
        getOrder,
        ordersCount: orders.length,
        newOrdersCount,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};
