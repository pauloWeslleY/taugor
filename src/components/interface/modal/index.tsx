import { ReactNode, useRef } from 'react';
import styles from './modal.module.css';
import { icons } from '../../../config/icons';

interface ModalProps {
  children: ReactNode,
  handleClose: () => void
  title: string
}
//handleClose é uma função que fecha o modal e limpa os campos
export function Modal({ children, handleClose, title }: ModalProps) {

  const containerRef = useRef<HTMLElement | null>(null);

  function handleClick(e: any) {
    if (e.target === containerRef.current) {
      handleClose()
    }
  }

  return (
    <main
      className={styles.container}
      ref={containerRef}
      onClick={(e) => handleClick(e)}
    >
      <section className={styles.modal}>
        <section className={styles.headerModal}>
          <h1>{title}</h1>
          <button
            className={styles.buttonCloseModal}
            onClick={handleClose}
          >
            {icons.close}
          </button>
        </section>
        {children}
      </section>
    </main >
  )
}