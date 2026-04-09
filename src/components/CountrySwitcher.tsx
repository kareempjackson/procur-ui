"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchActiveCountries,
  selectCountry,
  selectCountries,
} from "@/store/slices/countrySlice";

export default function CountrySwitcher() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { code: currentCode, name: currentName, status } =
    useAppSelector(selectCountry);
  const countries = useAppSelector(selectCountries);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchActiveCountries());
    }
  }, [dispatch, status]);

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (countries.length <= 1) return null;

  const handleSelect = (code: string) => {
    setOpen(false);
    // Replace the country segment in the current path
    const segments = pathname.split("/").filter(Boolean);
    if (segments[0] === currentCode) {
      segments[0] = code;
    } else {
      segments.unshift(code);
    }
    router.push(`/${segments.join("/")}`);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-black/10 hover:bg-black/[0.03] transition-colors"
      >
        <svg
          className="w-3.5 h-3.5 text-[var(--secondary-muted-edge)]"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
          />
        </svg>
        <span>{currentName || currentCode || "Select Country"}</span>
        <svg
          className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-black/10 py-1 z-50">
          {countries.map((country) => (
            <button
              key={country.code}
              onClick={() => handleSelect(country.code)}
              className={`w-full text-left px-4 py-2 text-xs hover:bg-black/[0.03] transition-colors flex items-center justify-between ${
                country.code === currentCode
                  ? "text-[var(--secondary-muted-edge)] font-semibold"
                  : "text-black/70"
              }`}
            >
              <span>{country.name}</span>
              <span className="text-black/30 font-mono">{country.currency}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
