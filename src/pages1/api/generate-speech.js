import textToSpeech from '@google-cloud/text-to-speech';

export default async function handler(req, res) {
  try {
    const { text } = req.body;

    // Google TTS API 인증 정보 설정
    const authConfig = {
      projectId: process.env.PROJECT_ID,
      credentials: {
        client_email: process.env.CLIENT_EMAIL,
        private_key: process.env.TTS_PRIVATE_KEY,
      },
    };

    // 인증 정보를 사용하여 TextToSpeechClient 초기화
    const client = new textToSpeech.TextToSpeechClient(authConfig);

    // body에 넘어온 text 바탕으로 요청 생성
    const request = {
      input: { text: text },
      voice: { languageCode: 'ko-KR', name: 'ko-KR-Neural2-A' },
      audioConfig: { audioEncoding: 'MP3' },
    };

    // tts 요청, audio 컨텐츠를 클라에 전송
    const [response] = await client.synthesizeSpeech(request);

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', response.audioContent.length);
    res.status(200).send(response.audioContent);

  } catch (error) {
    console.error(error);
    res.status(500).send('서버 오류가 발생했습니다.');
  }
}