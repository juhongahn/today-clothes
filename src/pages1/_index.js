import {
	Grid,
	Button,
	Paper,
	Backdrop,
	CircularProgress
} from '@mui/material';
import {
	getWeatherScript,
	getRequestURL,
	getBaseDate,
} from '../lib/weatherUtils';
import Head from 'next/head';
import { authOptions } from './api/auth/[...nextauth]';
import { getServerSession } from "next-auth/next";
import WeatherCard from '../components/WeatherCard'
import { useSession } from "next-auth/react"
import { useState, useEffect } from 'react';
import { createTheme, ThemeProvider  } from '@mui/material/styles';
import { yellow } from '@mui/material/colors';

const theme = createTheme({
	palette: {
		primary: {
			main: yellow[500],
		},
	}
});

export default function Home({ weatherData }) {
	const weatherArray = weatherData.item;
	const { data: session, status } = useSession();
	const [address, setAddress] = useState("");
	const [gptScript, setGptScript] = useState();
	const [backdrop, setBackdrop] = useState(false);

	useEffect(() => {
		if (status === 'authenticated')
			setAddress(session.address.fullAddress);
	}, [status]);

	async function handlePlay(result) {
		try {
			const response = await fetch('/api/generate-speech', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ text: result }),
			});
			if (response.status !== 200)
				throw new Error("오디오를 재생 중 문제가 생겼습니다.");
			const audioData = await response.arrayBuffer();
			const audioContext = new AudioContext();
			const audioBuffer = await audioContext.decodeAudioData(audioData);
			const audioSource = audioContext.createBufferSource();
			audioSource.buffer = audioBuffer;
			audioSource.connect(audioContext.destination);
			audioSource.start(0);
		} catch (error) {
			alert(error.message);
		}
	};

	async function generate() {
		setBackdrop(true);
		const script = getWeatherScript(weatherArray);
		try {
			const response = await fetch("/api/generate", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ sentence: script }),
			});
			const { result } = await response.json();
			if (response.status !== 200) {
				throw new Error(`요청 중 문제가 발생했습니다.`);
			}
			setBackdrop(false);
			setGptScript(result);
			handlePlay(result);
		} catch (error) {
			setBackdrop(false);
			alert(error.message);
		}
	}

	return (
		<div>
			<Head>
				<title>오늘의 옷</title>
			</Head>
			{status === 'authenticated' && 
				weatherArray.length > 0 &&
				<WeatherCard address={address} weather={weatherArray} />}
			<div>
				<Backdrop
					sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
					open={backdrop}
				>
					<CircularProgress color="inherit" />
				</Backdrop>
			</div>
			<Grid container>
				<Grid item xs={12} md={12} mt={2}>
					<ThemeProvider theme={theme}>
						<Button
							variant="contained"
							fullWidth
							onClick={generate}
							size='large'
							sx={{
								fontSize: '1.2rem',
								fontWeight: 'bold',
								borderRadius: '10px',
								color: 'white',
							}}
						>
							오늘의 옷 보기
						</Button>
					</ThemeProvider>
				</Grid>
			</Grid>
			{gptScript &&
				<Paper
					elevation={6}
					sx={{
						margin: '20px 0 20px 0',
						background: '#F1ECE9',
						wordBreak: 'break-word',
						padding: '10px 20px 20px 20px',
						borderRadius: '8px',
						lineHeight: '1.5rem'
					}}>

					<p>오늘의 옷: </p>
					{gptScript}
				</Paper>
			}
			<style jsx>{`
				p {
					font-weight: bold;
					font-size: 0.9rem;
				}
				`}</style>
		</div>
	)
}


export async function getServerSideProps(context) {
	const weatherUrl = process.env.WEATHER_URL;
	const session = await getServerSession(context.req, context.res, authOptions);
	const baseDate = getBaseDate();
	const encodedQureyUrl = weatherUrl + '?' + getRequestURL(session.address.x, session.address.y, baseDate);
	const response = await fetch(encodedQureyUrl, {
		method: "GET",
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
	})

	if (response.ok) {
		const data = await response.json();
		const result = data.response.body.items;
		return {
			props: {
				weatherData: result,
			}
		}
	} else {
		// getServerSideProps 안에서 던진 에러는 500.js 페이지 또는 _error.js 컴포넌트를 불러온다.
		throw new Error("날씨 데이터를 가져오는데 문제가 발생했습니다.");
	}

}

