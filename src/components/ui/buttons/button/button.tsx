import styles from './button.module.css';
import { ButtonHTMLAttributes, ReactNode } from "react";
import { icons } from "../../../../config/icons";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading: boolean
  disabled: boolean
  children: ReactNode
}

export function Button({ loading, disabled, children, ...rest }: ButtonProps) {

  return (
    <button
      className={styles.button}
      disabled={disabled || loading}
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