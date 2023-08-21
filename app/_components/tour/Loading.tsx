import styles from "./Loading.module.css";

const TourCardLoading = () => {
  return (
    <div className={styles.loading}>
      <div className={`${styles.graphic} ${styles.skeleton}`}>
        
      </div>
      <div className={styles.des}>
        <p className={`${styles.title} ${styles.skeleton}`}></p>
        <p className={`${styles.location} ${styles.skeleton}`}></p>
      </div>
    </div>
  );
};

export default TourCardLoading;
