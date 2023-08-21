"use client";

import { useState } from "react";
import { appFetch } from "../../_helpers/custom-fetch/fetchWrapper";
import { useAppDispatch } from "../../_hooks/redux_hooks";
import useCoords from "../../_hooks/useCoords";
import SearchKeyword from "./SearchKeyword";
import styles from "./SearchSection.module.css";
import { FaSearchLocation } from "@react-icons/all-files/fa/FaSearchLocation";

const mock = [
  "서울 날씨",
  "제주 날씨",
  "대구 날씨",
  "부산 날씨",
  "강원 날씨",
  "속초 날씨",
  "의령 날씨",
];

const SearchSection = () => {
  const dispatch = useAppDispatch();
  const [inputAddress, setInputAddress] = useState<string>("");
  const [notFoundError, setNotFoundError] = useState<string>("");

  const handleSubmit = async (
    event:
      | React.KeyboardEvent<HTMLInputElement>
      | React.MouseEvent<Element, MouseEvent>,
    keyword?: string
  ) => {
    event.preventDefault();
    try {
      if (!inputAddress && !keyword) {
        throw new Error("주소를 입력해 주세요.");
      }
      const address = trimAddress(keyword ? keyword : inputAddress);
      const { x, y } = await getXY(address);
      const coords = {
        latitude: parseFloat(y),
        longitude: parseFloat(x),
      };
      useCoords(coords, dispatch);
      setNotFoundError("");
    } catch (error) {
      setNotFoundError(error.message);
    } finally {
      setInputAddress("")
    }
  };

  const keywordClickHandler = (
    event: React.MouseEvent<Element, MouseEvent>,
    keyword: string
  ) => {
    handleSubmit(event, keyword);
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
            value={inputAddress}
            className={styles.input}
            placeholder="주소를 입력해 주세요."
            onChange={(event) => setInputAddress(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                handleSubmit(event);
              }
            }}
          />
          <button
            className={styles.searchButton}
            onClick={(event) => {
              handleSubmit(event);
            }}
          >
            <FaSearchLocation size={18} color="#5f6368ff" />
          </button>
        </div>
        {notFoundError && <p className={styles.error}>{notFoundError}</p>}
      </div>
      <div className={styles.body}>
        <div className={styles.keywords}>
          {mock.map((keyword, idx) => (
            <SearchKeyword key={idx} region={keyword} onClick={keywordClickHandler} />
          ))}
        </div>
      </div>
    </div>
  );
};

export const getXY = async (address: string) => {
  try {
    const response = await appFetch(`api/address-search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accecpt: "application/json",
      },
      body: JSON.stringify(address),
    });
    const { data } = await response.json();
    console.log(data)
    return data[0];
  } catch (error) {
    throw new Error("주소를 찾을 수 없습니다.");
  }
};

export const trimAddress = (inputAddressText: string) => {
  const keyword = "날씨";
  const modifiedText = inputAddressText.replace(keyword, "");
  return modifiedText.trim();
};

export default SearchSection;
