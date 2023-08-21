import { useAppSelector } from "../../../_hooks/redux_hooks";
import { selectMidTermForcast } from "../../../_reducers/midTermForcastReducer";
import styles from "./WeeklyForcast.module.css";
import { selectThreeDaysForcast } from "../../../_reducers/weatherReducer";
import WeeklyForcastItem from "./WeeklyForacstItem";
import ShortTermForcastWrapper from "./ShortTermForcastWrapper";
import WeeklyForcastLoading from "./Loading";

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
            {weeklyForcast.length > 0 && threeDaysForcast.length > 0 &&
              threeDaysForcast.map((stForcast, idx) => {
                return (
                  <ShortTermForcastWrapper stForcast={stForcast} key={idx} />
                );
              })}
            {weeklyForcast.length > 0 && threeDaysForcast.length > 0 &&
              weeklyForcast.map((mtforcast, idx) => {
                return <WeeklyForcastItem key={idx} mtForcast={mtforcast} />;
              })}
            {(threeDaysForcast.length === 0 || weeklyForcast.length === 0) && (
              <WeeklyForcastLoading />
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

const renderForcastItem = () => {};

export default WeeklyForcast;
