import { SessionProvider } from "next-auth/react"
import Layout from '@/components/Layout';
import '../components/Navbar.css'
import Image from "next/image";

export default function App({ Component, pageProps: { session, ...pageProps } }) {

	return (

		<SessionProvider session={session}>
			<div style={{
				heigth: '100%',
				overflow: 'auto',
			}}>
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
						padding: 0px;
						margin: 0px;
						height: 100%;
					}
					a {
						text-decoration: none;
						font-size: 0.9rem;
						color: grey;
					}
				`}</style>
			</div>
		</SessionProvider >

	)
}
