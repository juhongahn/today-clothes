export function getDayWeather(weatherArray) {

    const morningWeatherArray =
        weatherArray.filter(weather => weather.fcstTime === '0800');
    const noonWeatherArray =
        weatherArray.filter(weather => weather.fcstTime === '1300');
    const eveningWeatherArray =
        weatherArray.filter(weather => weather.fcstTime === '1800');

    /**
     * 시간 당 필요한 날씨 정보
     * 기온, 강수확률, 풍속, 구름, 적설량
     * TMP, POP, WSD, SKY, SNO
     */
    const {
        TMPObj: mTMPObj,
        POPObj: mPOPObj,
        WSDObj: mWSDObj,
        SKYObj: mSKYObj,
        SNOObj: mSNOObj,
        PTYObj: mPTYObj,
    } = getWeatherCodeObj(morningWeatherArray);

    const {
        TMPObj: nTMPObj,
        POPObj: nPOPObj,
        WSDObj: nWSDObj,
        SKYObj: nSKYObj,
        SNOObj: nSNOObj,
        PTYObj: nPTYObj,
    } = getWeatherCodeObj(noonWeatherArray);

    const {
        TMPObj: eTMPObj,
        POPObj: ePOPObj,
        WSDObj: eWSDObj,
        SKYObj: eSKYObj,
        SNOObj: eSNOObj,
        PTYObj: ePTYObj,
    } = getWeatherCodeObj(eveningWeatherArray);

    const mWeatherObj = {
        tmp: mTMPObj,
        pop: mPOPObj,
        wsd: mWSDObj,
        sky: mSKYObj,
        sno: mSNOObj,
        pty: mPTYObj,
    }
    const nWeatherObj = {
        tmp: nTMPObj,
        pop: nPOPObj,
        wsd: nWSDObj,
        sky: nSKYObj,
        pty: nPTYObj,
        sno: nSNOObj,
    }
    const eWeatherObj = {
        tmp: eTMPObj,
        pop: ePOPObj,
        wsd: eWSDObj,
        sky: eSKYObj,
        pty: ePTYObj,
        sno: eSNOObj,
    }
    return new Array(mWeatherObj, nWeatherObj, eWeatherObj);
}

export function getCurrentWeather(weatherArray) {
    const currentHour = new Date().getHours();
    const currentWeatherArray = weatherArray.filter(weather => Number(weather.fcstTime.substr(0, 2)) === currentHour)

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
    const weatherObjArray = getDayWeather(weatherArray);
    const morningWeatherObj = weatherObjArray[0];
    const noonWeatherObj = weatherObjArray[1];
    const eveningWeatherObj = weatherObjArray[2];

    
    /**
     * 평균 강수확률, 적설량 구한는 로직
     */
    // get WSD avg 
    // let wsdCount = 0;
    // let avgWSD = 0;

    // const sumWSD = wsdArray.map(weather => {
    //     if (weather.fcstValue > 0) {
    //         wsdCount++;
    //         return weather.fcstValue
    //     }
    // }).reduce((sum, currValue) => Number(sum) + Number(currValue));
    // if (wsdCount > 0) {
    //     avgWSD = Math.round(sumWSD / wsdCount * 10) / 10;
    // }

    // // get sno avg
    // let snoCount = 0;

    // const avgSNO = snoArray.filter(weather => typeof weather.fcstValue !== 'string').map(weather => {
    //     snoCount++;
    //     return weather.fcstValue;
    // }).length === 0 ? 0 : Math.round((snoArray.filter(weather => typeof weather.fcstValue !== 'string').map(weather => {
    //     snoCount++;
    //     return weather.fcstValue;
    // }).reduce((sum, currValue) => Number(sum) + Number(currValue)) / snoCount) * 10) / 10;

    // const POP = popArray.find(weather => weather.fcstValue > 0) === undefined ? 0 : popArray.find(weather => weather.fcstValue > 0).fcstValue;
    // const TMN = weatherArray.find(weather => weather.category === 'TMN').fcstValue;
    // const TMX = weatherArray.find(weather => weather.category === 'TMX').fcstValue;

    const scriptWeatherData = {
        result: [
            { morning: morningWeatherObj },
            { noon: noonWeatherObj },
            { evening: eveningWeatherObj },
        ]
    }

    const script = makeScript(scriptWeatherData);
    return script;
}

function makeScript(weatherData) {
    const { result } = weatherData;
    /**
     * 시간 당 필요한 날씨 정보
     * 기온, 강수확률, 풍속, 구름, 적설량
     * TMP, POP, WSD, SKY, SNO
     */

    // 08시
    const {
        TMP: mTMP,
        POP: mPOP,
        WSD: mWSD,
        SKY: mSKY,
        PTY: mPTY,
    } = getWeatherCodeFcstValueObj(result[0].morning);

    // 13시
    const {
        TMP: nTMP,
        POP: nPOP,
        WSD: nWSD,
        SKY: nSKY,
        PTY: nPTY,
    } = getWeatherCodeFcstValueObj(result[1].noon);

    // 18시
    const {
        TMP: eTMP,
        POP: ePOP,
        WSD: eWSD,
        SKY: eSKY,
        PTY: ePTY,
    } = getWeatherCodeFcstValueObj(result[2].evening);

    /**
     * 필요한 날씨 정보
     * 기온, 강수확률, 풍속, 구름, 적설량
     * TMP, POP, WSD, SKY, SNO
     */
    const script = 
        `오늘 아침의 기온은 ${mTMP}도, 강수확률은 ${mPOP}%, 풍속은 ${mWSD}/ms, 하늘은 ${convertSkyCodeToStr(mSKY)} ${convertPtyCodeToStr(mPTY)}
        그리고 점심은 기온 ${nTMP}도, 강수확률은 ${nPOP}%, 풍속은 ${nWSD}/ms, 하늘은 ${convertSkyCodeToStr(nSKY)} ${convertPtyCodeToStr(nPTY)}
        저녁은 기온 ${eTMP}도, 강수확률은 ${ePOP}%, 풍속은 ${eWSD}/ms, 하늘은 ${convertSkyCodeToStr(eSKY)} ${convertPtyCodeToStr(ePTY)}.
        오늘 날씨를 토대로 하루동안 입을 옷차림을 추천해줄래?`
    return script;
}

function getWeatherCodeFcstValueObj(weatherObj) {
    return {
        TMP: weatherObj.tmp.fcstValue,
        POP: weatherObj.pop.fcstValue,
        WSD: weatherObj.wsd.fcstValue,
        SKY: weatherObj.sky.fcstValue,
        PTY: weatherObj.pty.fcstValue,
    }
}


function getWeatherCodeObj(weatherArray) {
    return {
        TMPObj: weatherArray.find(weather => weather.category === 'TMP'),
        POPObj: weatherArray.find(weather => weather.category === 'POP'),
        WSDObj: weatherArray.find(weather => weather.category === 'WSD'),
        SKYObj: weatherArray.find(weather => weather.category === 'SKY'),
        SNOObj: weatherArray.find(weather => weather.category === 'SNO'),
        PTYObj: weatherArray.find(weather => weather.category === 'PTY'),
    }
}

function convertSkyCodeToStr(skyFcstVal) {
    if (skyFcstVal == 0 || skyFcstVal == 1)
        return '맑아';
    else if (skyFcstVal == 2 || skyFcstVal == 3)
        return '구름이 많아';
    else {
        return '흐려';
    }
}

function convertPtyCodeToStr(ptyFcstVal) {
    if (ptyFcstVal == 1 || ptyFcstVal == 2 || ptyFcstVal == 4)
        return '그리고 비가와';
    else if (ptyFcstVal == 3)
        return '그리고 눈이와'
    else if (ptyFcstVal == 0)
        return '';
        
}


/**
 * 오늘 yyyymmdd 반환하는 함수 
 * @returns '20230330'
 */
export function getBaseDate() {
    let date = new Date();
    const hours = date.getHours();
    if (hours < 2) {    // 02시 이전 이라면 전날 02시 자료를 사용해야한다. 
        date.setDate(date.getDate() - 1)
    }
    
    let year = date.getFullYear();
    let month = ("0" + (1 + date.getMonth())).slice(-2);
    let day = ("0" + date.getDate()).slice(-2);
    return year + month + day;
}

/**
 * @param {위도} x 
 * @param {경도} y 
 * @returns 단기예보 api 요청 주소 반환
 */
export function getRequestURL(x, y, baseDate) {
    const serviceKey = process.env.SERVICE_KEY
    const pageNo = 1;
    const numOfRows = 500;
    const dataType = 'JSON';

    const base_date = baseDate;
    // 현재 시간에 가까운 예보 시간을 찾아서 넣어주자.
    const base_time = getNearPredictionTime();
    const nx = x;
    const ny = y;
    const query = `serviceKey=${serviceKey}&pageNo=${pageNo}&numOfRows=${numOfRows}&dataType=${dataType}&base_date=${base_date}&base_time=${base_time}&nx=${nx}&ny=${ny}`;

    return query;
}

/**
 * 
 * @returns baseTime (Str)
 */
function getNearPredictionTime() {
    let date = new Date();
    const hours = date.getHours();

    let nearTime = '0200'; // 디폴트로 02시

    // Base_time : 0200, 0500, 0800, 1100, 1400, 1700, 2000, 2300 (1일 8회)
    if (hours >= 2 && hours < 5) {
        nearTime = '0200';
    } else if (hours < 8) {
        nearTime = '0500';
    } else if (hours < 11) {
        nearTime = '0800';
    } else if (hours < 14) {
        nearTime = '1100';
    } else if (hours < 17) {
        nearTime = '1400';
    } else if (hours < 20) {
        nearTime = '1700';
    } else if (hours < 23) {
        nearTime = '2000';
    } else {
        nearTime = '2300';
    }

    return nearTime;
}