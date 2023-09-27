import { MdKeyboardArrowLeft } from "@react-icons/all-files/md/MdKeyboardArrowLeft";
import { MdKeyboardArrowRight } from "@react-icons/all-files/md/MdKeyboardArrowRight";
import { useCallback, useEffect, useReducer, useState } from "react";
import styles from "./Slider.module.css";
import {
  SLIDE_ACTION_TYPE,
  SLIDE_INITIAL_STATE,
  slideReducer,
} from "../../../_reducers/chartSlideReducer";

interface SliderProps {
  children: React.ReactNode;
  slideLength: number;
  buttonProps: {
    round: boolean;
    position: {
      left: number;
      right: number;
    };
  };
}

const Slider = ({ children, slideLength, buttonProps }: SliderProps) => {
  const [chlidrenRef, setChlidrenRefRef] = useState<HTMLDivElement>(null);
  const onRefChange = useCallback(
    (node: HTMLDivElement) => {
      setChlidrenRefRef(node);
    },
    [children]
  );
  const [buttonState, sliderHandler] = useSlide(chlidrenRef, slideLength);
  return (
    <div className={styles.slider}>
      {!buttonState.left && (
        <MdKeyboardArrowLeft
          size={30}
          onClick={sliderHandler.bind(null, SLIDE_TYPE.LEFT)}
          className={`${styles.arrow} ${
            buttonProps.round && styles.roundButton
          }`}
          style={{
            left: `${-1 * buttonProps.position.left}`,
          }}
        />
      )}
      <div className={styles.chlidrenContainer}>
        <div className={styles.children} ref={onRefChange}>
          {children}
        </div>
      </div>
      {!buttonState.right && (
        <MdKeyboardArrowRight
          onClick={sliderHandler.bind(null, SLIDE_TYPE.RIGHT)}
          size={30}
          className={`${styles.arrow} ${
            buttonProps.round && styles.roundButton
          }`}
          style={{
            right: `${-1 * buttonProps.position.right}`,
          }}
        />
      )}
    </div>
  );
};

export default Slider;

const SLIDE_TYPE = {
  LEFT: "left",
  RIGHT: "right",
  RESET: "reset",
};

type UseSlideReturn = [
  buttonState: {
    left: boolean;
    right: boolean;
  },
  sliderHandler: (slideType: string) => void
];

const useSlide = (ref: HTMLDivElement, slideLength: number): UseSlideReturn => {
  const [slideState, dispatch] = useReducer(slideReducer, SLIDE_INITIAL_STATE);
  const padding = 17;
  useEffect(() => {
    if (ref) {
      const offset = ref.offsetWidth;
      if (Math.abs(slideState.xPos) >= offset - slideLength - 100) {
        dispatch({ type: SLIDE_ACTION_TYPE.SLIDE_PAUSE_RIGHT });
      } else if (Math.abs(slideState.xPos) < 100) {
        dispatch({ type: SLIDE_ACTION_TYPE.SLIDE_PAUSE_LEFT });
      } else {
        dispatch({ type: SLIDE_ACTION_TYPE.SLIDE_PAUSE_FREE });
      }
      ref.style.transform = `translate(${slideState.xPos}px)`;
    }
  }, [slideState.xPos]);

  const sliderHandler = (slideType: string) => {
    switch (slideType) {
      case SLIDE_TYPE.RESET:
        dispatch({ type: SLIDE_ACTION_TYPE.SLIDE_RESET });
        break;
      case SLIDE_TYPE.LEFT:
        dispatch({
          type: SLIDE_ACTION_TYPE.SLIDE_LEFT,
          payload: slideLength + padding,
        });
        break;
      case SLIDE_TYPE.RIGHT:
        dispatch({
          type: SLIDE_ACTION_TYPE.SLIDE_RIGHT,
          payload: slideLength + padding,
        });
        break;
    }
  };

  return [slideState.isButtonDisabled, sliderHandler];
};
