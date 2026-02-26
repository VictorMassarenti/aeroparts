"use client";

import { createContext, useContext, useState } from "react";

import { type StoreApi, useStore } from "zustand";

import { type AeroState, createAeroStore } from "./aero-store";

const AeroStoreContext = createContext<StoreApi<AeroState> | null>(null);

export const AeroStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [store] = useState<StoreApi<AeroState>>(() => createAeroStore());

  return <AeroStoreContext.Provider value={store}>{children}</AeroStoreContext.Provider>;
};

export const useAeroStore = <T,>(selector: (state: AeroState) => T): T => {
  const store = useContext(AeroStoreContext);
  if (!store) throw new Error("Missing AeroStoreProvider");
  return useStore(store, selector);
};
