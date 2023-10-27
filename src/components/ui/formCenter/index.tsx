import styles from './formCenter.module.css';
import { FormHTMLAttributes } from "react";

interface FormCenterProps extends FormHTMLAttributes<HTMLFormElement> {

}

export function FormCenter({ children }: FormCenterProps) {
  return (
    <form className={styles.form}>
      {children}
    </form>
  )
}