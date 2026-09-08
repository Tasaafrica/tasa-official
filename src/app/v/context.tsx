"use client";

import { createContext, useContext } from "react";

export interface VendorHeaderContextType {
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
}

export const VendorHeaderContext =
  createContext<VendorHeaderContextType | null>(null);

export const useVendorHeader = () => {
  const context = useContext(VendorHeaderContext);
  if (!context) {
    throw new Error("useVendorHeader must be used within VendorLayout");
  }
  return context;
};
