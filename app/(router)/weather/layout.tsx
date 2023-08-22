import styles from "./WeatherLayout.module.css";

const WeatherLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles.layout}>
      <div className={styles.container}>{children}</div>
    </div>
  );
};

export default WeatherLayout;
