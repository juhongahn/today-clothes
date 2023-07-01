import { Paper } from "@mui/material"
import Image from "next/image"
import Link from 'next/link'

function Error({ statusCode }) {
	return (
		<>
			<Paper
				elevation={3}
				sx={{
					margin: '20px 0 20px 0',
					padding: '20px 20px 20px 30px',
					borderRadius: '8px',
					lineHeight: '1.5rem',
					height: '40vh',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-around'
				}}>
				{statusCode === 404
					? 
					<>
						<div className="error-contents">
							<Image
								src = "/image/404-error.png"
								alt = "404 에러 이미지"
								width={256}
								height={256}
							/>
						</div>
						<div className="error-contents">
							<h3 className="error-message">원하시는 페이지를 찾을 수 없습니다.</h3>
							<Link href="/" >
									홈 페이지로 돌아가기
							</Link>
						</div>
					</>
					: <>
						<div className="error-contents">
							<Image
								src = "/image/error.png"
								alt = "에러 이미지"
								width={256}
								height={256}
							/>
						</div>
						<div className="error-contents">
							<h3 className="error-message">{statusCode} 에러가 발생했습니다.</h3>
							<Link href="/" >
									홈 페이지로 돌아가기
							</Link>
						</div>
					</>
				}
			</Paper>
			<style jsx>{`
					.error-contents{
						text-align: center;
					}
					.error-message{
						margin: 0px 0px 5px 0px
					}
				`}</style>
		</>
	)
}

Error.getInitialProps = ({ res, err }) => {
	const statusCode = res ? res.statusCode : err ? err.statusCode : 404
	return { statusCode }
}

export default Error