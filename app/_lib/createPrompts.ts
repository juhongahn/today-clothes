import { ChatGPTMessage } from "./openaiStream";
import { gptPrompts } from "../_helpers/constants/chatGPT-prompt";

export type PromptsType = {
  tmp: string;
  reh: string;
  wsd: string;
  uv: string;
  pop: string;
  tmn: string;
  tmx: string;
  gender: string;
  color: string;
};

const createPrompts = (promptInput: PromptsType): string => {
  const { tmp, reh, wsd, uv, pop, tmn, tmx, gender, color } = promptInput;
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
    강수확률(%): ${pop}
    ${tmn && `최고 기온(℃): ${tmn}`}
    ${tmx && `최저 기온(℃): ${tmx}`}
    성별(남성/여성): ${gender === "male" ? "남자" : "여자"}
    ${personalColor && `퍼스널 컬러: ${personalColor}`}
    위 제공된 날씨 정보와 선호에 따라서 하루 옷차림을 추천해 줄래?
    `;
  return prompt;
};

const dummyUserContent = `기온(℃): 32
습도(%): 90
풍속(m/s): 3
자외선 지수(UV index): 5
강수확률(%): 10
최고 기온(℃): 36
최저 기온(℃): 26
성별(남성/여성): 남성
퍼스널 컬러: 겨울 쿨톤.

위 제공된 날씨 정보와 선호에 따라서 하루 옷차림을 추천해 줄래?`;

const dummyAssistantContent = `오늘의 날씨 정보를 바탕으로 겨울 쿨톤에 맞는 남성 옷차림을 추천해드릴게요.

1. 상의: 오늘은 기온이 높고 습도가 높으므로 편안하고 통기성이 좋은 얇은 코튼 또는 리넨 소재의 반팔 티셔츠나 셔츠를 선택하는 것이 좋아요. 색상은 겨울 쿨톤에 어울리는 푸른빛이 도는 보라색 계열이 좋아요.

2. 하의: 기온이 높으므로 가볍고 통기성이 좋은 반바지나 면 소재의 바지를 선택해주세요. 색상은 상의와 조화를 이루는 검정색이나 어두운 계열이 좋아요.

3. 신발: 편안하고 통기성이 좋은 스니커즈나 샌들을 선택해주세요. 색상은 상의와 하의와 어울리는 검정 또는 하얀색이 좋을것 같아요.

이렇게 겨울 쿨톤에 맞는 남성 옷차림을 추천해드렸어요. 오늘 하루 편안하고 멋진 하루 되세요!`;

export const createPromptDummy = (): ChatGPTMessage[] => {
  const dummyMessages: ChatGPTMessage[] = [
    { role: "system", content: gptPrompts },
    { role: "user", content: dummyUserContent },
    { role: "assistant", content: dummyAssistantContent },
  ];
  return dummyMessages;
};

export default createPrompts;
