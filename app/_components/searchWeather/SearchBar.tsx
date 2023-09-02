import { useState } from "react";
import styles from "./SearchSection.module.css";
import { FaSearchLocation } from "@react-icons/all-files/fa/FaSearchLocation";
import { appFetch } from "../../_helpers/custom-fetch/fetchWrapper";
import { thunkUpdateCoords, useAppDispatch } from "../../_hooks/redux_hooks";

const SearchBar = () => {
  const [inputAddress, notFoundError, handleSubmit, onChangeHandler] =
    useSearch();
  return (
    <>
      <div className={styles.form}>
        <input
          type="text"
          value={inputAddress}
          className={styles.input}
          placeholder="주소를 입력해 주세요."
          onChange={(event) => onChangeHandler(event.target.value)}
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
    </>
  );
};

export default SearchBar;

type UseSearchReturn = [
  inputAddress: string,
  notFoundError: string,
  handleSubmit: (
    event:
      | React.KeyboardEvent<HTMLInputElement>
      | React.MouseEvent<Element, MouseEvent>,
    keyword?: string
  ) => void,
  onChangeHandler:(input: string) => void
];

export const useSearch = (): UseSearchReturn => {
  const dispatch = useAppDispatch();
  const [inputAddress, setInputAddress] = useState<string>("");
  const [notFoundError, setNotFoundError] = useState<string>("");
  const onChangeHandler = (input: string) => {
    setInputAddress(input);
  };
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
      dispatch(thunkUpdateCoords(coords));
      setNotFoundError("");
    } catch (error) {
      setNotFoundError(error.message);
    } finally {
      setInputAddress("");
    }
  };
  return [inputAddress, notFoundError, handleSubmit, onChangeHandler];
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
