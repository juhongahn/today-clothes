import { Suspense, lazy, useState } from "react";
import { useAppSelector } from "../../../_hooks/redux_hooks";
import { selectLocal } from "../../../_reducers/localReducer";
import { createPortal } from "react-dom";
import Header from "../../ui/header/Header";
import Button from "../../ui/button/Button";
import Loading from "../../ui/loading/Loading";
import styles from "./WeatherHeader.module.css";

const RecommendationModal = lazy(
  () => import("../../../_components/recommendation/RecommendationModal")
);

const WeatherHeader = () => {
  const local = useAppSelector(selectLocal);
  const [isRecommendationModalShow, recommendationModalHandler] =
    useRecommendationModal();
  return (
    <div className={styles.weatherHeader}>
      <Header
        title={local ? local.address_name : ""}
        styles={{
          fontSize: "1.5rem",
          fontWeight: "700",
          color: "white",
          margin: "0",
        }}
      />
      <div className={styles.clothButton}>
        <Button
          variant="secondary"
          size="md"
          text="오늘의 옷 보기"
          onClick={recommendationModalHandler.bind(null, false)}
          name="open-modal"
        />
      </div>
      {isRecommendationModalShow &&
        createPortal(
          <Suspense
            fallback={
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Loading size={{ width: 32, height: 32 }} />
              </div>
            }
          >
            <RecommendationModal modalHandler={recommendationModalHandler} />
          </Suspense>,
          document.getElementById("modal-portal")
        )}
    </div>
  );
};

export default WeatherHeader;

type UseRecommendationModalReturn = [boolean, (promptLoading: boolean) => void];
const useRecommendationModal = (): UseRecommendationModalReturn => {
  const [isModalShow, setIsModalShow] = useState<boolean>(false);

  const recommendationModalHandler = (promptLoading?: boolean) => {
    if (promptLoading) return;
    setIsModalShow((prev) => !prev);
  };
  return [isModalShow, recommendationModalHandler];
};
