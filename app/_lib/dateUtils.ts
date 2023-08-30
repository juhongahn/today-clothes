import dayjs from "./dayjs";

export const getDayDifference = (timestamp: number): number => {
  const currentDate = dayjs().tz();
  const currentTime = currentDate
    .hour(0)
    .minute(0)
    .second(0)
    .millisecond(0)
    .unix() * 1000;
  const oneDayInTime = 24 * 60 * 60 * 1000;

  const daysDifference = Math.floor((timestamp - currentTime) / oneDayInTime);
  return daysDifference;
};
