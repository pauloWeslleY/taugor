import styles from './input.module.css';
import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> { }

export function Input({ ...rest }: InputProps) {

  return (
    <input {...rest} className={styles.input} />
  )
}