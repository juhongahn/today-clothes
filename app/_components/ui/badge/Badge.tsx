import styles from "./Badge.module.css";

interface Props {
  title: string;
  value: string;
  grade: string;
}

const ValueMap = {
  좋음: "good",
  보통: "normal",
  나쁨: "caution",
  매우나쁨: "bad",
  위험: "bad",
  일출: "sunrise",
  일몰: "sunset",
};

const Badge = ({ title, value, grade }: Props) => {
  return (
    <div className={`${styles.badge} ${styles[ValueMap[grade]]}`}>
      <p className={styles.label}>{title}</p>
      <p className={styles.value}> {value}</p>
    </div>
  );
};

export default Badge;
