/**
 * Polyfill for React.useEffectEvent
 *
 * Sanity 5.15+ uses useEffectEvent, which is a React canary API not present
 * in stable React 19.x or Next.js's internal compiled React build.
 *
 * This module must be the FIRST import in the studio page so that the React
 * object is patched before Sanity's modules are evaluated.
 *
 * Implementation: a stable wrapper ref that always delegates to the latest fn.
 */
import React from "react";

type AnyFn = (...args: unknown[]) => unknown;
const R = React as unknown as Record<string, unknown>;

if (!R["useEffectEvent"]) {
  R["useEffectEvent"] = function useEffectEvent<T extends AnyFn>(fn: T): T {
    // ref holds latest fn so the stable wrapper always calls the current version
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const latestRef = React.useRef<T>(fn);
    latestRef.current = fn;

    // stableRef holds the wrapper function — created once, never changes
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const stableRef = React.useRef<T | null>(null);
    if (stableRef.current === null) {
      stableRef.current = ((...args: Parameters<T>) =>
        latestRef.current(...args)) as unknown as T;
    }

    return stableRef.current;
  };
}

export {};
