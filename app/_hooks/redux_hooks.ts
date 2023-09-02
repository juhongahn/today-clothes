import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch, AppThunk } from "../store";
import { fetchWeathers } from "../_reducers/weatherReducer";
import { fetchLocal } from "../_reducers/localReducer";
import { fetchRiseset } from "../_reducers/risesetReducer";
import { fetchDust } from "../_reducers/dustReducer";
import { COORDS } from "../_types/types";

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
