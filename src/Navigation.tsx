import { ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAppContext } from "./App";
import { HomeView } from "./views/Home";
import { Layout } from "./views/Layout";
import { LoginView } from "./views/Login";
import { ProfileView } from "./views/Profile";
import { FormView } from "./views/Form";
import { CreatorView } from "./views/Creator";
import { PaymentsView } from "./views/Payments";
import { PropositionListView } from "./views/PropositionList";
import { PropositionCreatorView } from "./views/PropositionCreator";
import { PropositionDetailsView } from "./views/PropositionDetails";
import { RegisterUserView } from "./views/RegisterUser";
import { UsersView } from "./views/Users";
import { PaymentsAdminView } from "./views/PaymentsAdmin";

const Protected = ({ children }: { children: ReactNode }) => {
  const { user } = useAppContext();
  if (!user) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
};

export const Nav = () =>{
  const { user } = useAppContext();
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginView />} />
          <Route path="/" element={<Protected><HomeView /></Protected>} />
          <Route path="/profile" element={<Protected><ProfileView /></Protected>} />
          <Route path="/form/:templateId" element={<Protected><FormView /></Protected>} />
          {user?.role !== "student" && (
            <Route path="/creator" element={<Protected><CreatorView/></Protected>} />
          )}
          <Route path="/payment" element={<Protected><PaymentsView/></Protected>} />
          <Route path="/payments/:userId" element={<Protected><PaymentsAdminView/></Protected>} />
          <Route path="/proposition" element={<Protected><PropositionListView/></Protected>} />
          <Route path="/proposition/create" element={<Protected><PropositionCreatorView/></Protected>} />
          <Route path="/proposition/:propositionId" element={<Protected><PropositionDetailsView/></Protected>} />
          <Route path="/register" element={<Protected><RegisterUserView /></Protected>} />
          <Route path="/users" element={<Protected><UsersView /></Protected>} />
        </Routes>
      </BrowserRouter>
  );
}