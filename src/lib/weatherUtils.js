export function getCurrentWeather(weatherArray) {
    const currentHour = new Date().getHours();
    const currentWeatherArray = weatherArray.filter(weather => Number(weather.fcstTime.substr(0,2)) === currentHour)

    const skyObj = currentWeatherArray.find(weather => weather.category === 'SKY')
    const pcpObj = currentWeatherArray.find(weather => weather.category === 'PCP')
    const snoObj = currentWeatherArray.find(weather => weather.category === 'SNO')
    const tmpObj = currentWeatherArray.find(weather => weather.category === 'TMP')
    const wsdObj = currentWeatherArray.find(weather => weather.category === 'WSD')

    const curWeatherObj = {
        sky: skyObj,
        pop: pcpObj,
        sno: snoObj,
        tmp: tmpObj,
        wsd: wsdObj,
    }
    
    return curWeatherObj;
}

export function getWeatherScript(weatherArray) {

    const wsdArray = weatherArray.filter(weather => weather.category === 'WSD');
    const snoArray = weatherArray.filter(weather => weather.category === 'SNO');
    const popArray = weatherArray.filter(weather => weather.category === 'POP');
    
    // get WSD avg
    let wsdCount = 0;
    let avgWSD = 0;

    const sumWSD = wsdArray.map(weather => {
        if (weather.fcstValue > 0) {
        wsdCount++;
        return weather.fcstValue
        }
    }).reduce((sum, currValue) => Number(sum) + Number(currValue));
    if (wsdCount > 0) {
        avgWSD = Math.round(sumWSD / wsdCount * 10) / 10;
    }

    // get sno avg
    let snoCount = 0;

    const avgSNO = snoArray.filter(weather => typeof weather.fcstValue !== 'string').map(weather => {
        snoCount++;
        return weather.fcstValue;
    }).length === 0 ? 0 : Math.round((snoArray.filter(weather => typeof weather.fcstValue !== 'string').map(weather => {
        snoCount++;
        return weather.fcstValue;
    }).reduce((sum, currValue) => Number(sum) + Number(currValue)) / snoCount) * 10) / 10;

    const POP = popArray.find(weather => weather.fcstValue > 0) === undefined ? 0 : popArray.find(weather => weather.fcstValue > 0).fcstValue;
    const TMN = weatherArray.find(weather => weather.category === 'TMN').fcstValue;
    const TMX = weatherArray.find(weather => weather.category === 'TMX').fcstValue;

    const scriptWeatherData = {

        result: {
        WSD: avgWSD,
        SNO: avgSNO,
        POP: POP,
        TMN: TMN,
        TMX: TMX
        }
    }
    
    const script = makeScript(scriptWeatherData)
    return script;
}

function makeScript(weatherData) {

    const { result } = weatherData;
    const script = `오늘 하루 최고 기온은 ${result.TMX}도, 최저 기온은 ${result.TMN}도야. 평균 풍속은 ${result.WSD}/ms이고 하루 중
    강수 확률은 ${result.POP}%야. 그리고 평균 적설량은 ${result.SNO}야. 
    이 날씨에 맞게 하루 동안 입을 옷차림을 추천해줘. 설명 할 땐, '트렌치 코트', '울 코트' 처럼 옷의 종류로 설명해줬으면 좋겠고, '린넨, 가죽, 데님, 등등 '날씨에 어울리는 옷의 소재 또한 설명해줬으면 좋겠어.
    `;
    return script;
  }




