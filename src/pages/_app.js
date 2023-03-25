import Container from '@mui/material/Container';
import { SessionProvider } from "next-auth/react"
import '../components/Navbar.css'
import Navbar from '@/components/Navbar';

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Container fixed maxWidth="xs">
        <Navbar />
        <Component {...pageProps} />
      </Container>
    </SessionProvider >

  )
}
