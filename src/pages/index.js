import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from 'next/image';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button'

const url = "http://localhost:3000/api/fetch-weather";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();

  async function fetchWeather() {
    console.log("called");

    const options = {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: session.user.email })
    }

    await fetch(url, options)
      .then(res => res.json())
      .then(data => {
        console.log(data);
      })
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
