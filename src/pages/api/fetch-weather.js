import connectMongo from '../../../database/conn';
import Users from '../../../model/Schema';

const weatherUrl = process.env.WEATHER_URL;

export default async function handler(req, res) {

    connectMongo().catch(error => res.json({
        error: {
            message: `DB connetion error: ${error}`
        }
    }));

    if (req.method === 'POST') {
        const data = req.body;
        if (!data) return res.status(404).json({
            error: {
                message: "Don't have form data"
            }
        });

        const { email } = data;
        const baseDate = getBaseDate();

        const user = await Users.findOne({ email: email });
        if (!user) return res.status(422).json({
            error: {
                message: "Not existing User"
            }
        });

        const encodedQurey = weatherUrl + '?' + getRequestURL(user.address.x, user.address.y, baseDate);
        const todayWeatherArray = await fetch(encodedQurey, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        })
            .then(res => res.json())
            .then(data => {
                const todayWeatherArray = data.response.body.items.item
                    .filter(weather => weather.fcstDate === baseDate);
                return todayWeatherArray;
            })
            .catch(error => res.status(500).json({
                error: {
                    message: `Error occured: ${error}`
                }
            }));

        const weatherData = getWeatherData(todayWeatherArray);
        res.status(200).json({
            result: weatherData,
        })

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
    );

    if (TMN === undefined) {
        const fcstValArray = todayWeatherArray
            .filter(weather => weather.category === 'TMP')
            .map(weather => {
                return weather.fcstValue;
            });
        TMN = Math.min.apply(null, fcstValArray);
    } else {
        TMN = TMN.fcstValue;
    }

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
 * 오늘 기준 yyyymmdd 반환하는 함수 
 * @returns '20230330'
 */
function getBaseDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = ("0" + (1 + date.getMonth())).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
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
    const base_time = '0500'
    const nx = x;
    const ny = y;
    const query = `serviceKey=${serviceKey}&pageNo=${pageNo}&numOfRows=${numOfRows}&dataType=${dataType}&base_date=${base_date}&base_time=${base_time}&nx=${nx}&ny=${ny}`;

    return query;
}