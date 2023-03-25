import { useEffect } from "react";
import { useSession, getSession } from "next-auth/react";

export default function Home() {

  const { data: session, status } = useSession();
  console.log(session)
  console.log(status)

  return;
}
