import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from 'next/image';
import Grid from '@mui/material/Grid';


export default function Home() {
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  console.log(session);

  return (
    <div>
      <Grid container spacing={2}>
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
