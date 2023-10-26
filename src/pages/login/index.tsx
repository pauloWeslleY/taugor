import styles from './login.module.css';

import Logo from '../../assets/logo-taugor.png';
import { Button } from '../../components/ui/button/button';
import { Input } from '../../components/ui/input/input';

export default function Login() {

  return (
    <section className={styles.container}>
      <img src={Logo} alt='Logo da empresa' />
      <form className={styles.formLogin}>
        <label>
          email:
          <Input placeholder='Digite seu email' type='text' />
        </label>
        <label>
          senha:
          <Input placeholder='Digite sua senha' type='password' />
        </label>

        <Button
          loading={false}
          disabled={false}
        >
          Fazer Login
        </Button>
      </form>
    </section>
  )
}