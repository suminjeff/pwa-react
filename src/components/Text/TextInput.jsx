import { useState } from "react";
import AudioPlayer from "../AudioPlayer";

export default function TextInput() {
  const [text, setText] = useState("");
  const [audioFile, setAudioFile] = useState(null);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    postText(text);
  };

  async function postText(text) {
    const voiceId = "21m00Tcm4TlvDq8ikWAM";
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
    const apiKey = process.env.REACT_APP_XI_API_KEY;
    const options = {
      method: "POST",
      headers: {
        Accept: "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },

      body: JSON.stringify({
        model_id: "eleven_monolingual_v1",
        text: text,
        voice_settings: {
          similarity_boost: 0.5,
          stability: 0.5,
        },
      }),
      responseType: "arraybuffer",
    };
    try {
      const response = await fetch(url, options);
      const audioBuffer = Buffer.from(response.formData, "binary");
      const base64Audio = audioBuffer.toString("base64");
      const audioDataURI = `data:audio/mpeg;base64,${base64Audio}`;
      response.send({ audioDataURI });
    } catch (error) {
      console.log("error");
    }
  }

  return (
    <>
      <form action="">
        <input
          type="text"
          placeholder="텍스트를 입력하세요"
          value={text}
          style={{
            border: "1px solid",
          }}
          onChange={handleTextChange}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white font-bold py-1 px-2 rounded"
          onClick={handleSubmit}
        >
          제출
        </button>
      </form>
      {audioFile && <AudioPlayer audioFile={audioFile} />}
    </>
  );
}
