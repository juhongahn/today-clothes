"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./Geolocation.module.css";
import Loading from "../ui/loading/Loading";
import Button from "../ui/button/Button";
import Lottie from "react-lottie-player";
import lottieJson from "../../../public/statics/lottieFiles/homeLottie.json";

const Geolocation = () => {
  const [isLoading, locationError, locationHandler] = useLocation();

  return (
    <div className={styles.geolocation}>
      <div className={`${styles.script} ${styles.item}`}>
        {!locationError ? (
          <Script />
        ) : (
          <LocationError errorMessage={locationError} />
        )}
        <div className={styles.button}>
          <Button
            text={isLoading ? null : "오늘의 옷 시작하기"}
            onClick={locationHandler}
            variant="primary"
            size="lg"
            disabled={isLoading}
            name="start-today-clothes"
          >
            {isLoading && <Loading />}
          </Button>
        </div>
        <p className={styles.manual}>
          오늘의 옷 서비스를 사용하려면 위치 엑세스를 허용해주세요.
        </p>
      </div>
      <div className={`${styles.lottie} ${styles.item}`}>
        <Lottie
          loop
          animationData={lottieJson}
          play
          speed={0.6}
          style={{ width: '80%'}}
        />
      </div>
    </div>
  );
};

interface LocationErrorProps {
  errorMessage: string;
}

const LocationError = ({ errorMessage }: LocationErrorProps) => {
  return (
    <div className={styles.errorContainer}>
      <p className={styles.error}>{errorMessage}</p>
      <p>설정 탭에서 위치 엑세스를 허용하거나 다른 브라우저를 사용해 주세요.</p>
    </div>
  );
};

type ScriptType = {
  value: string;
  color: string;
};

const Script = () => {
  const scriptList: ScriptType[] = [
    { value: "날씨", color: "red" },
    { value: "성별", color: "blue" },
    { value: "퍼스널 컬러", color: "green" },
    { value: "관광지", color: "gray" },

  ];
  const [currentScriptIndex, setCurrentScriptIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentScriptIndex((prevIndex) => (prevIndex + 1) % scriptList.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className={styles.scriptContainer}>
      <div className={styles.jumbo}>
        <h1 className={styles.emphasis}>오늘의 옷으로,</h1>
        <p className={styles.description}>
          <span className={styles[scriptList[currentScriptIndex].color]}>
            {scriptList[currentScriptIndex].value}
          </span>
          에 맞춰
        </p>
        <p>하루 옷차림을 확인해 보세요!</p>
      </div>
      <div className={styles.small}>
        <p>&apos;이 옷입고 나갔다가 더우면, 추우면 어쩌지?...&apos; 이런 고민 해보신 적 있나요?</p>
        <p>AI가 추천해주는 옷차림을 확인하고 쾌적한 하루를 보내세요!</p>
      </div>
    </div>
  );
};

type UseLocationReturn = [boolean, string, () => void];

const useLocation = (): UseLocationReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string>(null);
  const router = useRouter();

  const locationHandler = () => {
    const success = (position: GeolocationPosition) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      sessionStorage.setItem(
        "coords",
        JSON.stringify({
          latitude,
          longitude,
        })
      );
      router.push("/weather");
    };

    const error = () => {
      setLocationError(
        "오늘의 옷 서비스를 이용하기 위해 위치 엑세스를 허용해주세요."
      );
      setIsLoading(false);
    };

    try {
      setIsLoading(true);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
      } else {
        throw new Error("해당 브라우저에서는 위치 정보를 제공하지 않습니다.");
      }
    } catch (error) {
      setLocationError(error.message);
      setIsLoading(false);
    }
  };

  return [isLoading, locationError, locationHandler];
};

export default Geolocation;
