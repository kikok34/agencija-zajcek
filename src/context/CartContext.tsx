"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  color?: string;
  size?: string;
  printTechnique?: string;
  minQuantity?: number;
  stock?: number;
  isOutlet?: boolean;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (uniqueKey: string) => void;
  updateQuantity: (uniqueKey: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  toastMessage: string | null;
  clearToast: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const getItemKey = (item: { id: string; color?: string; size?: string; printTechnique?: string }) => {
  return `${item.id}__${item.color || "def"}__${item.size || "def"}__${item.printTechnique || "none"}`;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("az_cart_v1");
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("az_cart_v1", JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [items, isLoaded]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const clearToast = () => {
    setToastMessage(null);
  };

  const addItem = (item: Omit<CartItem, "quantity">, quantity = 1) => {
    const key = getItemKey(item);
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => getItemKey(i) === key);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
        return updated;
      } else {
        return [...prev, { ...item, quantity }];
      }
    });

    showToast(`Izdelek »${item.name}« (${quantity} kos) je dodan v košarico.`);
  };

  const removeItem = (uniqueKey: string) => {
    setItems((prev) => prev.filter((i) => getItemKey(i) !== uniqueKey));
  };

  const updateQuantity = (uniqueKey: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(uniqueKey);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (getItemKey(i) === uniqueKey ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        toastMessage,
        clearToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
