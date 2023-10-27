import styles from './buttonLocation.module.css';
import { ButtonHTMLAttributes, ReactNode } from "react";
import { icons } from "../../../../config/icons";

interface ButtonLocationProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading: boolean
  children: ReactNode
  active: boolean
}

export function ButtonLocation({ loading, active, children, ...rest }: ButtonLocationProps) {

  return (
    <button
      className={active ? styles.buttonLocationActive : styles.buttonLocation}
      {...rest}
    >
      {loading ? (
        <span className={styles.spiner}>{icons.loading}</span>
      ) : (
        children
      )}
    </button>
  )
}