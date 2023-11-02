import { useAppSelector } from "../../../_hooks/redux_hooks";
import { selectMidTermForcast } from "../../../_reducers/midTermForcastReducer";
import { selectThreeDaysForcast } from "../../../_reducers/weatherReducer";
import ShortTermForcastWrapper from "./ShortTermForcastWrapper";
import WeeklyForcastItem from "./WeeklyForacstItem";
import Card from "../../ui/card/Card";
import styles from "./WeeklyForcast.module.css";

const WeeklyForcast = () => {
  const weeklyForcast = useAppSelector(selectMidTermForcast);
  const threeDaysForcast = useAppSelector(selectThreeDaysForcast);
  return (
    <Card className={styles.weeklyForcast} title="주간 예보">
      <ul className={styles.forcastUL}>
        {threeDaysForcast.map((stForcast, idx) => {
          return <ShortTermForcastWrapper stForcast={stForcast} key={idx} />;
        })}
        {weeklyForcast.map((mtforcast, idx) => {
          return <WeeklyForcastItem key={idx} mtForcast={mtforcast} />;
        })}
      </ul>
    </Card>
  );
};

export default WeeklyForcast;
