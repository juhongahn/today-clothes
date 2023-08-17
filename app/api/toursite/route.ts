import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

const url = "https://korean.visitkorea.or.kr/main/main.do";

export const GET = async () => {
  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto(url);

    const results = await page.evaluate(() => {
      const elements = document.querySelectorAll(".ai_list li");
      const data = Array.from(elements).map((li) => ({
        title: li.querySelector("strong").textContent,
        location: li.querySelector("span").textContent,
        image: li
          .querySelector(".img_wrap")
          .getAttribute("style")
          .match(/url\((['"]?)(.*?)\1\)/)[2],
      }));
      return data;
    });

    await browser.close();
    return NextResponse.json({ data: results.slice(1) }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "데이터 요청 중 에러가 발생했습니다." },
      { status: 500 }
    );
  }
};
