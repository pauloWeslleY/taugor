import styles from './header.module.css';
import Logo from '../../../assets/logo-taugor.png';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {

  const { pathname } = useLocation();

  return (
    <header className={styles.header}>
      <img src={Logo} alt='Logo da empresa' />
      <nav className={styles.nav}>
        {pathname !== "/home" &&
          <Link to={"/home"}>
            Voltar
          </Link>
        }
        {pathname === "/home" &&
          <Link to={"/register"}>
            Cadastros
          </Link>
        }
      </nav>
    </header>
  )
}