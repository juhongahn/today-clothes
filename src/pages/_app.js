import { SessionProvider } from "next-auth/react"
import Layout from '@/components/Layout';
import '../components/Navbar.css'
import Image from "next/image";

export default function App({ Component, pageProps: { session, ...pageProps } }) {
	return (

		<SessionProvider session={session}>
			<Image
				src="/image/signin_bg.jpg"
				alt="배경 이미지"
				fill
				style={{
					opacity: 0.5,
					objectFit: 'cover',
					zIndex: -1,
				}}
			/>
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
