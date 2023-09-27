import Card from "../../ui/card/Card";
import styles from "./TodayForcastItem.module.css";

const Loading = () => {
  return (
    <Card body={TodayForcastItemSkeleton} footer={TodayForcastBagesSkeleton} />
  );
};

const TodayForcastItemSkeleton = (
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

const TodayForcastBagesSkeleton = (
  <div className={styles.skeletonBadges}>
    {...Array.from({ length: 5 }, (_, index) => (
      <div
        key={index}
        className={`${styles.skeleton} ${styles.skeletonBadge}`}
      ></div>
    ))}
  </div>
);

export default Loading;
