import { authOptions } from '../pages/api/auth/[...nextauth]';
import { getServerSession } from "next-auth/next";
import { getWeatherScript } from '../lib/weatherUtils';
import Head from 'next/head';
import {
	Grid,
	Button,
	Paper,
	Backdrop,
	CircularProgress
} from '@mui/material';
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

export default function Home() {
	const { data: session, status } = useSession();
	const [address, setAddress] = useState("");
	//const weatherArray = weatherData.item;
	const [weatherArray, setWeatherArray] = useState([]);
	const [gptScript, setGptScript] = useState();
	const [backdrop, setBackdrop] = useState(false);

	useEffect(() => {
		if (status === 'authenticated') {
			const fetchWeather = async () => {
				setAddress(session.address);
				if (status === 'authenticated') { 
					console.log(status)
					const options = {
						method: "POST",
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ email: session.user.email })
					}
					const response = await fetch('/api/weather', options);
					const { data } = await response.json();
					setWeatherArray(data.item);
				}
			}
			fetchWeather();
		}
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

			const audioData = await response.arrayBuffer();
			const audioContext = new AudioContext();
			const audioBuffer = await audioContext.decodeAudioData(audioData);
			const audioSource = audioContext.createBufferSource();
			audioSource.buffer = audioBuffer;
			audioSource.connect(audioContext.destination);
			audioSource.start(0);
		} catch (error) {
			console.error(error);
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
				throw data.error || new Error(`Request failed with status ${response.status}`);
			}
			setBackdrop(false);
			setGptScript(result);
			handlePlay(result);
		} catch (error) {
			
			console.error(error);
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

				{/* <Grid item xs={6}>
					<Link href="/my-closet">옷장</Link>
					</Grid>
					<Grid item xs={6}>
					<div>asdas</div>
					</Grid> */}

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
	const session = await getServerSession(context.req, context.res, authOptions)
	const url = process.env.WEATHER_REQ_URL +"/api/weather";
	const options = {
		method: "POST",
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email: session.user.email })
	}
	const response = await fetch(url, options);
	const { data } = await response.json();
	return {
		props: {
			weatherData: data,
		}
	}

}

