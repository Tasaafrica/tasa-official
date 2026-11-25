"use client";

import React, { createContext, useContext, useState } from "react";
import SearchModal from "@/app/component/parts/searchModal";

export interface SearchScope {
  categorySlug?: string;
  categoryName?: string;
}

interface SearchModalContextType {
  openSearch: (scopeOrEvent?: SearchScope | React.MouseEvent | unknown) => void;
  closeSearch: () => void;
  activeScope?: SearchScope;
  setScope: (scope?: SearchScope) => void;
}

const SearchModalContext = createContext<SearchModalContextType | undefined>(undefined);

export function SearchModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeScope, setActiveScope] = useState<SearchScope | undefined>(undefined);

  const openSearch = (scopeOrEvent?: SearchScope | React.MouseEvent | unknown) => {
    // If it's a DOM/React event (e.g. from onClick={openSearch}), do not treat it as a scope object
    const isValidScope =
      scopeOrEvent &&
      typeof scopeOrEvent === "object" &&
      !("nativeEvent" in scopeOrEvent) &&
      ("categorySlug" in scopeOrEvent || "categoryName" in scopeOrEvent);

    setActiveScope(isValidScope ? (scopeOrEvent as SearchScope) : undefined);
    setIsOpen(true);
  };

  const closeSearch = () => {
    setIsOpen(false);
  };

  const setScope = (scope?: SearchScope) => {
    setActiveScope(scope);
  };

  return (
    <SearchModalContext.Provider value={{ openSearch, closeSearch, activeScope, setScope }}>
      {children}
      <SearchModal 
        isOpen={isOpen} 
        onClose={closeSearch}
        initialScope={activeScope}
        onClearScope={() => setActiveScope(undefined)}
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
