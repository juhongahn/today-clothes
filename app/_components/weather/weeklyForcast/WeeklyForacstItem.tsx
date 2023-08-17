import Image from "next/image";
import { MidTermForcast } from "../../../api/mid-term-forcast/route";
import styles from "./WeeklyForcast.module.css";

interface WeeklyForcastItemProps {
  mtForcast: MidTermForcast;
}

const WeeklyForcastItem = ({ mtForcast }: WeeklyForcastItemProps) => {
  const amImgProps = getImageSource(mtForcast.fcst.weatherForcast.wfAM);
  const pmImgProps = getImageSource(mtForcast.fcst.weatherForcast.wfPM);
  return (
    <li className={styles.weekItem}>
      <div className={`${styles.fcstDate} ${styles.contents}`}>{renderDate(mtForcast.dt)}</div>
      <div className={`${styles.fcst} ${styles.contents}`}>
        <div className={styles.time}>
          <div className={styles.pop}>
            <p className={styles.label}>오전</p>
            <p className={styles.popvalue}>{mtForcast.fcst.pop.popAM}%</p>
          </div>
          <div className={styles.graphic}>
            <Image width={35} height={35} {...amImgProps} priority />
          </div>
        </div>
        <div className={styles.time}>
          <div className={styles.pop}>
            <p className={styles.label}>오후</p>
            <p className={styles.popvalue}>{mtForcast.fcst.pop.popPM}%</p>
          </div>
          <div className={styles.graphic}>
            <Image width={35} height={35} {...pmImgProps} priority />
          </div>
        </div>
      </div>
      <div className={`${styles.hltemp} ${styles.contents}`}>
        <p>
          <span className={styles.lowT}>{mtForcast.hlTemperature.tmn}°</span>
          <span className={styles.slash}>/ </span>
          <span className={styles.hotT}>{mtForcast.hlTemperature.tmx}°</span>
        </p>
      </div>
    </li>
  );
};

export default WeeklyForcastItem;

/**
 * date: "20230815"
 */
const renderDate = (date: string) => {
  const dateStr = formatDate(date, false);
  const dateObject = new Date(dateStr);
  const monthNDate = formatDate(date, true);
  return (
    <>
      <p className={styles.day}>{getWeekdays(dateObject)}</p>
      <p className={styles.date}>{monthNDate}</p>
    </>
  );
};

function formatDate(inputDate: string, isRepresental: boolean) {
  const year = inputDate.substring(0, 4);
  const month = inputDate.substring(4, 6);
  const day = inputDate.substring(6, 8);

  if (isRepresental) return `${month}.${day}`;
  else return `${year}-${month}-${day}`;
}

function getWeekdays(date: Date) {
  const currentDate = new Date();
  const tommorwDate = new Date(currentDate.getDate() + 1);
  const dayAfterTommorwDate = new Date(tommorwDate.getDate() + 1);
  if (date.getDate() === currentDate.getDate()) return "오늘";
  else if (date.getDate() === tommorwDate.getDate()) return "내일";
  else if (date.getDate() === dayAfterTommorwDate.getDate()) return "모레";
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const dayIndex = date.getDay();
  return days[dayIndex];
}

const getImageSource = (
  wf: string
): {
  src: string;
  alt: string;
} => {
  let src = "";
  switch (wf) {
    case "맑음":
      src = "/statics/images/003-sunny.png";
      break;
    case "구름많음":
      src = "/statics/images/005-cloudy.png";
      break;
    case "흐림":
      src = "/statics/images/004-cloud.png";
      break;
    case "구름많고 비":
    case "흐리고 비":
    case "구름많고 소나기":
    case "흐리고 소나기":
      src = "/statics/images/002-rainy.png";
      break;
    case "구름많고 눈":
    case "흐리고 눈":
      src = "/statics/images/001-snow.png";
      break;
    case "흐리고 비/눈":
    case "구름많고 비/눈":
      src = "/statics/imagessnowrain.png";
      break;
    default:
      src = "/statics/images/003-sunny.png";
      break;
  }

  return {
    src,
    alt: wf,
  };
};
