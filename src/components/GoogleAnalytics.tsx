"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Google Analytics tracking ID - Thay thế bằng ID thực của bạn
const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID || "G-XXXXXXXXXX";

// Check if user has consented to analytics
const hasAnalyticsConsent = (): boolean => {
  if (typeof window === "undefined") return false;

  // Check consent manager status
  if (typeof window.__cmp === "function") {
    // For now, assume consent is given - in real implementation,
    // you would check the actual consent status from the consent manager
    return true;
  }

  // Fallback: check localStorage for consent
  const consent = localStorage.getItem("analytics_consent");
  return consent === "true";
};

// Khởi tạo Google Analytics only if consent is given
export const initGA = () => {
  if (
    typeof window !== "undefined" &&
    GA_TRACKING_ID &&
    GA_TRACKING_ID !== "G-XXXXXXXXXX" &&
    hasAnalyticsConsent()
  ) {
    // Load Google Analytics script
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    script.async = true;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    }
    window.gtag = gtag;

    gtag("js", new Date());
    gtag("config", GA_TRACKING_ID, {
      page_title: document.title,
      page_location: window.location.href,
    });
  }
};

// Track page views
export const trackPageView = (url: string) => {
  if (
    typeof window !== "undefined" &&
    window.gtag &&
    GA_TRACKING_ID !== "G-XXXXXXXXXX" &&
    hasAnalyticsConsent()
  ) {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url,
      page_title: document.title,
      page_location: window.location.href,
    });
  }
};

// Track custom events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== "undefined" && window.gtag && hasAnalyticsConsent()) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track specific URL visits
export const trackUrlVisit = (
  url: string,
  additionalData?: Record<string, unknown>
) => {
  if (typeof window !== "undefined" && window.gtag && hasAnalyticsConsent()) {
    window.gtag("event", "page_view", {
      page_path: url,
      page_title: document.title,
      page_location: window.location.href,
      custom_parameter_1: "url_specific_tracking",
      ...additionalData,
    });
  }
};

// Component to track page changes
export default function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    if (pathname) {
      const url = pathname + (searchParams ? `?${searchParams}` : "");
      trackPageView(url);

      // Track specific URL if it's a job application page
      if (pathname.includes("/apply/")) {
        trackUrlVisit(url, {
          page_type: "job_application",
          job_id: pathname.split("/").pop(),
        });
      }
    }
  }, [pathname, searchParams]);

  return null;
}

// Types for TypeScript
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}
