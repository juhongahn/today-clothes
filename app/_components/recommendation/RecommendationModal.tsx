"use client";

import {
  useState,
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
  MutableRefObject,
} from "react";
import { PromptsType } from "../../_lib/createPrompts";
import { selectCurrentDust } from "../../_reducers/dustReducer";
import { selectCurrentUV } from "../../_reducers/uvReducer";
import { selectCurrentWeather } from "../../_reducers/weatherReducer";
import Backdrop from "../ui/Backdrop";
import styles from "./RecommendationModal.module.css";
import { useSelector } from "react-redux";
import { HttpError } from "../../_helpers/error-class/HttpError";
import { DUST, UV, Weather } from "../../_types/types";
import { SelectionError } from "../../_helpers/error-class/SelectionError";

interface RecommendationModalProps {
  modalHandler: () => void;
}

interface GenderType {
  gender: string;
  value: string;
}

type ColorType = {
  color: string;
  value: string;
};

const GENDER: GenderType[] = [
  { gender: "male", value: "남자" },
  { gender: "female", value: "여자" },
];
const COLOR: ColorType[] = [
  { color: "springWarm", value: "봄 웜톤" },
  { color: "summerCool", value: "여름 쿨톤" },
  { color: "fallWarm", value: "가을 웜톤" },
  { color: "winterCool", value: "겨울 쿨톤" },
  { color: "nothing", value: "상관 없음" },
];

const RecommendationModal = ({ modalHandler }: RecommendationModalProps) => {
  const [personalSelection, personalSelectionHandler] = usePersonalSelection();
  const [curWeahter, curUV, curDust] = usePromptData();
  const scriptRef = useRef(null);
  const [responsePrompt, setResponsePrompt, promptLoading, setPromptLoading] =
    usePrompt(scriptRef);

  useEffect(() => {
    if (window) {
      const promptScript = sessionStorage.getItem("prompt");
      if (promptScript) setResponsePrompt(promptScript);
    }
  }, []);

  const modalSendClickHandler = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    if (curWeahter && curUV && curDust) {
      try {
        if (!personalSelection.gender.gender) {
          throw new SelectionError("성별을 선택해 주세요.", "gender");
        }
        if (!personalSelection.color.color) {
          throw new SelectionError("퍼스널 컬러를 선택해 주세요.", "color");
        }
        setResponsePrompt("");
        setPromptLoading(true);
        const { TMP, REH, WSD, POP, TMX, TMN } = curWeahter.value;
        const uv = curUV.components.uv.value.toString();
        const pm = curDust.components.pm10.value.toString();
        const inputPrompt: PromptsType = {
          tmp: TMP,
          reh: REH,
          wsd: WSD,
          uv,
          pm,
          pop: POP,
          tmn: TMN,
          tmx: TMX,
          gender: personalSelection.gender.gender,
          color: personalSelection.color.color,
        };

        const response = await fetch("api/cloth-recomendation", {
          method: "POST",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputPrompt }),
        });
        if (!response.ok) {
          throw new HttpError("데이터 요청 중 에러가 발생했습니다.", response);
        }
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          const chunkValue = decoder.decode(value);
          setResponsePrompt((prev) => prev + chunkValue);
        }
        sessionStorage.setItem("prompt", responsePrompt);
      } catch (error: unknown) {
        if (error instanceof HttpError) {
          //TODO: Http error handling
        } else if (error instanceof SelectionError) {
          alert(error.message);
          return;
        }
        throw new Error("알 수 없는 에러가 발생했습니다.");
      } finally {
        setPromptLoading(false);
      }
    }
  };
  return (
    <>
      <Backdrop modalHandler={modalHandler.bind(null, promptLoading)} />
      <div className={styles.modal}>
        <div className={styles.header}>
          <h5>오늘의 옷</h5>
          <button
            type="button"
            className={styles.close}
            onClick={modalHandler.bind(null, promptLoading)}
          >
            <span>x</span>
          </button>
        </div>
        <div className={styles.body}>
          <div className={styles.gender}>
            <p className={styles.label}>성별: </p>
            <div className={styles.buttons}>
              {GENDER.map((gender, idx) => (
                <span
                  key={idx}
                  className={`${styles.value} ${styles[gender.gender]} 
                  ${
                    personalSelection.gender.gender === gender.gender &&
                    styles[`selected${personalSelection.gender.gender}`]
                  }`}
                  onClick={personalSelectionHandler.bind(null, gender)}
                >
                  {gender.value}
                </span>
              ))}
            </div>
          </div>
          <div className={styles.color}>
            <p className={styles.label}>퍼스널 컬러:</p>
            <div className={styles.buttons}>
              {COLOR.map((personal, idx) => (
                <span
                  key={idx}
                  className={`${styles.value} ${styles[personal.color]} 
                  ${
                    personalSelection.color.color === personal.color &&
                    styles[`selected${personalSelection.color.color}`]
                  }`}
                  onClick={personalSelectionHandler.bind(null, personal)}
                >
                  {personal.value}
                </span>
              ))}
            </div>
          </div>
          {responsePrompt && (
            <div className={styles.script} ref={scriptRef}>
              {responsePrompt}
            </div>
          )}
        </div>
        <div className={styles.footer}>
          <button
            className={`${styles.action} ${styles.cancel} ${
              promptLoading && styles.cancelDisabled
            }`}
            onClick={modalHandler.bind(null, promptLoading)}
            disabled={promptLoading}
          >
            취소
          </button>
          <button
            className={`${styles.action} ${styles.confirm} ${
              promptLoading && styles.confirmDisabled
            }`}
            onClick={modalSendClickHandler}
            disabled={promptLoading}
          >
            추천 시작
          </button>
        </div>
      </div>
    </>
  );
};

type usePersonalSelectionReturn = [
  {
    gender: GenderType;
    color: ColorType;
  },
  (selection: unknown) => void
];

const usePersonalSelection = (): usePersonalSelectionReturn => {
  const [personalSelection, setPersonalSelection] = useState<{
    gender: GenderType;
    color: ColorType;
  }>({
    gender: { gender: "", value: "" },
    color: { color: "", value: "" },
  });

  const personalSelectionHandler = (selection: unknown) => {
    if (isGenderType(selection)) {
      setPersonalSelection((prev) => {
        return {
          gender: selection,
          color: prev.color,
        };
      });
    } else if (isColorType(selection)) {
      setPersonalSelection((prev) => {
        return {
          gender: prev.gender,
          color: selection,
        };
      });
    }
  };
  return [personalSelection, personalSelectionHandler];
};

type usePromptReturn = [
  responsePrompt: string,
  setResponsePrompt: Dispatch<SetStateAction<string>>,
  promptLoading: boolean,
  setPromptLoading: Dispatch<SetStateAction<boolean>>
];

const usePrompt = (
  scriptRef: MutableRefObject<HTMLDivElement>
): usePromptReturn => {
  const [responsePrompt, setResponsePrompt] = useState<string>("");
  const [promptLoading, setPromptLoading] = useState<boolean>(false);
  const [autoScroll, setAutoScroll] = useState<boolean>(true);

  useEffect(() => {
    if (responsePrompt && !promptLoading) {
      // 프롬프트 작성이 끝났다면 세션스토리지에 저장.
      sessionStorage.setItem("prompt", responsePrompt);
    }
    if (autoScroll && scriptRef.current)
      scriptRef.current.scrollTop = scriptRef.current.scrollHeight;
  }, [promptLoading, responsePrompt]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        scriptRef.current &&
        scriptRef.current.scrollTop + scriptRef.current.clientHeight >=
        scriptRef.current.scrollHeight - 20
      ) {
        setAutoScroll(true);
      } else {
        setAutoScroll(false);
      }
    };
    scriptRef.current &&
      scriptRef.current.addEventListener("scroll", handleScroll);
    return () => {
      scriptRef.current &&
        scriptRef.current.removeEventListener("scroll", handleScroll);
    };
  });

  return [responsePrompt, setResponsePrompt, promptLoading, setPromptLoading];
};

type usePromptDataReturn = [curWeather: Weather, curUV: UV, curDust: DUST];

const usePromptData = (): usePromptDataReturn => {
  const curWeahter = useSelector(selectCurrentWeather);
  const curUV = useSelector(selectCurrentUV);
  const curDust = useSelector(selectCurrentDust);
  return [curWeahter, curUV, curDust];
};

const isGenderType = (gender: any): gender is GenderType => {
  return "gender" in gender && "value" in gender;
};
const isColorType = (color: any): color is ColorType => {
  return "color" in color && "value" in color;
};

export default RecommendationModal;
