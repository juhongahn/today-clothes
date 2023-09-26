"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../_hooks/redux_hooks";
import { COORDS } from "../_types/types";
import { FAILED } from "../_helpers/constants/constants";
import { fetchLocal } from "../_reducers/localReducer";

interface Props {
  children: React.ReactNode;
}

const LocalFetcher = ({ children }: Props) => {
  const dispatch = useAppDispatch();
  const localStatus = useAppSelector((state) => state.local.status);

  useEffect(() => {
    const strCoords = sessionStorage.getItem("coords");
    const coords: COORDS = JSON.parse(strCoords);
    dispatch(fetchLocal(coords));
  }, []);

  if (localStatus === FAILED) throw new Error("api error");
  return children;
};

export default LocalFetcher;
