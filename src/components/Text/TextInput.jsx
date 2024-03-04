import { useState } from "react"

export default function TextInput() {
  const [text, setText] = useState("")

  const handleTextChange = (e) => {
    setText(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    postText(text)
  }

  function postText(text) {
    const voiceId = '21m00Tcm4TlvDq8ikWAM'
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`
    const apiKey = process.env.REACT_APP_XI_API_KEY;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },

      body: JSON.stringify({
        model_id: 'eleven_monolingual_v1',
        text: text,
        voice_settings: {
          similarity_boost: 0,
          stability: 0,
        }
      }),
    }
    fetch(url, options)
      .then(response => response.json())
      .then(response => console.log(response))
      .catch(err => console.log(err))
  }


  return (
    <>
      <form action="">
        <input type="text" placeholder="텍스트를 입력하세요" value={text}
          style={{
            border: "1px solid"
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
    </>
  )
}