import Card from "../../ui/card/Card";
import styles from "./Loading.module.css";

const WeeklyForcastLoading = () => {
  return (
    <Card >
      <ul className={styles.skeletonUl}>
        {...Array.from({ length: 12 }, (_, index) => (
          <div key={index} className={styles.skeleton}></div>
        ))}
      </ul>
    </Card>
  );
};

export default WeeklyForcastLoading;
