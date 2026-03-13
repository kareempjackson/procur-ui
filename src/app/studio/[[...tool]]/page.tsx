"use client";
// Polyfill must be first — patches React.useEffectEvent before Sanity loads
import "./react-polyfill";

import dynamicImport from "next/dynamic";

export const dynamic = "force-dynamic";

// Dynamically import the studio with ssr:false so Next.js never attempts
// to server-render it. This also prevents webpack from statically analyzing
// Sanity's React imports during the SSR build pass.
const Studio = dynamicImport(
  async () => {
    const [{ NextStudio }, config] = await Promise.all([
      import("next-sanity/studio"),
      import("../../../../sanity.config"),
    ]);
    return function ProcurStudio() {
      return <NextStudio config={config.default} />;
    };
  },
  { ssr: false }
);

export default function StudioPage() {
  return <Studio />;
}
