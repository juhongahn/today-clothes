import Container from '@mui/material/Container';
import { SessionProvider } from "next-auth/react"
import Layout from '@/components/Layout';
import '../components/Navbar.css'

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    
    <SessionProvider session={session}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <style global jsx>{`
          html,
          body,
          body > div:first-child,
          div#__next,
          div#__next > div{
            padding: 0;
            height: 100vh;
            margin: 0px;
          }
            
          `}</style> 

    </SessionProvider >

  )
}
