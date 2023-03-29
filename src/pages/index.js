import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from 'next/image';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button'
import fetchWeather from "@/lib/fetchWeather";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();

  function showTodayCloth() {
    fetchWeather();
  }

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <Button
            variant="contained"
            onClick={() => {
              showTodayCloth();
            }}
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
