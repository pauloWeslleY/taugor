import { ReactNode, createContext, useEffect, useState } from "react";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../services/firebaseConnection";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface AuthContextProps {
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (credential: SignInProps) => Promise<void>;
  signUp: (credential: SignInProps) => Promise<void>;
  logOutUser: () => Promise<void>;
}

interface SignInProps {
  email: string;
  password: string;
}

interface UserProps {
  email: string;
}

export const AuthContext = createContext({} as AuthContextProps);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const localStorageKey = "taugorUser";

  useEffect(() => {
    async function userAuth() {
      const storageUserLocal = localStorage.getItem(localStorageKey);
      if (storageUserLocal) {
        setUser(JSON.parse(storageUserLocal));
        setLoading(false);
        return;
      }
      setLoading(false);
      setUser(null);
    }

    userAuth();
  }, []);

  async function signIn({ email, password }: SignInProps) {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      const userData = {
        email,
      };
      storageUser(userData);
      setUser(userData);
      navigate("/home");
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        toast.error("Usuário não encontrado!");
        return;
      }
      if (error.code === "auth/wrong-password") {
        toast.error("Senha incorreta!");
        return;
      }
    }
  }

  async function signUp({ email, password }: SignInProps) {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userData = {
        email,
      };
      storageUser(userData);
      setUser(userData);
      navigate("/home");
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("Este email já está sendo utilizado!");
        return;
      }
      toast.error("Erro ao cadastrar!");
    }
  }

  async function storageUser(data: UserProps) {
    localStorage.setItem(localStorageKey, JSON.stringify(data));
  }

  async function logOutUser() {
    try {
      await signOut(auth);
      localStorage.removeItem(localStorageKey);
      setUser(null);
    } catch (error) {
      toast.error("Erro ao deslogar usuário");
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        loading,
        signIn,
        logOutUser,
        signUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
