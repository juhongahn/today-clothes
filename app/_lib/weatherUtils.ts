export const dateFormatter = (currentDate: Date, joint: string = ""): string => {
  let year = currentDate.getFullYear();
  let month = ("0" + (1 + currentDate.getMonth())).slice(-2);
  let day = ("0" + currentDate.getDate()).slice(-2);
  return [year, month, day].join(joint);
};

/**
 *
 * @param date 기준 날짜
 * @param elapseDays 경과 시키고 싶은 일
 * @returns 경과된 날짜
 */
export const advanceTime = (date: Date, elapseDays: number) => {
  let copyDate = new Date(date);
  copyDate.setDate(copyDate.getDate() + elapseDays);
  return copyDate;
};