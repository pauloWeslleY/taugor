import styles from './input.module.css';
import { Dispatch, InputHTMLAttributes, SetStateAction } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  setValue: Dispatch<SetStateAction<string>>
}

export function Input({ setValue, ...rest }: InputProps) {

  return (
    <input
      className={styles.input}
      onChange={(e) => setValue(e.target.value)}
      {...rest}
    />
  )
}