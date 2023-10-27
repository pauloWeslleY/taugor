import styles from './home.module.css';
import Header from "../../components/interface/header";
import { useState } from 'react';
import { Title } from '../../components/ui/title';
import { ButtonLocation } from '../../components/ui/buttons/buttonLocation';

type Localization = "active" | "disabled";

export default function Home() {

  const [localization, setLocalization] = useState<Localization>("active");

  return (
    <>
      <Header />
      <main>
        <Title title="Funcionários" />
        <section className={styles.headerButtons}>
          <ButtonLocation
            loading={false}
            active={localization === "active"}
            onClick={() => setLocalization("active")}
          >
            Funcionários Ativos
          </ButtonLocation>
          <ButtonLocation
            loading={false}
            active={localization === "disabled"}
            onClick={() => setLocalization("disabled")}
          >
            Funcionários Inativos
          </ButtonLocation>
        </section>
      </main>
    </>
  );
};