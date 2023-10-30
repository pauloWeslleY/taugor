import { ReactNode, useContext } from "react";
import { AuthContext } from "../contexts/authContext";
import { Navigate } from "react-router-dom";

export default function PrivateRoutes({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return <div></div>
  }

  return !isAuthenticated ? (<Navigate to="/" />) : (children)
}