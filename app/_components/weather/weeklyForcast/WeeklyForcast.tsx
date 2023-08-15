import { useAppSelector } from "../../../_hooks/redux_hooks";
import { selectMidTermForcast } from "../../../_reducers/midTermForcastReducer";
import styles from "./WeeklyForcast.module.css";
import { selectThreeDaysForcast } from "../../../_reducers/weatherReducer";
import WeeklyForcastItem from "./WeeklyForacstItem";
import ShortTermForcastWrapper from "./ShortTermForcastWrapper";

const WeeklyForcast = () => {
  const weeklyForcast = useAppSelector(selectMidTermForcast);
  const threeDaysForcast = useAppSelector(selectThreeDaysForcast);
  return (
    <div className={styles.weeklyForcast}>
      <div className={styles.header}>
        <h2>주간 예보</h2>
      </div>
      <div className={styles.body}>
        <div className={styles.weeklyList}>
          <ul className={styles.forcastUL}>
            {threeDaysForcast.map((stForcast, idx) => {
              return (
                <ShortTermForcastWrapper stForcast={stForcast} key={idx} />
              );
            })}
            {weeklyForcast &&
              weeklyForcast.map((mtforcast, idx) => {
                return <WeeklyForcastItem mtForcast={mtforcast} key={idx} />;
              })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WeeklyForcast;
