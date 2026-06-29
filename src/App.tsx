import React, { createContext, useContext, useState, ReactNode } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { Nav } from "./Navigation";
import type { User } from "./types";

type AppContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  search: string;
  setSearch: (search: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [search, setSearch] = useState<string>("");
  return <AppContext.Provider value={{ user, setUser, search, setSearch }}>{children}</AppContext.Provider>;
};

type FilterContextType = {
  filterId: number;
  setFilterId: (value: number) => void;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [filterId, setFilterId] = useState(-1);

  return (
    <FilterContext.Provider value={{ filterId, setFilterId }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) throw new Error("useFilter must be used within FilterProvider");
  return context;
};
export default function App() {
  return (
    <AppProvider>
      <FilterProvider>
        <Nav />
      </FilterProvider>
    </AppProvider>
  );
}
