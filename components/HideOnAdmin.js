"use client";
import { usePathname } from "next/navigation";

// The storefront footer doesn't belong on the owner dashboard.
export default function HideOnAdmin({ children }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return children;
}
