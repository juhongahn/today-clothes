import { IBM_Plex_Sans_KR } from "next/font/google";
import Image from "next/image";
import backgroundImg from "/public/statics/images/background-img.jpg"
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
      <head>
        <link rel="icon" href="/favicon/favicon.ico" />
      </head>
      <body>
        <div id="modal-portal"></div>
        <Image
          src={backgroundImg}
          alt="배경 이미지"
          fill
          sizes="100vw"
          placeholder="blur"
          quality={100}
          style={{ zIndex: "-100", opacity: "0.5" , objectFit: "cover"}}
        />
        <section id="rootSection">{children}</section>
      </body>
    </html>
  );
};

export default RootLayout;
