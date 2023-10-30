import styles from "./login.module.css";
import { FormEvent, useContext, useEffect, useState } from "react";

import Logo from "../../assets/logo-taugor.png";
import { Button } from "../../components/ui/buttons/button/button";
import { Input } from "../../components/ui/input/input";
import { AuthContext } from "../../contexts/authContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [loading, setLoading] = useState<boolean>(false);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { signIn, isAuthenticated } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    function handleRedirectUser() {
      if (isAuthenticated) {
        navigate("/home");
      }
    }
    handleRedirectUser();
  }, [isAuthenticated]);

  async function handleSubmit(e: FormEvent) {
    if (email === "" || password == "" || password.length < 6) {
      toast.error("Preencha os campos corretamente");
      return;
    }

    e.preventDefault();
    setLoading(true);

    await signIn({ email, password });

    setEmail("");
    setPassword("");

    setLoading(false);
  }

  return (
    <section className={styles.container}>
      <img src={Logo} alt="Logo da empresa" />
      <form className={styles.formLogin} onSubmit={handleSubmit}>
        <label>
          email:
          <Input
            placeholder="Digite seu email"
            type="email"
            value={email}
            setValue={setEmail}
          />
        </label>
        <label>
          senha:
          <Input
            placeholder="Digite sua senha"
            type="password"
            value={password}
            setValue={setPassword}
          />
        </label>

        <Button
          loading={loading}
          disabled={email === "" || password === "" || password.length < 6}
          type="submit"
        >
          Fazer Login
        </Button>
      </form>
    </section>
  );
}
