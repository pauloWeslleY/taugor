import styles from "./home.module.css";
import Header from "../../components/interface/header";
import { useEffect, useState } from "react";
import { Title } from "../../components/ui/title";
import { ButtonLocation } from "../../components/ui/buttons/buttonLocation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";

import AvatarBoy from "../../assets/avatar-masculino.png";
import AvatarGirl from "../../assets/avatar-feminino.png";
import { icons } from "../../config/icons";
import { Link } from "react-router-dom";
import { CardEmploye } from "../../components/interface/cardEmploye";

type Localization = "active" | "disabled";

export default function Home() {
  const [localization, setLocalization] = useState<Localization>("active");
  const [listEmployes, setListEmployes] = useState<any>([]);

  useEffect(() => {
    async function loadEmployes() {
      try {
        const docRef = collection(db, "employes");

        const response = await getDocs(docRef);

        if (response) {
          let list: any = [];
          response.forEach((employe) => {
            list.push({
              uid: employe.id,
              name: employe.data().name,
              email: employe.data().email,
              cpf: employe.data().cpf,
              birth: employe.data().birth,
              address: employe.data().address,
              profileUrl: employe.data().profileUrl,
              role: employe.data().role,
              sector: employe.data().sector,
              sex: employe.data().sex,
              status: employe.data().status,
              tel: employe.data().tel,
              wage: employe.data().wage,
              dateAdmission: employe.data().dateAdmission,
            });
          });
          setListEmployes(list);
        }
      } catch (error) {}
    }
    loadEmployes();
  }, []);

  console.log(listEmployes);

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
        {localization === "active" && (
          <section className={styles.containerCardEmploye}>
            {listEmployes.map((employe: any) => (
              <CardEmploye employe={employe} />
            ))}
          </section>
        )}
      </main>
    </>
  );
}
