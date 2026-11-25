"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface AnalyticsEvent {
  id: string;
  timestamp: string;
  type: "quote_click" | "catalog_view" | "cart_add" | "inquiry_submit" | "sample_request" | "order_complete";
  title: string;
  details: string;
  metadata?: Record<string, any>;
}

interface AnalyticsContextType {
  events: AnalyticsEvent[];
  trackEvent: (
    type: AnalyticsEvent["type"],
    title: string,
    details: string,
    metadata?: Record<string, any>
  ) => void;
  clearEvents: () => void;
  isLogOpen: boolean;
  setIsLogOpen: (open: boolean) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("az_demo_analytics_v1");
      if (stored) {
        setEvents(JSON.parse(stored));
      } else {
        // Initial welcome event
        const initEvent: AnalyticsEvent = {
          id: "init-1",
          timestamp: new Date().toLocaleTimeString("sl-SI"),
          type: "catalog_view",
          title: "B2B Seja začeta",
          details: "Uporabnik je obiskal demo portal Agencija Zajček.",
        };
        setEvents([initEvent]);
      }
    } catch (e) {
      console.error("Failed to load analytics", e);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("az_demo_analytics_v1", JSON.stringify(events));
    } catch (e) {
      console.error("Failed to save analytics", e);
    }
  }, [events, isLoaded]);

  const trackEvent = (
    type: AnalyticsEvent["type"],
    title: string,
    details: string,
    metadata?: Record<string, any>
  ) => {
    const newEvent: AnalyticsEvent = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString("sl-SI", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      type,
      title,
      details,
      metadata,
    };
    setEvents((prev) => [newEvent, ...prev.slice(0, 49)]); // keep last 50 events
  };

  const clearEvents = () => {
    setEvents([]);
    localStorage.removeItem("az_demo_analytics_v1");
  };

  return (
    <AnalyticsContext.Provider
      value={{
        events,
        trackEvent,
        clearEvents,
        isLogOpen,
        setIsLogOpen,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider");
  }
  return context;
};
