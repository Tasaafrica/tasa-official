"use client";

import React, { createContext, useContext, useState } from "react";
import SearchModal from "@/app/component/parts/searchModal";

interface SearchModalContextType {
  openSearch: () => void;
  closeSearch: () => void;
}

const SearchModalContext = createContext<SearchModalContextType | undefined>(undefined);

export function SearchModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openSearch = () => setIsOpen(true);
  const closeSearch = () => setIsOpen(false);

  return (
    <SearchModalContext.Provider value={{ openSearch, closeSearch }}>
      {children}
      <SearchModal 
        isOpen={isOpen} 
        onClose={closeSearch} 
      />
    </SearchModalContext.Provider>
  );
}

export function useSearchModal() {
  const context = useContext(SearchModalContext);
  if (context === undefined) {
    throw new Error("useSearchModal must be used within a SearchModalProvider");
  }
  return context;
}
