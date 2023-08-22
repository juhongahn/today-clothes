import { IBM_Plex_Sans_KR } from "next/font/google";
import NavBar from "../_components/navbar/NavBar";
import Image from "next/image";
import styles from "./main.module.css";
import "./globals.css";

const ibm_plex_sans_kr = IBM_Plex_Sans_KR({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  display: "swap",
  subsets: ["latin"],
});

export const metadata = {
  title: "오늘의 옷",
  description: "오늘 날씨에 따라 AI가 추천하는 옷을 알려드립니다.",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ko" className={ibm_plex_sans_kr.className}>
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
        <section className={styles.container}>{children}</section>
      </body>
    </html>
  );
};

export default RootLayout;
