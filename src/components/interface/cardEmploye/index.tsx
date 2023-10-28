import styles from "./cardEmploye.module.css";
import { icons } from "../../../config/icons";
import { Link } from "react-router-dom";

import AvatarGirl from "../../../assets/avatar-feminino.png";
import AvatarBoy from "../../../assets/avatar-masculino.png";

export function CardEmploye({ employe }: any) {
  return (
    <section key={employe?.key} className={styles.cardEmploye}>
      {employe?.sex === "masculine" ? (
        <img src={AvatarBoy} alt="Foto de Perfil" />
      ) : (
        <img src={AvatarGirl} alt="Foto de Perfil" />
      )}
      <section className={styles.infoCardEmploye}>
        <section
          className={
            employe?.status === "active"
              ? styles.areaHeaderCardEmployeActive
              : styles.areaHeaderCardEmployeInactive
          }
        >
          <span>{icons.circle}</span>
          <p>{employe?.status === "active" ? "Ativo" : "Inativo"}</p>
        </section>
        <section className={styles.cardInfoGrid}>
          <p>
            <strong>Nome:</strong>
            <span>{employe?.name}</span>
          </p>
          <p>
            <strong>email:</strong>
            <span>{employe?.email}</span>
          </p>
          <p>
            <strong>CPF:</strong>
            <span>{employe?.cpf}</span>
          </p>
          <p>
            <strong>Tel:</strong>
            <span>{employe?.tel}</span>
          </p>
          <p>
            <strong>Setor:</strong>
            <span>{employe?.sector}</span>
          </p>
          <p>
            <strong>Cargo:</strong>
            <span>{employe?.role}</span>
          </p>
          <p>
            <strong>Admissão:</strong>
            <span>{employe?.dateAdmission}</span>
          </p>
          <Link to={"/"} className={styles.detailLink}>
            <span>{icons.plus}</span> Detalhes
          </Link>
        </section>
      </section>
    </section>
  );
}
