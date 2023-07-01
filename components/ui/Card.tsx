import styles from "./Card.module.css";

type Props = {
  children?: React.ReactNode;
  style?: React.CSSProperties;
};

const Card = ({ children, style }: Props) => {
  return <div className={styles.card}>{children}</div>;
};

export default Card;
