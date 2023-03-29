import connectMongo from '../../../database/conn';
import Users from '../../../model/Schema';

export default async function handler(req, res) {
    connectMongo().catch(error => res.json({ error: `Connection Failed...! ${error}` }))
    const url = process.env.NEXT_PUBLIC_WEATHER_URL;

    if (req.method === 'POST') {
        const data = req.body;
        //if (!data) return res.status(404).json({ error: "Don't have form data...!" });
        const { email } = data;

        //유저 찾고.
        const user = await Users.findOne({ email: email });
        if (!user) return res.status(422).json({ message: "없는 이메일 입니다.", error: true });

        const encodedQurey = url + '?' + getRequestURL(user.address.x, user.address.y);
        await fetch(encodedQurey, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        })
            .then(res => res.json())
            .then(data => {
                data.response.body.items.item.filter(weather => weather.fcstTime === '0600')
                    .map(weather => console.log(weather))
            })
            .catch(error => console.log(error));
    }
}

function getBaseDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = ("0" + (1 + date.getMonth())).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return year + month + day;
}

function getRequestURL(x, y) {
    const serviceKey = process.env.NEXT_PUBLIC_SERVICE_KEY
    const pageNo = '1';
    const numOfRows = 50;
    const dataType = 'JSON';

    const base_date = getBaseDate();
    const base_time = '0500'
    const nx = x;
    const ny = y;
    const query = `serviceKey=${serviceKey}&pageNo=${pageNo}&numOfRows=${numOfRows}&dataType=${dataType}&base_date=${base_date}&base_time=${base_time}&nx=${nx}&ny=${ny}`;
    //const encodedQuery = encodeURIComponent(query);

    return query;
}