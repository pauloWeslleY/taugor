import styles from "./header.module.css";
import { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import Logo from "../../../assets/logo-taugor.png";
import { Button } from "../../ui/buttons/button/button";
import { icons } from "../../../config/icons";
import { AuthContext } from "../../../contexts/authContext";

export default function Header() {
  const { pathname } = useLocation();
  const { logOutUser } = useContext(AuthContext);

  const [loading, setLoading] = useState<boolean>(false);

  async function handleLogOut() {
    setLoading(true);
    await logOutUser();
    setLoading(false);
  }

  return (
    <header className={styles.header}>
      <img src={Logo} alt="Logo da empresa" />
      <nav className={styles.nav}>
        {pathname !== "/home" && <Link to={"/home"}>Voltar</Link>}
        {pathname === "/home" && <Link to={"/register"}>Cadastros</Link>}
        <Button
          type="button"
          loading={loading}
          disabled={false}
          onClick={handleLogOut}
        >
          {icons.logout}
        </Button>
      </nav>
    </header>
  );
}
