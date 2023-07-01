import NavBar from "../components/navbar/NavBar";
import Image from "next/image";
import backgroundImg from "../public/image/background-img.jpg";
import styles from "./main.module.css";
import "./global.css";

export const metadata = {
  title: "오늘의 옷",
  description: "오늘 날씨에 따라 AI가 추천하는 옷을 알려드립니다.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <Image
          className={styles.img}
          src={backgroundImg}
          alt="배경 이미지"
          fill
        />
        <NavBar />
        <div className={styles.container}>
          {children}
        </div>
      </body>
    </html>
  );
}
