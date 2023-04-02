import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { authOptions } from '../pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"
import { getCurrentWeather, getWeatherScriptData } from '../lib/weatherUtils'
import Head from 'next/head'
import Link from "next/link";
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button'
import WeatherCard from '../components/WeatherCard'

const url = "http://localhost:3000/api/weather";

export default function Home({ weatherData }) {
  const weatherArray = weatherData.item;

  async function generate() {
    const script = getWeatherScriptData(weatherArray);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sentence: script }),
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

