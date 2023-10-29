import styles from "./cards.module.css";
import { icons } from "../../../config/icons";
import {
  ListRolesOrSectors,
  RolesOrSectors,
} from "../../../contexts/employerContext";

interface CardsProps {
  list: ListRolesOrSectors;
  edit: (item: RolesOrSectors) => Promise<void>;
}

export function Cards({ list, edit }: CardsProps) {
  return (
    <section className={styles.containerCards}>
      {list.map((item) => (
        <section key={item.id} className={styles.card}>
          <p>{item.name}</p>
          <button onClick={() => edit(item)}>{icons.edit}</button>
        </section>
      ))}
    </section>
  );
}
