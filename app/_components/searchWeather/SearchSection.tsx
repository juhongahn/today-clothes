"use client";

import { appFetch } from "../../_helpers/custom-fetch/fetchWrapper";
import { useAppDispatch } from "../../_hooks/redux_hooks";
import useCoords from "../../_hooks/useCoords";
import SearchKeyword from "./SearchKeyword";
import styles from "./SearchSection.module.css";

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
  const keywordClickHandler = async (keyword: string) => {
    const { x, y } = await getXY(keyword);
    const coords = {
      latitude: parseFloat(y),
      longitude: parseFloat(x),
    };
    useCoords(coords, dispatch);
  };
  return (
    <div className={styles.searchSection}>
      <div className={styles.header}>
        <div className={styles.title}>
          <h3>날씨 검색</h3>
        </div>
        <div className={styles.form}>
          <input type="text" />
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

const getXY = async (address: string) => {
  try {
    const response = await appFetch(`api/address-search?address=${address}`);
    const { data } = await response.json();
    console.log(data);
    return data[0];
  } catch (error) {
    // TODO: Error handling
  }
};

export default SearchSection;
