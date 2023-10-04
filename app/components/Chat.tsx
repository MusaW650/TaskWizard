import React from 'react';
import { useState } from 'react';
import { useChat } from 'ai/react';
import Image from 'next/image';
import ReactDOM from "react-dom/client";
import { AudioRecorder } from 'react-audio-voice-recorder';

const Chat = () => {
  const [submitType, setSubmitType] = useState<'text'|'image'>("text");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/openai',
  });

  const getImageData = async () => {
    try {
      const response = await fetch('/api/dall-e', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: input })
      });
      const { imageUrl } = await response.json();
      setImageUrl(imageUrl);
      setError("");
    } catch (e) {
      setError(`An error occurred calling the API: ${e}`);
    }
    setLoading(false);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (submitType === 'text') {
      handleSubmit(event);
    } else {
      setLoading(true);
      setImageUrl("");
      getImageData().then();
    }
  };

  const userColors = {
    user: '#00c0ff',
    assistant: '#e02aff',
    function: '#fff',
    system: '#fff',
  }

  const addAudioElement = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const audio = document.createElement("audio");
    audio.src = url;
    audio.controls = true;
    document.body.appendChild(audio);
  };

  // ReactDOM.createRoot(document.getElementById("root")).render(
  //   <React.StrictMode>
  //     <AudioRecorder 
  //       onRecordingComplete={addAudioElement}
  //       audioTrackConstraints={{
  //         noiseSuppression: true,
  //         echoCancellation: true,
  //       }} 
  //       downloadOnSavePress={true}
  //       downloadFileExtension="webm"
  //     />
  //   </React.StrictMode>
  // );

  const renderResponse = () => {
    if (submitType === 'text') {
      return (
        <div className="response">
          {messages.length > 0
          ? messages.map(m => (
              <div key={m.id} className="chat-line">
                <span style={{color: userColors[m.role]}}>{m.role === 'user' ? 'User: ' : '⚡️Task Wizard: '}</span>
                {m.content}
                {/* <span dangerouslySetInnerHTML={{ __html: m.content }} /> */}
              </div>
            ))
          : error}
        </div>
      );
    } else {
      return (
        <div className="response">
          {loading && <div className="loading-spinner"></div>}
          {imageUrl && <Image src={imageUrl} className="image-box" alt="Generated image" width="400" height="400" />}
        </div>
      )
    }
  }

  return (
    <>
      {renderResponse()}
      <form onSubmit={onSubmit} className="mainForm">
        <input name="input-field" placeholder="Say anything" onChange={handleInputChange} value={input} />
        <button type="submit" className="mainButton" disabled={loading} onClick={() => setSubmitType('text')}>
          SUBMIT
        </button>
        {/* <button type="submit" className="secondaryButton" disabled={loading} onClick={() => setSubmitType('image')}> */}
          {/* IMAGE */}
        {/* </button> */}
      </form>
    </>
  );
}

export default Chat;