import styles from "./home.module.css";
import Header from "../../components/interface/header";
import { useContext, useState } from "react";
import { Title } from "../../components/ui/title";
import { ButtonLocation } from "../../components/ui/buttons/buttonLocation";

import { CardEmploye } from "../../components/interface/cardEmploye";
import {
  DataEmploye,
  EmployerContext,
  ListDataEmploye,
} from "../../contexts/employerContext";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../services/firebaseConnection";

type Localization = "active" | "disabled";

export default function Home() {
  const [localization, setLocalization] = useState<Localization>("active");
  const { listEmployes, loadingEmployes, setListEmployes } = useContext(EmployerContext);

  const listEmployeInactive: ListDataEmploye = listEmployes.filter(
    (employe) => employe?.status !== "active"
  );
  const listEmployeActive: ListDataEmploye = listEmployes.filter(
    (employe) => employe?.status === "active"
  );

  async function handleDeletEmploye(employe: DataEmploye) {
    const { id, status } = employe;
    if (status === "active") {
      toast.error("Para detelar um funcionário ele tem que estár inativo!");
      return;
    }

    try {
      const docRef = doc(db, "employes", id!);
      const historyRef = collection(docRef, "history");
      const historyDocsQuery = query(historyRef);
      const historyDocsSnapshot = await getDocs(historyDocsQuery);

      historyDocsSnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      await updateDoc(docRef, {
        history: deleteField(),
      });

      const response = await deleteDoc(docRef);

      const newListEmployes = listEmployes.filter(
        (dataEmploye) => dataEmploye.id !== employe.id
      );

        setListEmployes(newListEmployes)

      toast.success("Funcionário excluído com sucesso!");
    } catch (error) {
      toast.error("Erro o deletar funcionário!");
    }
  }

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
                  <CardEmploye employe={employe} key={employe?.id} />
                ))}
              </section>
            )}
            {localization === "disabled" && (
              <section className={styles.containerCardEmploye}>
                {listEmployeInactive.map((employe) => (
                  <CardEmploye
                    employe={employe}
                    key={employe?.id}
                    handleDelete={handleDeletEmploye}
                  />
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
