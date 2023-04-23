import connectMongo from '../../../database/conn';
import Users from '../../../model/Schema';

const weatherUrl = process.env.WEATHER_URL;

export default async function handler(req, res) {

    connectMongo().catch(error => res.json({
        error: {
            message: `DB 연결에 실패했습니다`
        }
    }));

    if (req.method === 'POST') {
        const data = req.body;
        if (!data) return res.status(401).json({
            error: {
                message: "요청 권한이 없습니다"
            }
        });

        const { email } = data;
        const baseDate = getBaseDate();

        const user = await Users.findOne({ email: email });
        if (!user) return res.status(422).json({
            error: {
                message: "존재하지 않는 유저 입니다"
            }
        });

        const encodedQureyUrl = weatherUrl + '?' + getRequestURL(user.address.x, user.address.y, baseDate);
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
            // const todayWeatherArray = data.response.body.items.item
            //     .filter(weather => weather.fcstDate === baseDate);
            
            // const weatherData = getWeatherData(todayWeatherArray);
            res.status(200).json({
                data: result,
            });
        } else {
            const { error } = await response.json();
            res.status(500).json({
                error: {
                    message: '데이터를 요청하는데 실패 했습니다'
                }
            })
        }
    } else {
        res.status(500).json({
            error: {
                message: "HTTP method not vaild only POST Accepted"
            }
        })
    }
}

function getWeatherData(todayWeatherArray) {

    // 최고기온
    let TMX = todayWeatherArray.find(element =>
        element.category === 'TMX'
    ).fcstValue

    // 최저기온
    let TMN = todayWeatherArray.find(element =>
        element.category === 'TMN'
    ).fcstValue;

    // 강수확률
    let POP = todayWeatherArray.find(element =>
        element.category === 'POP' && element.fcstValue > 0
    )

    if (POP === undefined) {
        POP = 0;
    } else {
        POP = POP.fcstValue;
    }

    return {
        TMN: Number(TMN),
        TMX: Number(TMX),
        POP: Number(POP)
    }
}

/**
 * 오늘 yyyymmdd 반환하는 함수 
 * @returns '20230330'
 */
function getBaseDate() {
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
function getRequestURL(x, y, baseDate) {
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