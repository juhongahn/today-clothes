import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch, AppThunk } from "../store";
import { fetchWeathers } from "../_reducers/weatherReducer";
import { fetchLocal } from "../_reducers/localReducer";
import { fetchRiseset } from "../_reducers/risesetReducer";
import { fetchDust } from "../_reducers/dustReducer";
import { COORDS } from "../_types/types";
import dayjs from "../_lib/dayjs";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const thunkUpdateCoords =
  (coords: COORDS): AppThunk =>
  async (dispatch) => {
    dispatch(fetchWeathers(coords));
    dispatch(fetchLocal(coords));
    dispatch(fetchRiseset(coords));
    dispatch(fetchDust(coords));
  };

export const getInitialComparisonTime = (): number => {
  const initialComparisonTime =
    dayjs().tz().minute(0).second(0).millisecond(0).unix() * 1000;
  return initialComparisonTime;
};
