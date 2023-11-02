import {
  FAILED,
  IDLE,
  LOADING,
} from "../_helpers/constants/constants";

export type Status = {
  name: string;
  status: string;
};

export const hasArrayTarget = (
  array: Status[],
  checkTargetsFunction: (status: Status) => boolean
) => {
  return array.find(checkTargetsFunction);
};

export const checkError = ({ status }: Status) => {
  return status === FAILED;
};

export const checkLoadingOrIdle = ({ status }: Status) => {
  return status === LOADING || status === IDLE;
};