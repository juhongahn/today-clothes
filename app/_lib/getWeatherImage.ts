import type { RISESET, WEATHER } from "../_types/types";

const getWeatherImage = (
  selectedWeather: WEATHER,
  selectedRiseset: RISESET[],
  width: number,
  height: number
): { src: string; alt: string; width: number; height: number } => {
  const sunsetHour = parseInt(selectedRiseset[0].sunset.substring(0, 2));
  const sunRiseHour = parseInt(selectedRiseset[1].sunrise.substring(0, 2));
  const selectedDate = new Date(selectedWeather.dt);
  const selectedHour = selectedDate.getHours();
  const { WSD, SKY, PTY } = selectedWeather.value;
  const skyFcstVal = parseInt(SKY);
  const ptyFcstVal = parseInt(PTY);
  const wsdFcstVal = parseInt(WSD);

  let _imageSrc = "";
  let _alt = "";

  // 강수형태(pty): 0: 없음, 1: 비, 2: 비/눈, 3: 눈, 4: 소나기
  // 하늘상태(sky): 1: 맑음, 3: 구름많음, 4: 흐림
  if (ptyFcstVal === 0 && skyFcstVal >= 1 && skyFcstVal < 3) {
    if (selectedHour <= sunsetHour && selectedHour > sunRiseHour)
      _imageSrc = "/statics/images/003-sunny.png";
    else _imageSrc = "/statics/images/009-moon.png";
    _alt = "맑음";
  } else if (ptyFcstVal === 0 && skyFcstVal === 3) {
    if (selectedHour <= sunsetHour && selectedHour > sunRiseHour) {
      _imageSrc = "/statics/images/004-cloud.png";
    } else {
      _imageSrc = "/statics/images/008-night-cloud.png";
    }
    _alt = "구름 많음";
  } else if (ptyFcstVal === 0 && skyFcstVal >= 4) {
    _imageSrc = "/statics/images/005-cloudy.png";
    _alt = "흐림";
  }

  if (ptyFcstVal === 3) {
    _imageSrc = "/statics/images/001-snow.png";
    _alt = "눈";
  } else if (ptyFcstVal === 1 || ptyFcstVal === 2 || ptyFcstVal === 4) {
    _imageSrc = "/statics/images/002-rainy.png";
    _alt = "비";
  }

  if (ptyFcstVal === 0 && wsdFcstVal >= 5) {
    _imageSrc = "/statics/images/006-windy.png";
    _alt = "바람 강함";
  }

  const imgProperty = {
    src: _imageSrc,
    alt: _alt,
    width,
    height,
  };
  return imgProperty;
};

export default getWeatherImage;
