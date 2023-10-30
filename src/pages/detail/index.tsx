import styles from "./detail.module.css";
import { useContext, useEffect, useState } from "react";
import {
  DataEmploye,
  EmployerContext,
  ListDataEmploye,
} from "../../contexts/employerContext";
import { useParams } from "react-router-dom";

import Header from "../../components/interface/header";
import { Button } from "../../components/ui/buttons/button/button";
import { icons } from "../../config/icons";
import { ModalEdit } from "./modules/modalEdit";
import { HistoryEmploye } from "./modules/history";
import { CardDetailEmploye } from "../../components/interface/cardDetailEmploye";

export default function DetailEmploye() {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [employe, setEmploye] = useState<DataEmploye | null>(null);
  const [historyVisible, setHistoryVisible] = useState<boolean>(false);
  const { listEmployes } = useContext(EmployerContext);
  const { id } = useParams();

  useEffect(() => {
    const listEmployeSelected: ListDataEmploye = listEmployes.filter(
      (employe) => employe.id === id
    );
    const employeSelected: DataEmploye = listEmployeSelected[0];
    setEmploye(employeSelected);
  }, [listEmployes]);

  if (!employe) {
    return <div></div>;
  }

  return (
    <>
      <Header />
      <main className={styles.container}>
        <CardDetailEmploye data={employe} action="profile" />
        <section className={styles.areaButtons}>
          {!historyVisible && (
            <Button
              loading={false}
              disabled={false}
              onClick={() => setHistoryVisible(true)}
              style={{
                maxWidth: 130,
              }}
            >
              Ver Histórico
            </Button>
          )}
          <button
            className={styles.buttonEdit}
            type="button"
            onClick={() => setModalVisible(true)}
          >
            Aterar Dados <span>{icons.edit}</span>
          </button>
        </section>

        {modalVisible && (
          <ModalEdit
            setValue={setModalVisible}
            currentDataEmploye={employe}
            setEmploye={setEmploye}
          />
        )}
        {historyVisible && <HistoryEmploye />}
      </main>
    </>
  );
}
