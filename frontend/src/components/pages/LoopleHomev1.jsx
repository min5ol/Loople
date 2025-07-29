// src/components/pages/LoopleHome.jsx
/* #81C784, #749E89, #3C9A5F, #264D3D, #F6F6F6, #FEF7E2, #202020 */

import React, { useState, useRef, useEffect } from "react";
import instance from "../../apis/instance";

export const chatting = async (message) => {
  const res = await instance.post("/chat/completion/withAI/text", message);
  return res.data;
};

export const buildRoom = async () => {
  const res = await instance.get("/chat/completion/withAI/room");
  return res.data;
};

export const getMain = async () => {
  const res = await instance.get("/chat/completion/select/main");
  return res.data;
}

export default function LoopleHomev1() {
  const [showChat, setShowChat] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [room, setRoom] = useState(null);
  const [category, setCategory] = useState(null);

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const sendMessage = async () => {
    try {
      const payLoad = {
        roomId: room.no,
        content: userMessage,
      };

      setChatHistory((prev) => [
        ...prev,
        { type: "USER", text: userMessage },
      ]);

      setUserMessage('');

      const response = await chatting(payLoad);
      setResponseMessage(response);

      setChatHistory((prev) => [
        ...prev,
        { type: "AI", text: response },
      ]);

    } catch (error) {
      console.log(error);
    }
  };

  const handleChatRoom = async () => {
    setShowChat(true);
    try {
      const room = await buildRoom();
      setRoom(room);

      const mainCategory = await getMain();
      const payLoad = {
        no: mainCategory.no,
        name: mainCategory.name  
      };

      setCategory(payLoad);

      setChatHistory((prev) => [
        ...prev,
        { type: "AI", text: "안녕하세요 ! 분리 배출 정보를 알려드리는 챗봇입니다. 궁금한 사항의 버튼을 눌러주세요 !" },
      ]);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative">
      {/* AI 버튼 */}
      <button
        onClick={handleChatRoom}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#264D3D] rounded-full text-white text-sm flex justify-center items-center shadow-lg z-50 cursor-pointer"
      >
        AI
      </button>

      {/* 채팅창 */}
      {showChat && (
        <div className="fixed bottom-24 right-6 w-100 h-125 bg-white border border-gray-300 rounded-lg shadow-xl flex flex-col z-40 gap-2">
          {/* 상단 닫기 버튼 */}
          <div className="flex justify-between items-center p-3 bg-[#3C9A5F] border-b border-[#264D3D] text-[#FEF7E2] rounded-t-lg">
            <span className="font-semibold">AI 챗봇</span>
            <button
              onClick={() => {
                setShowChat(false);
                setChatHistory([]);
              }}
              className="hover:text-[#81C784] bg-transparent border-none p-0 m-0 focus:outline-none text-2xl cursor-pointer text-[#FEF7E2]"
            >
              x
            </button>
          </div>

          {/* 채팅 내용 */}
          <div
            ref={chatContainerRef}
            className="flex-1 p-4 overflow-y-auto space-y-2 text-sm"
          >
            {chatHistory.map((msg, idx) =>
              msg.type === "USER" ? (
                <div key={idx} className="text-right">
                  <span className="inline-block bg-[#3C9A5F] text-white px-3 py-2 rounded-xl max-w-[75%]">
                    {msg.text}
                  </span>
                </div>
              ) : (
                <div key={idx} className="text-left">
                  <span className="inline-block bg-[#F6F6F6] text-[#202020] px-3 py-2 rounded-xl max-w-[75%]">
                    {msg.text}
                  </span>
                </div>
              )
            )}

            <div className="flex flex-col space-y-2 mt-2 w-[70%]">
              {category && category.map((cat, idx) => (
                <button
                  key={idx} value={cat.no}
                  className="px-4 py-2 bg-[#3C9A5F] text-white rounded-lg hover:bg-[#264D3D] text-sm cursor-pointer"
                >
                  {cat.name}
                </button>
              ))}
            </div>

          </div>


          {/* 입력창 */}
          <div className="p-3 border-t flex gap-2">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="메시지를 입력하세요"
              className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none bg-white focus:bg-[#F6F6F6]"
            />

            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-[#3C9A5F] text-white rounded-lg hover:bg-[#264D3D] text-sm cursor-pointer border-none"
            >
              전송
            </button>
          </div>
        </div>
      )}
    </div>
  );


}
