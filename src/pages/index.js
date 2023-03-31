import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button'

const url = "http://localhost:3000/api/fetch-weather";

function makeScript(weatherData) {
  const { result } = weatherData;
  const script = `계절은 봄이고, 최대 기온은 ${result.TMX}도, 최저 기온은 ${result.TMN}도 입니다.
   그리고 하루 중 강수 확률은 ${result.POP}% 입니다. 이 날씨에 적합한 옷차림을 추천 해주세요.
  `;
  return script;
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  async function fetchWeather() {
    const options = {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: session.user.email })
    }

    let weatherData = await fetch(url, options)
      .then(res => res.json())
      .then(data => {
        return data;
      })

    await generate(weatherData);
  }

  async function generate(weatherData) {
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sentence: makeScript(weatherData) }),
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
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <Button
            variant="contained"
            onClick={fetchWeather}
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
      </Grid>
    </div>
  )
}
