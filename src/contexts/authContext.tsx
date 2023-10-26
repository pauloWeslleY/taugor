import { ReactNode, createContext, useEffect, useState } from "react";

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../services/firebaseConnection";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface AuthContextProps {
  isAuthenticated: boolean
  loading: boolean
  signIn: (credential: SignInProps) => Promise<void>
}

interface SignInProps {
  email: string,
  password: string
}

interface UserProps {
  email: string
}

export const AuthContext = createContext({} as AuthContextProps);

export default function AuthProvider({ children }: { children: ReactNode }) {

  const [user, setUser] = useState<UserProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const localStorageKey = "taugorUser"

  useEffect(() => {

    async function userAuth() {
      // verificando se o usuário já está logado

      const storageUserLocal = localStorage.getItem(localStorageKey)
      if (storageUserLocal) {
        //caso tenha usuário logado irei redirecionar para a página home
        setUser(JSON.parse(storageUserLocal))
        navigate("/home")

        setLoading(false)
        return;
      }
      setLoading(false)
      setUser(null);
    }

    userAuth()

  }, [])

  async function signIn({ email, password }: SignInProps) {

    try {
      const response = await signInWithEmailAndPassword(auth, email, password);

      const userData = {
        email,
      }
      storageUser(userData);
      setUser(userData);
      navigate("/home");


    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        //usuário não cadastrado
        toast.error("Usuário não encontrado!")
        return
      }
      if (error.code === "auth/wrong-password") {
        //usuário digitou a senha errada
        toast.error("Senha incorreta!")
        return
      }
    }
  }

  async function storageUser(data: UserProps) {
    localStorage.setItem(localStorageKey, JSON.stringify(data))
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        loading,
        signIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}