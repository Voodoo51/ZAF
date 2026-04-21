import { ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAppContext } from "./App";
import { HomeView } from "./views/Home";
import { Layout } from "./views/Layout";
import { LoginView } from "./views/Login";
import { ProfileView } from "./views/Profile";

const Protected = ({ children }: { children: ReactNode }) => {
  const { user } = useAppContext();
  if (!user) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
};

export const Nav = () =>{
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginView />} />
          <Route path="/" element={<Protected><HomeView /></Protected>} />
          <Route path="/profile" element={<Protected><ProfileView /></Protected>} />
        </Routes>
      </BrowserRouter>
  );
}