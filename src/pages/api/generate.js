import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_AI_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(
    req,
    res
) {
    if (!configuration.apiKey) {
        return res.status(500).json({
            error: {
                message: "OpenAI API key not configured, please follow instructions in README.md",
            }
        });
    }

    const sentence = req.body.sentence;

    try {
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                { "role": "system", "content": `너는 날씨에 따라 하루 옷차림을 추천해주는 시스템이야.
                아우터, 상의, 하의, 신발 같이 카테고리 별로 세트 지어서 설명 해줬으면 해. 그리고  요즘 유행하는 스타일에 맞게 옷 종류, 예를 들어 '트랜치 코트', '패딩', '맨투맨' 등을 소개해주고 린넨, 가죽, 면, 니트 등 소재 또한 고려해서 말 해주어야 해.
                그리고 상냥한 기상 캐스터가 말하는 형식으로 말해 줘.` },
                { "role": "user", "content": `오늘 하루 최고 기온은 32도, 최저 기온은 20도야. 평균 풍속은 1.5/ms 이고 하루 중 강수 확률은 20%야. 그리고 적설량은 0cm야.
                이 날씨에 맞게 하루 동안 입을 옷차림을 추천해줘.
                트렌치 코트, 울 코트 등 옷의 종류에 맞게 설명해줬으면 좋겠고, 날씨에 어울리는 옷의 소재 또한 설명해줬으면 좋겠어.` },
                { "role": "assistant", "content": `안녕하세요! 오늘은 기온이 높아서 가벼운 옷차림이 좋겠네요.
                상의는 면 소재의 반팔 티셔츠나 린넨 셔츠가 좋겠어요. 하의는 면 소재의 반바지나 면 또는 린넨 소재의 바지가 시원하게 입을 수 있을 거예요. 
                신발은 스니커즈나 샌들이 어울리며, 액세서리는 모자나 선글라스를 착용하면 좋겠네요. 
                그리고 비가 올 수 있으니 우산을 챙기면 좋을 것 같아요. 이렇게 입으면 오늘 하루 쾌적하게 보낼 수 있을 거예요!` }, 
                {"role": "user", "content": `오늘 하루 최고 기온은 11도, 최저 기온은 -1도야. 평균 풍속은 0/ms 이고 하루 중 강수 확률은 0%야. 그리고 적설량은 1cm야.
                이 날씨에 맞게 하루 동안 입을 옷차림을 추천해줘.
                '트렌치 코트', '울 코트' 처럼 옷의 종류로 설명해줬으면 좋겠고, 날씨에 어울리는 옷의 소재 또한 설명해줬으면 좋겠어.`},
                {"role": "assistant", "content": `안녕하세요! 오늘은 날씨가 매우 추워요. 따뜻하게 입을 수 있는 옷차림을 추천드릴게요.
                아우터는 울 소재의 코트나 패딩, 두꺼운 가죽 재킷 등이 좋겠어요. 상의는 기모나 니트 소재의 맨투맨, 스웨터 등이 따뜻하게 입을 수 있을 거예요. 하의는 기모나 두꺼운 청바지, 레깅스 등이 좋겠어요. 
                신발은 부츠나 단화 등 따뜻한 신발을 추천드리며, 액세서리는 목도리나 장갑 등을 착용하시면 좋을 것 같아요. 
                적설량이 1cm이라면 눈길이 녹기 전에 나가시는 걸 추천드려요. 이렇게 입으면 추운 날씨에도 따뜻하게 보낼 수 있을 거예요!`},
                {"role": "user", "content":sentence},
            ],
            temperature: 0.1,
            max_tokens: 500,

        });

        //console.log(completion.data.choices[0].message.content);
        res.status(200).json({ result: completion.data.choices[0].message.content });
    } catch (error) {
        // Consider adjusting the error handling logic for your use case
        if (error.response) {
            console.error(error.response.status, error.response.data);
            return res.status(error.response.status).json(error.response.data);
        } else {
            console.error(`Error with OpenAI API request: ${error.message}`);
            return res.status(500).json({
                error: {
                    message: 'An error occurred during your request.',
                }
            });
        }
    }
}

function generatePrompt(animal) {
    const capitalizedAnimal =
        animal[0].toUpperCase() + animal.slice(1).toLowerCase();
    return `Suggest three names for an animal that is a superhero.

Animal: Cat
Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
Animal: Dog
Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
Animal: ${capitalizedAnimal}
Names:`;
}
