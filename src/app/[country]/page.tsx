"use client";

// The country landing page re-uses the main landing page component.
// Country context is set by [country]/layout.tsx → countrySlice → cookie → apiClient header.
// The landing page's API calls (products, sellers) automatically include the X-Country-Code header.
export { default } from "../page";
