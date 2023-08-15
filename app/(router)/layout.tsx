import NavBar from "../_components/navbar/NavBar";
import Image from "next/image";
import styles from "./main.module.css";
import "./globals.css";

export const metadata = {
  title: "오늘의 옷",
  description: "오늘 날씨에 따라 AI가 추천하는 옷을 알려드립니다.",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ko">
      <body>
        <div id="modal-portal"></div>
        <Image
          className={styles.img}
          src="/statics/images/background-img.jpg"
          alt="배경 이미지"
          fill
          priority
        />
        <NavBar />
        <div className={styles.layout}>
          <div className={styles.container}>{children}</div>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
