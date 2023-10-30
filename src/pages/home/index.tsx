import styles from "./home.module.css";
import Header from "../../components/interface/header";
import { useContext, useState } from "react";
import { Title } from "../../components/ui/title";
import { ButtonLocation } from "../../components/ui/buttons/buttonLocation";

import { CardEmploye } from "../../components/interface/cardEmploye";
import {
  EmployerContext,
  ListDataEmploye,
} from "../../contexts/employerContext";
import { Link } from "react-router-dom";

type Localization = "active" | "disabled";

export default function Home() {
  const [localization, setLocalization] = useState<Localization>("active");
  const { listEmployes, loadingEmployes } = useContext(EmployerContext);

  const listEmployeInactive: ListDataEmploye = listEmployes.filter(
    (employe) => employe?.status !== "active"
  );
  const listEmployeActive: ListDataEmploye = listEmployes.filter(
    (employe) => employe?.status === "active"
  );

  if (loadingEmployes) {
    return (
      <>
        <Header />
        <main>
          <Title title="Carregando..." />
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main>
        <Title title="Funcionários" />
        {listEmployes.length > 0 ? (
          <>
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
            {localization === "active" && (
              <section className={styles.containerCardEmploye}>
                {listEmployeActive.length === 0 && (
                  <section className={styles.areaLinkNewEmploye}>
                    <h2>Nenhum Funcionário Ativo</h2>
                    <Link to={"/register"}>Cadastrar um funcionário</Link>
                  </section>
                )}
                {listEmployeActive.map((employe) => (
                  <section key={employe?.id}>
                    <CardEmploye employe={employe} />
                  </section>
                ))}
              </section>
            )}
            {localization === "disabled" && (
              <section className={styles.containerCardEmploye}>
                {listEmployeInactive.map((employe) => (
                  <section key={employe.id}>
                    <CardEmploye employe={employe} />
                  </section>
                ))}
              </section>
            )}
          </>
        ) : (
          <section className={styles.areaInfoNotEmploye}>
            <h2>Nenhum funcionário cadastrado!</h2>
            <Link to={"/register"}>Cadastrar um funcionário</Link>
          </section>
        )}
      </main>
    </>
  );
}
