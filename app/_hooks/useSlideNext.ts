import { MutableRefObject, useEffect, useReducer, useRef } from "react";
import {
  SLIDE_ACTION_TYPE,
  SLIDE_INITIAL_STATE,
  SLIDE_STATE,
  slideReducer,
} from "../_reducers/chartSlideReducer";

type UseSlideNextReturn = [
  (arg: string) => void,
  MutableRefObject<any>,
  MutableRefObject<HTMLDivElement>,
  SLIDE_STATE
];

export const SLIDE_TYPE = {
  SLIDE_LEFT: "SLIDE_LEFT",
  SLIDE_RIGHT: "SLIDE_RIGHT",
  SLIDE_INITIALIZE: "SLIDE_INITIALIZE",
};

const useSlideNext = (): UseSlideNextReturn => {
  const [slideState, dispatch] = useReducer(slideReducer, SLIDE_INITIAL_STATE);
  const chartRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chartWidth = chartRef.current.container.offsetWidth;
      const offset = containerRef.current.offsetWidth;

      chartRef.current.container.style.transform = `translateX(${slideState.xPos}px)`;

      if (Math.abs(slideState.xPos) + offset >= chartWidth - 20) {
        dispatch({ type: SLIDE_ACTION_TYPE.SLIDE_PAUSE_RIGHT });
      } else if (slideState.xPos === 0) {
        dispatch({ type: SLIDE_ACTION_TYPE.SLIDE_PAUSE_LEFT });
      } else if (
        Math.abs(slideState.xPos) > 0 &&
        Math.abs(slideState.xPos) + offset < chartWidth - 20
      ) {
        dispatch({ type: SLIDE_ACTION_TYPE.SLIDE_PAUSE_FREE });
      }
    }
  }, [slideState.xPos]);

  const slideHandler = (slideType: string) => {
    const offset = containerRef.current.offsetWidth;
    if (slideType === SLIDE_TYPE.SLIDE_LEFT) {
      dispatch({ type: SLIDE_ACTION_TYPE.SLIDE_LEFT, payload: offset });
    } else if (slideType === SLIDE_TYPE.SLIDE_RIGHT) {
      dispatch({ type: SLIDE_ACTION_TYPE.SLIDE_RIGHT, payload: offset });
    } else {
      dispatch({ type: SLIDE_ACTION_TYPE.SLIDE_RESET });
    }
  };

  return [slideHandler, chartRef, containerRef, slideState];
};

export default useSlideNext;
