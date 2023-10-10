import React, { useEffect } from "react";
import { useState } from "react";
import { useChat } from "ai/react";
import { useRef } from "react";
import Image from "next/image";
import ReactDOM from "react-dom/client";
import { AudioRecorder } from "react-audio-voice-recorder";
import { render } from "react-dom";

type ChatMessage = {
  id: string;
  role: string;
  content: string;
};

type Task = {
  text: string;
  completed: boolean;
};

const Chat = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]); // Initialize tasks as an empty array
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/openai",
  });

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    handleSubmit(event);
  };

  const userColors = {
    user: "#00c0ff",
    assistant: "#e02aff",
    function: "#fff",
    system: "#fff",
  };

  // const addAudioElement = (blob: Blob) => {
  //   const url = URL.createObjectURL(blob);
  //   const audio = document.createElement("audio");
  //   audio.src = url;
  //   audio.controls = true;
  //   document.body.appendChild(audio);
  // };

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
    return (
      <div className="response">
        {messages.length > 0
          ? messages.map((m) => (
              <div key={m.id} className="chat-line">
                <span style={{ color: userColors[m.role] }}>
                  {m.role === "user" ? "User: " : "⚡️Task Wizard: "}
                </span>
                <div dangerouslySetInnerHTML={{ __html: m.content }} />
            
                {/* {m.content} */}
              </div>
            ))
          : error}
      </div>
    );
  };

  const toggleTaskStatus = (index: number) => {
    // Specify the type here
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  const renderTasks = () => {
    return (
      <div className="response">
        {messages.length > 0
          ? messages.map((m, index) => (
              <div key={m.id} className="chat-line">
                <span style={{ color: userColors[m.role] }}>
                  {m.role === "user" ? "User: " : "⚡️Task Wizard: "}
                </span>
                {m.content.split("\n").map((line, lineIndex) => (
                  <div key={lineIndex}>
                    {line.startsWith(`${lineIndex + 1}.`) ? (
                      <>
                        {line}
                        <button onClick={() => toggleTaskStatus(lineIndex)}>
                          Complete
                        </button>
                      </>
                    ) : (
                      line
                    )}
                  </div>
                ))}
              </div>
            ))
          : error}
      </div>
    );
  };

  return (
    <>
      {renderResponse()}
      <form onSubmit={handleSubmit} className="mainForm">
        <input
          name="input-field"
          placeholder="Say anything"
          onChange={handleInputChange}
          value={input}
        />
        <button type="submit" className="mainButton">
          SUBMIT
        </button>
      </form>
    </>
  );
};

export default Chat;
