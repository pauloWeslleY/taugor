import { Routes, Route } from "react-router-dom";

import Login from "../pages/login";
import NotFound from "../pages/notFound";
import Home from "../pages/home";
import PrivateRoutes from "./private";
import Register from "../pages/register";
import DetailEmploye from "../pages/detail";
import SignUp from "../pages/signUp";

export default function RoutesApp() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/singup" element={<SignUp />} />

      <Route
        path="/home"
        element={
          <PrivateRoutes>
            <Home />
          </PrivateRoutes>
        }
      />
      <Route
        path="/register"
        element={
          <PrivateRoutes>
            <Register />
          </PrivateRoutes>
        }
      />
      <Route
        path="/detail/:id"
        element={
          <PrivateRoutes>
            <DetailEmploye />
          </PrivateRoutes>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
