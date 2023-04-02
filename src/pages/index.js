import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { authOptions } from '../pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"
import Head from 'next/head'
import Link from "next/link";
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button'
import WeatherCard from '../components/WeatherCard'

const url = "http://localhost:3000/api/weather";

function makeScript(weatherData) {
  const { result } = weatherData;
  const script = `오늘 하루 최고 기온은 ${result.TMX}도, 최저 기온은 ${result.TMN}도야. 평균 풍속은 ${result.WSD}/ms이고 하루 중
  강수 확률은 ${result.POP}%야. 그리고 평균 적설량은 ${result.SNO}야. 
  이 날씨에 맞게 하루 동안 입을 옷차림을 추천해줘. 설명 할 땐, '트렌치 코트', '울 코트' 처럼 옷의 종류로 설명해줬으면 좋겠고, '린넨, 가죽, 데님, 등등 '날씨에 어울리는 옷의 소재 또한 설명해줬으면 좋겠어.
  `;
  return script;
}

export default function Home({ weatherData }) {
  const weatherArray = weatherData.item;
  const wsdArray = weatherArray.filter(weather => weather.category === 'WSD');
  const snoArray = weatherArray.filter(weather => weather.category === 'SNO');
  if (snoArray.filter(weather => typeof weather.fcstValue !== 'string').length === 0) { }
    
  const popArray = weatherArray.filter(weather => weather.category === 'POP');

  let wsdCount = 0;
  let avgWSD = 0;
  // 풍속이 있는 시간만 평균을 측정. 
  const sumWSD = wsdArray.map(weather => {
    if (weather.fcstValue > 0) {
      wsdCount++;
      return weather.fcstValue
    }
  }).reduce((sum, currValue) => Number(sum) + Number(currValue));
  if (wsdCount > 0) {
    avgWSD = Math.round(sumWSD / wsdCount * 10) / 10;
  }

  let snoCount = 0;
  const avgSNO = snoArray.filter(weather => typeof weather.fcstValue !== 'string').map(weather => {
    snoCount++;
    return weather.fcstValue;
  }).length === 0 ? 0 : Math.round((snoArray.filter(weather => typeof weather.fcstValue !== 'string').map(weather => {
    snoCount++;
    return weather.fcstValue;
  }).reduce((sum, currValue) => Number(sum) + Number(currValue)) / snoCount) * 10) / 10;

  const POP = popArray.find(weather => weather.fcstValue > 0) === undefined ? 0 : popArray.find(weather => weather.fcstValue > 0).fcstValue;
  const TMN = weatherArray.find(weather => weather.category === 'TMN').fcstValue;
  const TMX = weatherArray.find(weather => weather.category === 'TMX').fcstValue;

  const scriptWeatherData = {

    result: {
      WSD: avgWSD,
      SNO: avgSNO,
      POP: POP,
      TMN: TMN,
      TMX: TMX
    }
  }

  console.log(scriptWeatherData)
  const currentHour = new Date().getHours();
  const currentWeatherArray = weatherArray.filter(weather => Number(weather.fcstTime.substr(0,2)) === currentHour)

  const skyObj = currentWeatherArray.find(weather => weather.category === 'SKY')
  const pcpObj = currentWeatherArray.find(weather => weather.category === 'PCP')
  const snoObj = currentWeatherArray.find(weather => weather.category === 'SNO')
  const tmpObj = currentWeatherArray.find(weather => weather.category === 'TMP')
  const wsdObj = currentWeatherArray.find(weather => weather.category === 'WSD')

  const curWeatherObj = {
    sky: skyObj,
    pop: pcpObj,
    sno: snoObj,
    tmp: tmpObj,
    wsd: wsdObj,
  }



  async function generate() {
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sentence: makeScript(scriptWeatherData) }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      console.log(data)
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
            <title>오늘의 옷</title>
        </Head>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <Button
            variant="contained"
            fullWidth
            onClick={generate}
          >
            오늘의 옷
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Link href="/my-closet">옷장</Link>
        </Grid>
        <Grid item xs={6}>
          <div>asdas</div>
        </Grid>

        <Grid>
          <WeatherCard weather={curWeatherObj}/>
        </Grid>
      </Grid>
    </div>
  )
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions)

  const options = {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: session.user.email })
  }
  const response = await fetch(url, options);
  const {data} = await response.json();

  return {
    props: {
      weatherData: data,
    }
  }

}

