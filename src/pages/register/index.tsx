import styles from './register.module.css';
import { useState } from "react";
import Header from "../../components/interface/header";
import { Title } from "../../components/ui/title";
import { ButtonLocation } from "../../components/ui/buttons/buttonLocation";
import { Roles } from './modules/roles';
import { Sectors } from './modules/sectors';
import { NewEmployer } from './modules/newEmploye';

type Localization = "employe" | "role" | "sector";

export default function Register() {
  const [localization, setLocalization] = useState<Localization>("employe")

  return (
    <>
      <Header />
      <main>
        <Title title="Cadastrar" />
        <section className={styles.areaButtonLocalization}>
          <ButtonLocation
            active={localization === "employe"}
            loading={false}
            onClick={() => setLocalization("employe")}
          >
            Funcionários
          </ButtonLocation>
          <ButtonLocation
            active={localization === "role"}
            loading={false}
            onClick={() => setLocalization("role")}
          >
            Cargos
          </ButtonLocation>
          <ButtonLocation
            active={localization === "sector"}
            loading={false}
            onClick={() => setLocalization("sector")}
          >
            Setores
          </ButtonLocation>
        </section>

        {localization === "role" && (<Roles />)}
        {localization === "sector" && (<Sectors />)}
        {localization === "employe" && (<NewEmployer />)}

      </main>
    </>
  )
}