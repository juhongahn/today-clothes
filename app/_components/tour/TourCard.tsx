"use client";

import Image from "next/image";
import styles from "./TourCard.module.css";

interface TourCardProps {
  tour: {
    title: string;
    location: string;
    image: string;
  };
  cardSelectHandler: (tour: {
    title: string;
    location: string;
    image: string;
  }) => void;
  tourImageCounter: number
}

const TourCard = ({ tour, cardSelectHandler, tourImageCounter }: TourCardProps) => {
  return (
    <div
      className={styles.card}
      onClick={cardSelectHandler.bind(null, tour)}
    >
      <div className={styles.graphic}>
        <Image
          className={styles.image}
          src={tour.image}
          alt="여행지 이미지"
          priority={tourImageCounter === 0}
          loading={ tourImageCounter > 1 ? "lazy" : "eager"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className={styles.des}>
        <p className={styles.title}>{tour.title}</p>
        <p className={styles.location}>{tour.location}</p>
      </div>
    </div>
  );
};

export default TourCard;
