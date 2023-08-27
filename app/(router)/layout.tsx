import { IBM_Plex_Sans_KR } from "next/font/google";
import NavBar from "../_components/navbar/NavBar";
import Image from "next/image";
import "./globals.css";

const ibm_plex_sans_kr = IBM_Plex_Sans_KR({
  weight: ["400", "500", "600", "700"],
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
          src="/statics/images/background-img.jpg"
          alt="배경 이미지"
          fill
          priority
          style={{zIndex: "-100", opacity: "0.5"}}
        />
        <NavBar />
        <section style={{paddingTop: "3.5rem"}}>{children}</section>
      </body>
    </html>
  );
};

export default RootLayout;
