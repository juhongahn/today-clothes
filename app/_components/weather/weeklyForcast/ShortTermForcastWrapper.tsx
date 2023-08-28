import type { Weather } from "../../../_types/types";
import type { MidTermForcast } from "../../../api/mid-term-forcast/route";
import WeeklyForcastItem from "./WeeklyForacstItem";

interface ShortTermForcastWrapperProps {
  stForcast: {
    fcstDate: string;
    am: Weather;
    pm: Weather;
  };
}

const ShortTermForcastWrapper = ({
  stForcast,
}: ShortTermForcastWrapperProps) => {
  const mtForcast = convertShortTermForcastMidTermForast(stForcast);

  return (<></>
    // <WeeklyForcastItem
    //   mtForcast={mtForcast}
    // />
  );
};

const convertShortTermForcastMidTermForast = (stForcast: {
  fcstDate: string;
  am: Weather;
  pm: Weather;
}): MidTermForcast => {
  const mtForcast: MidTermForcast = {
    dt: stForcast.fcstDate,
    hlTemperature: {
      tmx: parseInt(stForcast.am.value.TMX),
      tmn: parseInt(stForcast.am.value.TMN),
    },
    fcst: {
      pop: {
        popAM: parseInt(stForcast.am.value.POP),
        popPM: parseInt(stForcast.pm.value.POP),
      },
      weatherForcast: {
        wfAM: convertFcstValueToWF(stForcast.am),
        wfPM: convertFcstValueToWF(stForcast.pm),
      },
    },
  };
  return mtForcast;
};

/**
    맑음
- 구름많음, 구름많고 비, 구름많고 눈, 구름많고 비/눈, 구름많고 소나기
- 흐림, 흐리고 비, 흐리고 눈, 흐리고 비/눈, 흐리고 소나기

 * 
 */

const convertFcstValueToWF = (fcstValue: Weather) => {
  const { PTY, SKY } = fcstValue.value;
  const ptyFcstVal = parseFloat(PTY);
  const skyFcstVal = parseFloat(SKY);

  // 강수형태(pty): 0: 없음, 1: 비, 2: 비/눈, 3: 눈, 4: 소나기
  // 하늘상태(sky): 1: 맑음, 3: 구름많음, 4: 흐림

  let status = "맑음";
  if (ptyFcstVal === 0 && skyFcstVal >= 1 && skyFcstVal < 3) {
    status = "맑음";
  } else if (skyFcstVal === 3) {
    if (ptyFcstVal === 0) status = "구름많음";
    else if (ptyFcstVal === 1) status = "구름많고 비";
    else if (ptyFcstVal === 2) status = "구름많고 비/눈";
    else if (ptyFcstVal === 3) status = "구름많고 눈";
    else if (ptyFcstVal === 4) status = "구름많고 소나기";
  } else if (skyFcstVal >= 4) {
    if (ptyFcstVal === 0) status = "흐림";
    else if (ptyFcstVal === 1) status = "흐리고 비";
    else if (ptyFcstVal === 2) status = "흐리고 비/눈";
    else if (ptyFcstVal === 3) status = "흐리고 눈";
    else if (ptyFcstVal === 4) status = "흐리고 소나기";
  }
  return status;
};

export default ShortTermForcastWrapper;
