import { useEffect } from "react";
import { useSession, getSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {

  const { data: session, status } = useSession();
  console.log(session)
  console.log(status)

  return (
    <Link href="/my-closet">옷장</Link>
  )
}
