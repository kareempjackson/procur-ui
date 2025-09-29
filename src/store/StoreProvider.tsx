"use client";

import { PropsWithChildren, useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { hydrateFromStorage } from "@/store/slices/authSlice";

export default function StoreProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    store.dispatch(hydrateFromStorage());
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
