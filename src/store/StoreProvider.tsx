"use client";

import { PropsWithChildren, useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { hydrateFromStorage, refreshTokenAsync } from "@/store/slices/authSlice";

/** Decode a JWT and check if it has expired (no signature verification needed client-side). */
function isJwtExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return typeof payload.exp === "number" && payload.exp * 1000 < Date.now();
  } catch {
    return false;
  }
}

export default function StoreProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    store.dispatch(hydrateFromStorage());

    // After hydrating, silently refresh if the access token is expired but
    // we still have a refresh token (user's session is still recoverable).
    const { auth } = store.getState();
    if (auth.accessToken && isJwtExpired(auth.accessToken) && auth.refreshToken) {
      store.dispatch(refreshTokenAsync());
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
