"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./Geolocation.module.css";
import Loading from "../ui/Loading";
import Button from "../ui/Button";

const Geolocation = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>(null);
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
      setError("오늘의 옷 서비스를 이용하기 위해 위치 엑세스를 허용해주세요.");
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
      setError(error.message);
      setIsLoading(false);
    }
  };

  const handleGetLocation = () => {
    locationHandler();
  };

  return (
    <div className={styles.geolocation}>
      <div className={styles.header}>
        <h1>오늘의 옷</h1>
      </div>
      <div className={styles.body}>
        {!error ? (
          <>
            <p className={styles.title}>
              &apos;이 옷입고 나갔다가 더우면, 추우면 어쩌지?...&apos;
            </p>
            <p className={styles.description}>
              날씨 때문에 어떤 옷을 입고 나갈지, 고민 해보신 적 있으신가요?
            </p>
            <p className={styles.description}>
              <span>오늘의 옷으로</span>, 성별, 퍼스널컬러, 날씨에 맞춰 AI가 추천해주는 하루 옷차림을 확인하고 상쾌한 하루 보내세요!
            </p>
          </>
        ) : (
          <>
            <p className={styles.error}>{error}</p>
            <p>
              설정 탭에서 위치 엑세스를 허용하거나 다른 브라우저를 사용해
              주세요.
            </p>
          </>
        )}
      </div>
      <div className={styles.footer}>
        <Button
          text={isLoading ? null : " 오늘의 옷 시작하기"}
          onClick={handleGetLocation}
          variant="primary"
          size="lg"
          disabled={isLoading}
        >
          {isLoading && <Loading />}
        </Button>
        <p>오늘의 옷 서비스를 사용하려면 위치 엑세스를 허용해주세요.</p>
      </div>
    </div>
  );
};

export default Geolocation;
