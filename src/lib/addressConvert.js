import { dfs_xy_conv } from './gridConverter';

const url = "https://dapi.kakao.com/v2/local/search/address.json?analyze_type=similar&page=1&size=10&";

export async function convertAddress(fullAddress) {
    let xy;
    const query = fullAddress;
    const encodedQuery = encodeURIComponent(query).replace(/\(/g, '%28').replace(/\)/g, '%29');
    const options = {
        method: "GET",
        headers: {
            "Authorization": `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_ADDRESS_KEY}`,
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        },
    };

    await fetch(`${url}query=${encodedQuery}`, options)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const { documents } = data;
            xy = dfs_xy_conv('toXY', documents[0].road_address.y, documents[0].road_address.x)
        })
        .catch(error => console.error(error));
    return xy;
}