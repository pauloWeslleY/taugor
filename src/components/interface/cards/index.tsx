import styles from './cards.module.css';
import { icons } from "../../../config/icons";
import { CardList } from "../../types/RolesOrSector";

interface CardsProps {
  list: CardList,
  edit: any
}

export function Cards({ list, edit }: CardsProps) {

  return (
    <section className={styles.containerCards}>
      {list.map((item) => (
        <section key={item.id} className={styles.card}>
          <p>{item.name}</p>
          <button
            onClick={() => edit(item.id)}
          >
            {icons.edit}
          </button>
        </section>
      ))}
    </section>
  )

}