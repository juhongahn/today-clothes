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
            margin: 0px;
          }
          `}</style> 
    </SessionProvider >

  )
}
