import {
	Grid,
	Paper,
} from '@mui/material';
import Image from 'next/image';
import { getDayWeather } from '@/lib/weatherUtils';

function CardData({ time, tmp, pop, wsd, sky, pty }) {

	const skyFcstVal = Number(sky);
	const ptyFcstVal = Number(pty);
	const wsdFcstVal = Number(wsd);
	let _imageSrc = '';
	let _alt = '';

	if (ptyFcstVal === 0 && skyFcstVal >= 1 && skyFcstVal < 3) {
		_imageSrc = "/image/003-sunny.png";
		_alt = "맑음";
	} else if (ptyFcstVal === 0 && skyFcstVal >= 3 && skyFcstVal <= 3) {
		_imageSrc = "/image/005-cloudy.png";
		_alt = "구름 많음";

	} else if (ptyFcstVal === 0 && skyFcstVal >= 4) {
		_imageSrc = "/image/004-cloud.png"
		_alt = "흐림";
	}

	if (ptyFcstVal === 3) {
		_imageSrc = "/image/001-snow.png"
		_alt = "눈";
	} else if (ptyFcstVal === 1 || ptyFcstVal === 2 || ptyFcstVal === 4) {
		_imageSrc = "/image/002-rainy.png"
		_alt = "비";
	}

	if (ptyFcstVal === 0 && wsdFcstVal >= 5) {
		_imageSrc = "/image/006-wind.png"
		_alt = "바람 강함";
	}

	const tmpProps = {
		src: _imageSrc,
		alt: _alt,
		width: 64,
		height: 64
	}

	return (
		<div className='weather-data-container'>
			<div className='time-font '>
				{time}
			</div>
			<div className='weater-img-box'>
				<Image
					{...tmpProps}
				/>
				<div className='temperature'>
					{tmp}°
				</div>
			</div>

			<div className='font'>
				강수확률: {pop}%
			</div>
			<div className='font'>
				풍속: {wsd}m/s
			</div>

			<style jsx>{`
          .time-font{
            color: white;
            font-size: 1rem;
            font-weight: bold;
          }
          .weather-data-container{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          .temperature{
            text-align: center;
            font-size: 1.8rem;
            font-weight: bold;
          }
          .font{
            font-size: .8rem;
            font-weight: bold;
          }
        `}</style>
		</div>
	)
}

export default function WeatherCard({ weather, address }) {

	const weatherObjArray = getDayWeather(weather);
	const morningWeatherObj = weatherObjArray[0];
	const noonWeatherObj = weatherObjArray[1];
	const eveningWeatherObj = weatherObjArray[2];
	const addressArray = address.split(" ");
	return (
		<Paper
			elevation={6}
			sx={{
				border: '1px solid #77b6e6',
				backgroundColor: '#85c6f8',
				padding: '20px 0px 20px 0px',
				borderRadius: '15px',
				marginTop: '30px',
			}}>
			<div className="address-box" style={{
				textAlign: 'center',
			}}>
				{addressArray[1] + " " + addressArray[2]}
			</div>
			<Grid
				container
				spacing={{ xs: 2, md: 3 }}
				columns={{ xs: 4, sm: 4, md: 12 }}
				direction="row"
				justifyContent="center"
				alignItems="center">

				<Grid item xs={4}>
					<CardData
						time={'8시'}
						tmp={morningWeatherObj.tmp.fcstValue}
						pop={morningWeatherObj.pop.fcstValue}
						wsd={morningWeatherObj.wsd.fcstValue}
						sky={morningWeatherObj.sky.fcstValue}
						pty={morningWeatherObj.pty.fcstValue}
					/>
				</Grid>
				<Grid item xs={4}>
					<CardData
						time={'13시'}
						tmp={noonWeatherObj.tmp.fcstValue}
						pop={noonWeatherObj.pop.fcstValue}
						wsd={noonWeatherObj.wsd.fcstValue}
						sky={noonWeatherObj.sky.fcstValue}
						pty={noonWeatherObj.pty.fcstValue}

					/>
				</Grid>
				<Grid item xs={4}>
					<CardData
						time={'18시'}
						tmp={eveningWeatherObj.tmp.fcstValue}
						pop={eveningWeatherObj.pop.fcstValue}
						wsd={eveningWeatherObj.wsd.fcstValue}
						sky={eveningWeatherObj.sky.fcstValue}
						pty={eveningWeatherObj.pty.fcstValue}
					/>
				</Grid>
			</Grid>
			<style jsx>{`
        .address-box{
          text-align: center;
          font-size: 1.2rem;
          font-weight: bold;
          color: white;
          margin-bottom: 20px; 
        }
        `}</style>
		</Paper>
	);
}