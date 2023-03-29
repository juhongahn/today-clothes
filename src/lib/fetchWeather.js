import Users from "../../model/Schema"

export default async function fetchWeather(email) {

    connectMongo().catch(error => res.json({ error: `Connection Failed...! ${error}` }));

    const user = await Users.findOne({ email });

    console.log(user);
}