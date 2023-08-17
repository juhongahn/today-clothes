import { ThunkDispatch } from "@reduxjs/toolkit";
import { fetchDust } from "../_reducers/dustReducer";
import { fetchLocal } from "../_reducers/localReducer";
import { fetchRiseset } from "../_reducers/risesetReducer";
import { fetchWeathers } from "../_reducers/weatherReducer";

const useCoords = (
  coords: { latitude: number; longitude: number },
  dispatch
) => {
  dispatch(fetchWeathers(coords));
  dispatch(fetchLocal(coords));
  dispatch(fetchRiseset(coords));
  dispatch(fetchDust(coords));
};

export default useCoords;
