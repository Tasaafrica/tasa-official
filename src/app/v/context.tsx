"use client";

import { createContext, useContext } from "react";

export interface VendorHeaderContextType {
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
}

const noopContext: VendorHeaderContextType = {
  setTitle: () => {},
  setDescription: () => {},
};

export const VendorHeaderContext =
  createContext<VendorHeaderContextType>(noopContext);

export const useVendorHeader = () => {
  return useContext(VendorHeaderContext) || noopContext;
};
