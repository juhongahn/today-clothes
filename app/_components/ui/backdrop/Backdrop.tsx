import styles from "./Backdrop.module.css";

type BackDropType = {
  children?: React.ReactNode;
  modalHandler: () => void;
};

export default function Backdrop({
  children,
  modalHandler,
}: BackDropType) {
  return (
    <div className={styles.backdrop} onClick={modalHandler}>
      {children}
    </div>
  );
}