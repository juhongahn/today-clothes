import { PayloadAction } from "@reduxjs/toolkit";

export const SLIDE_ACTION_TYPE = {
  SLIDE_RIGHT: "SLIDE_RIGHT",
  SLIDE_LEFT: "SLIDE_LEFT",
  SLIDE_PAUSE_LEFT: "SLIDE_PAUSE_LEFT",
  SLIDE_PAUSE_RIGHT: "SLIDE_PAUSE_RIGHT",
  SLIDE_PAUSE_FREE: "SLIDE_PAUSE_FREE",
  SLIDE_RESET: "SLIDE_RESET",
};

export interface SLIDE_STATE {
  xPos: number;
  isButtonDisabled: {
    left: boolean;
    right: boolean;
  };
}

export const SLIDE_INITIAL_STATE: SLIDE_STATE = {
  xPos: 0,
  isButtonDisabled: {
    left: true,
    right: false,
  },
};

export const slideReducer = (state: SLIDE_STATE, action) => {
  switch (action.type) {
    case SLIDE_ACTION_TYPE.SLIDE_LEFT:
      return {
        ...state,
        xPos: state.xPos + action.payload,
        isButtonDisabled: state.isButtonDisabled,
      };
    case SLIDE_ACTION_TYPE.SLIDE_RIGHT:
      return {
        ...state,
        xPos: state.xPos - action.payload,
        isButtonDisabled: state.isButtonDisabled,
      };
    case SLIDE_ACTION_TYPE.SLIDE_PAUSE_LEFT:
      return {
        ...state,
        xPos: state.xPos,
        isButtonDisabled: {
          left: true,
          right: state.isButtonDisabled.right,
        },
      };
    case SLIDE_ACTION_TYPE.SLIDE_PAUSE_RIGHT:
      return {
        ...state,
        xPos: state.xPos,
        isButtonDisabled: {
          left: state.isButtonDisabled.left,
          right: true,
        },
      };
    case SLIDE_ACTION_TYPE.SLIDE_PAUSE_FREE:
      return {
        ...state,
        xPos: state.xPos,
        isButtonDisabled: {
          left: false,
          right: false,
        },
      };
    case SLIDE_ACTION_TYPE.SLIDE_RESET:
      return {
        ...state,
        xPos: 0,
        isButtonDisabled: {
          left: true,
          right: false,
        },
      };
  }
};
