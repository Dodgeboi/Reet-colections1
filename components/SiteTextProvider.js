"use client";
import { createContext, useContext } from "react";
import { textOf } from "@/lib/siteText";

// Site settings (incl. owner-edited text) fetched once in app/layout.js and
// handed down via context, so deeply-nested client components (search,
// cart, size guide, newsletter…) don't need `site` threaded through every
// prop chain to render owner-editable copy.
const SiteTextContext = createContext(null);

export function SiteTextProvider({ site, children }) {
  return <SiteTextContext.Provider value={site}>{children}</SiteTextContext.Provider>;
}

export function useSiteText(key) {
  const site = useContext(SiteTextContext);
  return textOf(site, key);
}

export function useSite() {
  return useContext(SiteTextContext);
}
