import Container from '@mui/material/Container';
import { SessionProvider } from "next-auth/react"
import Layout from '@/components/Layout';
import '../components/Navbar.css'

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    
    <SessionProvider session={session}>
      <Container fixed maxWidth="xs">
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Container>
    </SessionProvider >

  )
}
