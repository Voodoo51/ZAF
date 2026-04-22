import React, { createContext, useContext, useState, ReactNode } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { Nav } from "./Navigation";

type AppContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

type User = {
  id: number;
  name: string | null;
  surname: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  return <AppContext.Provider value={{ user, setUser }}>{children}</AppContext.Provider>;
};

type FilterContextType = {
  active: string;
  setActive: (value: string) => void;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [active, setActive] = useState("all");

  return (
    <FilterContext.Provider value={{ active, setActive }}>
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
