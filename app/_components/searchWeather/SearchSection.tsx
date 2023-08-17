"use client";

import { useState } from "react";
import { appFetch } from "../../_helpers/custom-fetch/fetchWrapper";
import { useAppDispatch } from "../../_hooks/redux_hooks";
import useCoords from "../../_hooks/useCoords";
import SearchKeyword from "./SearchKeyword";
import styles from "./SearchSection.module.css";
import { FaSearchLocation } from "@react-icons/all-files/fa/FaSearchLocation";

const mock = [
  "의령 날씨",
  "제주 날씨",
  "대구 날씨",
  "서울 날씨",
  "부산 날씨",
  "강원 날씨",
  "속초 날씨",
];

const SearchSection = () => {
  const dispatch = useAppDispatch();
  const [input, setInput] = useState<string>("");

  const keywordClickHandler = async (keyword: string) => {
    handleSubmit(keyword, dispatch);
  };
  const submitHandler = (
    event:
      | React.KeyboardEvent<HTMLInputElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    handleSubmit(input, dispatch);
    setInput("");
  };
  return (
    <div className={styles.searchSection}>
      <div className={styles.header}>
        <div className={styles.title}>
          <h3>날씨 검색</h3>
        </div>
        <div className={styles.form}>
          <input
            type="text"
            className={styles.input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                submitHandler(event);
              }
            }}
          />
          <button
            className={styles.searchButton}
            onClick={(event) => {
              event.preventDefault();
              handleSubmit(input, dispatch);
            }}
          >
            <FaSearchLocation size={18} color="#5f6368ff" />
          </button>
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.keywords}>
          {mock.map((keyword, idx) => (
            <SearchKeyword
              key={idx}
              region={keyword}
              keywordClickHandler={keywordClickHandler.bind(null, keyword)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const handleSubmit = async (inputStr: string, dispatch) => {
  const { x, y } = await getXY(inputStr);
  const coords = {
    latitude: parseFloat(y),
    longitude: parseFloat(x),
  };
  useCoords(coords, dispatch);
};

export const getXY = async (address: string) => {
  try {
    const response = await appFetch(`api/address-search?address=${address}`);
    const { data } = await response.json();
    return data[0];
  } catch (error) {
    // TODO: Error handling
  }
};

export default SearchSection;
