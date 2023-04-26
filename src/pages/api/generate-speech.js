import textToSpeech from '@google-cloud/text-to-speech';

export default async function handler(req, res) {
  try {
    const client = new textToSpeech.TextToSpeechClient();
    const { text } = req.body;

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