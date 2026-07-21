"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type AdEligibilityState = {
  adsAllowed: boolean;
  country: string | null;
  isResolved: boolean;
};

const DEFAULT_STATE: AdEligibilityState = {
  adsAllowed: false,
  country: null,
  isResolved: false,
};

const AdEligibilityContext = createContext<AdEligibilityState>(DEFAULT_STATE);

export function AdEligibilityProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AdEligibilityState>(DEFAULT_STATE);

  useEffect(() => {
    const controller = new AbortController();

    async function resolveEligibility() {
      try {
        const response = await fetch("/api/ad-eligibility", {
          cache: "no-store",
          credentials: "same-origin",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Ad eligibility request failed: ${response.status}`);
        }

        const payload = (await response.json()) as {
          adsAllowed?: boolean;
          country?: string | null;
        };

        setState({
          adsAllowed: payload.adsAllowed === true,
          country:
            typeof payload.country === "string"
              ? payload.country.toUpperCase()
              : null,
          isResolved: true,
        });
      } catch (error) {
        if (controller.signal.aborted) return;

        // Fail closed: if country detection cannot be completed, do not load ads.
        setState({ adsAllowed: false, country: null, isResolved: true });
      }
    }

    void resolveEligibility();

    return () => controller.abort();
  }, []);

  const value = useMemo(() => state, [state]);

  return (
    <AdEligibilityContext.Provider value={value}>
      {children}
    </AdEligibilityContext.Provider>
  );
}

export function useAdEligibility() {
  return useContext(AdEligibilityContext);
}
