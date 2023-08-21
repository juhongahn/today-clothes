import styles from "./Loading.module.css";

const WeeklyForcastLoading = () => {
  return (
    <>
      {...Array.from({ length: 12 }, (_, index) => (
        <div key={index} className={styles.skeleton}>
        </div>
      ))}
    </>
  );
};

export default WeeklyForcastLoading;
