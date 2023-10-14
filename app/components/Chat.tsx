import React, { useState, FormEvent } from "react";
import { useChat, Message } from "ai/react";

const Chat = () => {
  const [goal, setGoal] = useState("");
  const [time, setTime] = useState("");
  const [importance, setImportance] = useState("");
  const { messages, input, handleInputChange, handleSubmit, append } = useChat({
    api: "/api/openai",
  });

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Concatenate the three values into a single input
    const concatenatedInput = `Goal: ${goal}, Time: ${time}, Importance: ${importance}`;
    append({
      content: concatenatedInput,
      role: 'user'
    });

    // Reset the individual fields
    setGoal("");
    setTime("");
    setImportance("");
  };

  return (
    <div className="chat-container"> {/* Surrounding container for centering */}
      <form onSubmit={onSubmit} className="mainForm">
        <div className="button-container">
          <input
            id="goal"
            type="text"
            placeholder="Goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
          <input
            type="text"
            placeholder="Time to Accomplish"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
          <input
            type="text"
            placeholder="Importance"
            value={importance}
            onChange={(e) => setImportance(e.target.value)}
          />
          <button type="submit" className="mainButton">
            SUBMIT
          </button>
        </div>
      </form>


      {messages.map((m: Message) => (
        <div key={m.id} className="chat-line">
          <div dangerouslySetInnerHTML={{ __html: m.content }} />
        </div>
      ))}
    </div>
  );
};

export default Chat;
