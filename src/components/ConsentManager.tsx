"use client";

import { useEffect } from "react";

export default function ConsentManager() {
  useEffect(() => {
    // Load Consent Manager script
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.setAttribute("data-cmp-ab", "1");
    script.src = "https://cdn.consentmanager.net/delivery/autoblocking/8c3bf1b852f2b.js";
    script.setAttribute("data-cmp-host", "d.delivery.consentmanager.net");
    script.setAttribute("data-cmp-cdn", "cdn.consentmanager.net");
    script.setAttribute("data-cmp-codesrc", "16");
    script.async = true;

    // Add script to head
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return null;
}

// Hook to check consent status
export const useConsentStatus = () => {
  const checkConsentStatus = () => {
    if (typeof window !== "undefined" && window.__cmp) {
      return new Promise((resolve) => {
        window.__cmp("addEventListener", "consent", (consent: unknown) => {
          resolve(consent);
        });
      });
    }
    return Promise.resolve(null);
  };

  return { checkConsentStatus };
};

// Types for Consent Manager
declare global {
  interface Window {
    __cmp: (command: string, parameter: string, callback: (result: unknown) => void) => void;
  }
}