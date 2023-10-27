import styles from './title.module.css';

export function Title({ title }: { title: string }) {

  return (
    <section className={styles.areaTitle}>
      <h1>{title}</h1>
    </section>
  )
}