import styles from "./cardDetail.module.css";
import {
  DataEmploye,
  EmployerContext,
} from "../../../contexts/employerContext";

import AvatarGirl from "../../../assets/avatar-feminino.png";
import AvatarBoy from "../../../assets/avatar-masculino.png";
import { handleRenderRoleOrSector } from "../../../utils";
import { useContext } from "react";
import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";

interface CardDetailEmplyeProps {
  data: DataEmploye;
  action: "profile" | "history";
}

export function CardDetailEmploye({ data, action }: CardDetailEmplyeProps) {
  const { listSectors, listRoles } = useContext(EmployerContext);

  function formatDate(date: Timestamp | Date | undefined) {
    if (date) {
      let newDate: Date;

      if (date instanceof Date) {
        newDate = date;
      } else {
        const firestoreTimestamp = {
          seconds: date.seconds,
          nanoseconds: date.nanoseconds,
        };
        newDate = new Date(
          firestoreTimestamp.seconds * 1000 +
            firestoreTimestamp.nanoseconds / 1000000
        );
      }
      const formatDate = format(newDate, "dd/MM/yyyy");
      return formatDate;
    }
    return `teste`;
  }

  return (
    <section className={styles.container}>
      <section className={styles.headerCard}>
        {data?.profileUrl ? (
          <img src={data?.profileUrl} alt="Foto De perfil" />
        ) : (
          <img
            src={data?.sex === "masculine" ? AvatarBoy : AvatarGirl}
            alt="Foto de perfil"
          />
        )}

        <section className={styles.infoHeaderCard}>
          <section className={styles.headerTitle}>
            <h2>Informações de Contato</h2>
            {action === "profile" ? (
              <p>Atualizado em: {formatDate(data?.created_at)}</p>
            ) : (
              <p>Histórico editado em: {formatDate(data?.created_at)}</p>
            )}
          </section>
          <section className={styles.areaInfo}>
            <div className={styles.info}>
              <p>Nome:</p>
              <p className={styles.data}>{data?.name}</p>
            </div>
            <div className={styles.info}>
              <p>Email:</p>
              <p className={styles.data}>{data?.email}</p>
            </div>
            <div className={styles.info}>
              <p>CPF:</p>
              <p className={styles.data}>{data?.cpf}</p>
            </div>
            <div className={styles.info}>
              <p>Tel:</p>
              <p className={styles.data}>{data?.tel}</p>
            </div>
            <div className={styles.info}>
              <p>Sexo:</p>
              <p className={styles.data}>
                {data?.sex === "masculine" ? "MASCULINO" : "FEMININO"}
              </p>
            </div>
            <div className={styles.info}>
              <p>Data de Nascimento:</p>
              <p className={styles.data}>
                {format(new Date(data?.birth), "dd/MM/yyyy")}
              </p>
            </div>
          </section>
          <div className={styles.info}>
            <p>Endereço:</p>
            <p className={styles.data}>{data?.address}</p>
          </div>
        </section>
      </section>
      <section className={styles.infoFooterCard}>
        <h2>Informações do funcionário</h2>
        <section className={styles.areaInfoFooter}>
          <div className={styles.info}>
            <p>Cargo:</p>
            <p className={styles.data}>
              {handleRenderRoleOrSector({
                id: data?.role,
                list: listRoles,
              })}
            </p>
          </div>
          <div className={styles.info}>
            <p>Setor:</p>
            <p className={styles.data}>
              {handleRenderRoleOrSector({
                id: data?.sector,
                list: listSectors,
              })}
            </p>
          </div>
          <div className={styles.info}>
            <p>Salário:</p>
            <p className={styles.data}>R$: {data?.wage}</p>
          </div>
          <div className={styles.info}>
            <p>Data de Admissão:</p>
            <p className={styles.data}>
              {format(new Date(data?.dateAdmission), "dd/MM/yyyy")}
            </p>
          </div>
          <div className={styles.info}>
            <p>Status:</p>
            <p
              className={
                data?.status === "active" ? styles.statusActive : styles.status
              }
            >
              {data?.status === "active" && "ATIVO"}
              {data?.status === "fired" && "DEMITIDO"}
              {data?.status === "end_of_contract" && "CONTRATO FINALIZADO"}
            </p>
          </div>
        </section>
      </section>
    </section>
  );
}
