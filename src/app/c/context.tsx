"use client";

import { createContext, useContext } from "react";

export interface ClientHeaderContextType {
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
}

export const ClientHeaderContext =
  createContext<ClientHeaderContextType | null>(null);

export const useClientHeader = () => {
  const context = useContext(ClientHeaderContext);
  if (!context) {
    throw new Error("useClientHeader must be used within ClientLayout");
  }
  return context;
};
