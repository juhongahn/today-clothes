import { ChatGPTMessage } from "./openaiStream";
import { gptPrompts } from "../_helpers/constants/chatGPT-prompt";

export type PromptsType = {
  tmp: string;
  reh: string;
  wsd: string;
  uv: string;
  pm: string;
  pop: string;
  tmn: string;
  tmx: string;
  gender: string;
  color: string;
};

const createPrompts = (promptInput: PromptsType): string => {
  const { tmp, reh, wsd, uv, pm, pop, tmn, tmx, gender, color } = promptInput;
  let personalColor = "";
  switch (color) {
    case "springWarm":
      personalColor = "봄 웜톤";
      break;
    case "summerCool":
      personalColor = "여름 쿨톤";
      break;
    case "fallWarm":
      personalColor = "가을 웜톤";
      break;
    case "winterCool":
      personalColor = "겨울 쿨톤";
      break;
    default:
      break;
  }
  const prompt = `
    기온(℃): ${tmp}
    습도(%): ${reh}
    풍속(m/s): ${wsd}
    자외선 지수(UV index): ${uv}
    미세먼지 농도(μg/m³): ${pm}
    강수확률(%): ${pop}
    최고 기온(℃): ${tmn}
    최저 기온(℃): ${tmx}
    성별(남성/여성): ${gender === "male" ? "남자" : "여자"}
    ${personalColor && `퍼스널 컬러: ${personalColor}`}
    `;
  return prompt;
};

const dummyUserContent = `기온(℃): 32
습도(%): 90
풍속(m/s): 3
자외선 지수(UV index): 5
미세먼지 농도(μg/m³): 30
강수확률(%): 10
최고 기온(℃): 36
최저 기온(℃): 26
성별(남성/여성): 남성
퍼스널 컬러: 겨울 쿨톤.

날씨와 개인의 선호에 따라 오늘 옷차림을 추천해줘.`;

const dummyAssistantContent = `오늘의 날씨 정보를 바탕으로 겨울 쿨톤에 맞는 옷차림을 추천해드릴게요.

1. 상의: 오늘은 기온이 높고 습도가 높으므로 편안하고 통기성이 좋은 소재의 상의를 선택해야 해요. 얇은 코튼이나 리넨 소재의 반팔 티셔츠나 셔츠를 선택하는 것이 좋아요. 색상은 겨울 쿨톤에 어울리는 파스텔톤이나 쿨한 컬러를 선택해주세요.

2. 하의: 기온이 높으므로 가볍고 통기성이 좋은 반바지나 면 소재의 바지를 선택해주세요. 색상은 상의와 조화를 이루는 쿨한 컬러를 선택하는 것이 좋아요.

3. 신발: 편안하고 통기성이 좋은 스니커즈나 샌들을 선택해주세요. 색상은 상의와 하의와 어울리는 쿨한 컬러를 선택하는 것이 좋아요.

4. 액세서리: 자외선 지수가 5로 중간 정도이므로 모자나 선글라스를 착용하는 것이 좋아요. 색상은 겨울 쿨톤에 어울리는 쿨한 컬러를 선택해주세요.

5. 외투: 최고 기온이 36도로 높지만, 풍속이 3m/s로 약간 있으므로 가벼운 얇은 재질의 가디건이나 얇은 자켓을 준비해주세요. 색상은 겨울 쿨톤에 어울리는 쿨한 컬러를 선택하는 것이 좋아요.

이렇게 겨울 쿨톤에 맞는 옷차림을 추천해드렸어요. 오늘 하루 편안하고 멋진 하루 되세요!`;

export const createPromptDummy = (): ChatGPTMessage[] => {
  const dummyMessages: ChatGPTMessage[] = [
    { role: "system", content: gptPrompts },
  ];
  return dummyMessages;
};

export default createPrompts;
