import { ReactNode, createContext, useState } from "react";

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../services/firebaseConnection";
import { toast } from "react-toastify";

interface AuthContextProps {
  isAuthenticated: boolean
  signIn: (credential: SignInProps) => Promise<void>
}

interface SignInProps {
  email: string,
  password: string
}

export const AuthContext = createContext({} as AuthContextProps);

export default function AuthProvider({ children }: { children: ReactNode }) {

  const [user, setUser] = useState(null)

  async function signIn({ email, password }: SignInProps) {

    try {

      const response = await signInWithEmailAndPassword(auth, email, password);

      const user = {
        email,
      }

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
      console.log(error)
    }

  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        signIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}