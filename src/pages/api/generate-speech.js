// const textToSpeech = require('@google-cloud/text-to-speech');
// const fs = require('fs');
// const util = require('util');
// const player = require('play-sound')();

// export default async function handler(
//     req,
//     res
// ) {
//     try {
//         // Imports the Google Cloud client library
//         // Import other required libraries
//         // Creates a client
//         const client = new textToSpeech.TextToSpeechClient();
//         // The text to synthesize
//         const { text } = req.body;
  
//         // Construct the request
//         const request = {
//             input: { text: text },
//             // Select the language and SSML voice gender (optional)
//             voice: { languageCode: 'ko-KR', name: 'ko-KR-Neural2-A' },
//             // select the type of audio encoding
//             audioConfig: { audioEncoding: 'MP3' },
//         };
  
//         // Performs the text-to-speech request
//         const [response] = await client.synthesizeSpeech(request);
//         console.log(response)
//         // const stream = require('stream');
//         // const bufferStream = new stream.PassThrough();
//         // bufferStream.end(Buffer.from(response.audioContent, 'binary'));
        
//         // player.play(bufferStream, (err) => {
//         //     if (err) {
//         //       console.log(`Failed to play sound: ${err}`);
//         //     }
//         //   });
        
//         const writeFile = util.promisify(fs.writeFile);
//         await writeFile('output.mp3', response.audioContent, 'binary');
//         // console.log('Audio content written to file: output.mp3');
//         res.status(200).send('OK');
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Internal Server Error');
//       }
//   }
  
import { NextApiRequest, NextApiResponse } from 'next';
import textToSpeech from '@google-cloud/text-to-speech';
import fs from 'fs';
import util from 'util';

export default async function handler(req, res) {
  try {
    // Creates a client
    const client = new textToSpeech.TextToSpeechClient();

    // The text to synthesize
    const { text } = req.body;

    // Construct the request
    const request = {
      input: { text: text },
      // Select the language and SSML voice gender (optional)
      voice: { languageCode: 'ko-KR', name: 'ko-KR-Neural2-A' },
      // select the type of audio encoding
      audioConfig: { audioEncoding: 'MP3' },
    };

    // Performs the text-to-speech request
    const [response] = await client.synthesizeSpeech(request);

    const writeFile = util.promisify(fs.writeFile);
    await writeFile('output.mp3', response.audioContent, 'binary');

    const fileContents = await util.promisify(fs.readFile)('output.mp3');

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', fileContents.length);
    res.setHeader('Content-Disposition', 'attachment; filename="output.mp3"');
    res.status(200).send(fileContents);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}