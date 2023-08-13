import styles from "./CurrentWeatherItem.module.css";

const Loading = () => {
  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <div
          className={`${styles.graphic} ${styles.skeletonImg} ${styles.skeleton}`}
        ></div>
        <div className={`${styles.forcasts} ${styles.skeletonForcasts}`}>
          <p className={`${styles.skeletonText} ${styles.skeleton}`}></p>
          <p className={`${styles.skeletonText} ${styles.skeleton}`}></p>
          <p className={`${styles.skeletonText} ${styles.skeleton}`}></p>
        </div>
      </div>
      <div className={`${styles.description} ${styles.skeletonDescription}`}>
        <p className={`${styles.skeletonDate} ${styles.skeleton}`}></p>
        <p className={`${styles.skeletonDes} ${styles.skeleton}`}></p>
        <p className={`${styles.skeletonDate} ${styles.skeleton}`}></p>
      </div>
    </div>
  );
};

export default Loading;
