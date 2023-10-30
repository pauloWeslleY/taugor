import styles from "./detail.module.css";
import { useContext, useEffect, useState } from "react";
import {
  DataEmploye,
  EmployerContext,
  ListDataEmploye,
} from "../../contexts/employerContext";
import { useParams } from "react-router-dom";

import AvatarGirl from "../../assets/avatar-feminino.png";
import AvatarBoy from "../../assets/avatar-masculino.png";
import Header from "../../components/interface/header";
import { Button } from "../../components/ui/buttons/button/button";
import { icons } from "../../config/icons";
import { handleRenderRoleOrSector } from "../../utils";
import { ModalEdit } from "./modules/modalEdit";

export default function DetailEmploye() {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [employe, setEmploye] = useState<DataEmploye | null>(null);
  const { listEmployes, listRoles, listSectors } = useContext(EmployerContext);
  const { id } = useParams();

  // pegando funcionario selecionado
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

  const {
    name,
    profileUrl,
    created_at,
    sex,
    birth,
    cpf,
    email,
    tel,
    address,
    role,
    sector,
    dateAdmission,
    wage,
  } = employe!;

  console.log(created_at);

  return (
    <>
      <Header />
      <main className={styles.container}>
        <section className={styles.containerDataEmploye}>
          <section className={styles.dataEmploye}>
            <section className={styles.profileEmploye}>
              {profileUrl ? (
                <img src={profileUrl} alt="Foto de perfil" />
              ) : (
                <img
                  src={sex === "masculine" ? AvatarBoy : AvatarGirl}
                  alt="Foto de perfil"
                />
              )}
              <section className={styles.infoEmploye}>
                <h2>Informações de Contato</h2>
                <section className={styles.gridDetailUser}>
                  <p>
                    <strong>Nome: </strong>{" "}
                    <span className={styles.info}>{name}</span>
                  </p>
                  <p>
                    <strong>CPF: </strong>{" "}
                    <span className={styles.info}>{cpf}</span>
                  </p>
                  <p>
                    <strong>Email: </strong>{" "}
                    <span className={styles.info}>{email}</span>
                  </p>
                  <p>
                    <strong>Tel: </strong>{" "}
                    <span className={styles.info}>{tel}</span>
                  </p>
                  <p>
                    <strong>Sexo: </strong>{" "}
                    <span className={styles.info}>{sex}</span>
                  </p>
                  <p>
                    <strong>Data de Nascimento: </strong>{" "}
                    <span className={styles.info}>{birth}</span>
                  </p>
                </section>
                <p>
                  <strong>Endereço: </strong>{" "}
                  <span className={styles.info}>{address}</span>
                </p>
              </section>
            </section>
            <section className={styles.infoEmploye}>
              <h2>Informações do Funcionário</h2>
              <section className={styles.detailEmploye}>
                <p>
                  <strong>Cargo: </strong>
                  <span className={styles.info}>
                    {handleRenderRoleOrSector({ id: role, list: listRoles })}
                  </span>
                </p>
                <p>
                  <strong>Setor: </strong>
                  <span className={styles.info}>
                    {handleRenderRoleOrSector({
                      id: sector,
                      list: listSectors,
                    })}
                  </span>
                </p>
                <p>
                  <strong>Data de Admissão: </strong>{" "}
                  <span className={styles.info}>{dateAdmission}</span>
                </p>
                <p>
                  <strong>Salário: </strong>{" "}
                  <span className={styles.info}>{wage}</span>
                </p>
              </section>
            </section>
          </section>
        </section>
        <section className={styles.areaButtons}>
          <Button
            loading={false}
            disabled={false}
            style={{
              maxWidth: 130,
            }}
          >
            Ver Histórico
          </Button>
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
      </main>
    </>
  );
}
