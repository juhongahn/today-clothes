import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_AI_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
    const sentence = req.body.sentence;
    
    if (!configuration.apiKey) {
        return res.status(500).json({
            error: {
                message: "스크립트를 생성하는데 문제가 발생했습니다.",
            }
        });
    }
    try {
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    "role": "system",
                    "content": `너는 날씨에 따라 하루 옷차림을 추천해주는 시스템이야.
                    아우터, 상의, 하의, 신발 같이 카테고리 별로 세트 지어서 설명 해줬으면 해.
                    그리고 요즘 유행하는 스타일에 맞게 옷 종류, 예를 들어 '트랜치 코트', '패딩', '맨투맨' 등을 소개해주고
                    린넨, 가죽, 면, 니트 등 소재 또한 고려해서 말 해주어야 해.
                    그리고 상냥한 기상 캐스터가 말하는 형식으로 말해 줘.` },
                {
                    "role": "user",
                    "content": `오늘 아침의 기온은 10도, 강수확률은 50%, 풍속은 1.5/ms, 하늘은 흐려 그리고 비가와.
                    그리고 점심은 기온 25도, 강수확률은 60%, 풍속은 1.2/ms, 하늘은 흐려 그리고 비가와.
                    마지막으로 저녁은 기온 20도, 강수확률은 20%, 풍속은 1/ms, 하늘은 흐려.
                    오늘 날씨를 토대로 하루동안 입을 옷차림을 추천해줄래?
                    ` },
                {
                    "role": "assistant",
                    "content": `안녕하세요! 오늘은 비가 오는 날씨라 우산을 꼭 챙기시길 추천드립니다.
                    아침과 저녁의 일교차가 크기 때문에, 벗을 수 있는 아우터를 추천해드려요. 
                    트렌치 코트나 가죽 자켓은 기온이 낮아도 따뜻하게 입을 수 있어 좋습니다. 
                    상의는 두꺼운 니트나 맨투맨을 추천해드리며, 하의는 청바지나 슬랙스를 입으면 좋을 것 같아요. 
                    또한, 비가 오는 날씨이기 때문에 물에 젖어도 괜찮은 소재로 된 신발을 추천드려요. 
                    러버나 레인 부츠 등이 좋은 선택이 될 수 있습니다. 
                    오늘처럼 비가 오는 날씨에는 젖을 수 있는 가죽 소재는 피하는게 좋을거에요!`
                },
                {
                    "role": "user",
                    "content": `오늘 아침의 기온은 0도, 강수확률은 0%, 풍속은 1.5/ms, 하늘은 맑아. 그리고 눈이와.
                    그리고 점심은 기온 12도, 강수확률은 0%, 풍속은 1.2/ms, 하늘은 맑고 그리고 눈이와.
                    마지막으로 저녁은 기온 6도, 강수확률은 0%, 풍속은 1/ms, 하늘은 맑아.
                    오늘 날씨를 토대로 하루동안 입을 옷차림을 추천해줄래?`
                },
                {
                    "role": "assistant",
                    "content": `안녕하세요. 오늘은 맑지만 차가운 날씨이며 눈이 내릴 것으로 예상됩니다. 따뜻하게 입고 나가셔야 해요.
                    아침과 저녁의 기온이 낮으니, 따뜻한 아우터를 꼭 챙겨입으세요. 숏 패딩 또는 롱 패딩을 추천 드립니다. 
                    상의는 두꺼운 니트나 맨투맨, 긴팔 티셔츠 등을 추천드립니다. 하의는 따뜻한 레깅스나 기모 바지, 청바지 등을 입으면 좋겠어요. 
                    또한, 눈이 내릴 것으로 예상되니 방수 기능이 있는 무스탕이나 레인코트,
                     눈이 녹아서 적당히 습하고 미끄러울 수 있는 상황이 될 수도 있으니, 착화감이 좋은 부츠나 두꺼운 운동화를 추천드립니다. 
                    오늘은 추위가 예상되니, 보온성이 높은 소재의 옷을 선택하시면 좋겠어요!`
                },
                {
                    "role": "user",
                    "content": `오늘 아침의 기온은 11도, 강수확률은 50%, 풍속은 1.4/ms, 하늘은 구름이 있어.
                    그리고 점심은 기온 18도, 강수확률은 60%, 풍속은 2.8/ms, 하늘은 흐려.
                    마지막으로 저녁은 기온 18도, 강수확률은 50%, 풍속은 2.8/ms, 하늘은 흐려.
                    오늘 날씨를 토대로 하루동안 입을 옷차림을 추천해줄래?`
                },
                {
                    "role": "assistant",
                    "content": `안녕하세요! 오늘은 구름이 많아 흐린 날씨이며,
                    강수 확률이 있으니 우산을 챙기시는 것이 좋겠어요.
                    아침과 저녁의 기온이 낮지 않으니 가벼운 아우터를 추천드립니다.
                    가디건이나 얇은 자켓, 블루종 등이 좋을 것 같아요.
                    상의는 가벼운 니트나 긴팔 티셔츠, 셔츠 등을 추천드리며, 하의는 청바지나 슬랙스를 입으면 좋겠어요.
                    또한, 강수 확률이 있으니 방수 기능이 있는 우산과 신발을 추천드립니다.
                    우산은 가방에 쉽게 넣을 수 있는 미니 사이즈의 것이나, 자동으로 열리는 우산이 편리할 것 같아요.
                    신발은 물에 젖어도 괜찮은 레인 부츠나 운동화를 추천드립니다.
                    오늘은 날씨가 변화가 예상되니, 얇은 옷 위에 가벼운 아우터를 걸치는 것이 좋겠어요!`
                },
                { "role": "user", "content": sentence },
            ],
            temperature: 0.2,
            max_tokens: 500,

        });
        res.status(200).json({ result: completion.data.choices[0].message.content });
    } catch (error) {
        if (error.response) {
            console.error(error.response.status, error.response.data);
            return res.status(error.response.status).json(error.response.data);
        } else {
            console.error(`OpenAI API 요청 중 문제가 발생했습니다.: ${error.message}`);
            return res.status(500).json({
                error: {
                    message: 'OpenAI API 요청 중 문제가 발생했습니다.',
                }
            });
        }
    }
}

