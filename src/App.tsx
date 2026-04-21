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

export default function App() {
  return (
    <AppProvider>
      <Nav />
    </AppProvider>
  );
}
