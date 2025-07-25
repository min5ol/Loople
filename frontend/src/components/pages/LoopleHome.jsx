// src/components/pages/LoopleHome.jsx

import React, {useState} from "react";
import instance from "../../apis/instance";

export const chatting = async (message) => {
  const res = await instance.post("/chat/completion", message);
  return res.data;
};

export default function LoopleHome(){
  const [showChat, setShowChat] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [userMessage, setUserMessage] = useState('');
  
  const sendMessage = async () => {
    try{
      const data = await chatting(userMessage);
      setResponseMessage(data)
    } catch(error){
      console.log(error);
    }
  }

  return (
    <div className="m-10">
      <button onClick={() => setShowChat(true)}>
        채팅방 열기
      </button>

      {showChat && (
        <div className="bg-green-500 w-80 h-80">
          {responseMessage && (
            <div>
              {responseMessage}
            </div>
          )}

          <div>
            <input type="text" name="userMessage" value={userMessage} onChange={(e) => setUserMessage(e.target.value)}/>
            <button onClick = {sendMessage}>전송</button>
          </div>

          <button onClick = {() => setShowChat(false)}>X</button>
        </div>
      )}
    </div>
  );
}