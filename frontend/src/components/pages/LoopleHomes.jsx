// 작성일: 2025.08.04
// 작성자: 장민솔
// 설명: Loople 챗봇 홈 전체 UI 리디자인 적용 (감성 버튼 포함)

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../apis/instance";
import Community from "./Community";
import Header from "./Header";
import Chatbot from "./Chatbot";

<<<<<<< HEAD
// #81C784, #749E89, #3C9A5F, #264D3D, #F6F6F6, #FEF7E2, #202020


export default function LoopleHome() {

  return (
    <div className="relative w-full min-h-screen">

      {/* 🧭 상단 네비게이션 탭 */}
      <Header />

      {/* 게시판 */}

      <Community />

      <Chatbot />

=======
export const buildRoom = async () => {
  const res = await instance.get("/chat/completion/buildRoom/withAI");
  return res.data;
};

export const getCategory = async (categoryType, parentId) => {
  const res = await instance.get("/chat/completion/category", {
    params: { categoryType, parentId },
  });
  return res.data;
};

export const getDetails = async (parentId) => {
  const res = await instance.get("/chat/completion/details", {
    params: { parentId },
  });
  return res.data;
};

export const sendMessages = async (userMessage) => {
  const res = await instance.post("/chat/completion/withAI/text", userMessage);
  return res.data;
};

export default function LoopleHome() {
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [showChatRoom, setShowChatRoom] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { type: "AI", text: "안녕하세요😊 분리 배출 정보를 알려주는 챗봇입니다. 버튼을 눌러주세요 !" },
  ]);
  const [isInputDisabled, setIsInputDisabled] = useState(true);
  const [userMessage, setUserMessage] = useState('');
  const [category, setCategory] = useState([]);
  const [waitingResponse, setWaitingResponse] = useState(false);

  const chatContainerRef = useRef(null);
  const lastUserMessageRef = useRef(null);
  const inputRef = useRef(null);

  const handleChatRoom = async () => {
    setChatHistory([{ type: "AI", text: "안녕하세요😊 분리 배출 정보를 알려드리는 챗봇입니다. 버튼을 눌러주세요 !" }]);
    setCategory([]);
    setUserMessage('');
    setIsInputDisabled(true);
    const room = await buildRoom();
    setRoom(room);
    setShowChatRoom(true);
    const mainCategory = await getCategory("MAIN", null);
    setCategory(mainCategory.map(main => ({ type: main.categoryType, no: main.no, name: main.name })));
  };

  const getDetail = async (parentId) => {
    setCategory([]);
    if (parentId === 17) setIsInputDisabled(false);
    const detail = await getDetails(parentId);
    const detailMessages = detail.map(d => ({ type: "AI", text: d.content }));
    setChatHistory(prev => [...prev, ...detailMessages]);
  };

  const sendMessage = async () => {
    if (!userMessage.trim()) return;
    setChatHistory(prev => [...prev, { type: "USER", text: userMessage }]);
    setWaitingResponse(true);
    const payLoad = { roomId: room.no, content: userMessage };
    setUserMessage('');
    try {
      const receivedMessage = await sendMessages(payLoad);
      setChatHistory(prev => [...prev, { type: "AI", text: receivedMessage }]);
    } catch {
      setChatHistory(prev => [...prev, { type: "AI", text: "⚠️ 응답에 실패했어요. 다시 시도해주세요." }]);
    } finally {
      setWaitingResponse(false);
    }
  };

  useEffect(() => {
    if (lastUserMessageRef.current && chatContainerRef.current) {
      lastUserMessageRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [chatHistory]);

  useEffect(() => {
    if (!isInputDisabled && inputRef.current) inputRef.current.focus();
  }, [isInputDisabled]);

  return (
    <div className="relative bg-[#FEF7E2] min-h-screen">
      {/* 상단 네비게이션 */}
      <div className="fixed top-0 left-0 w-full bg-[#FEF7E2] z-50 flex justify-center gap-5 py-3 border-b border-[#DADADA] shadow-sm">
        {[{ label: "마이페이지", path: "/mypage", emoji: "👤" },
          { label: "마이룸", path: "/myroom", emoji: "🛏️" },
          { label: "아바타", path: "/myavatar", emoji: "🧍" },
          { label: "루플링", path: "/myloopling", emoji: "🌱" },
          { label: "마을", path: "/myvillage", emoji: "🏡" },
          { label: "퀴즈", path: "/quiz", emoji: "🧠" },
          { label: "규칙", path: "/rule", emoji: "📜" },
        ].map(item => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="px-3 py-1 bg-white text-[#264D3D] hover:bg-[#CCE7B8] border border-[#3C9A5F] rounded-full text-sm font-medium shadow-sm transition"
          >
            {item.emoji} {item.label}
          </button>
        ))}
      </div>

      {/* 챗봇 플로팅 버튼 */}
      <button
        onClick={handleChatRoom}
        className="fixed bottom-6 right-6 w-16 h-16 bg-[#3C9A5F] hover:bg-[#264D3D] text-white rounded-full shadow-xl flex items-center justify-center text-xl font-bold transition z-50"
      >💬</button>

      {/* 챗봇 영역 */}
      {showChatRoom && (
        <div
          ref={chatContainerRef}
          className="fixed bottom-24 right-6 w-130 h-170 bg-white border border-gray-300 rounded-2xl shadow-xl flex flex-col z-40"
        >
          <div className="flex justify-between items-center p-4 bg-[#264D3D] text-[#FEF7E2] rounded-t-2xl">
            <span className="font-bold text-lg">🌿 Loople 챗봇</span>
            <button onClick={() => setShowChatRoom(false)} className="text-2xl">×</button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-sm bg-[#F6F6F6]">
            {chatHistory.map((msg, idx) => {
              const isLastUser = !chatHistory.slice(idx + 1).some(m => m.type === "USER");
              if (msg.type === "USER") {
                return (
                  <div key={idx} className="text-right" ref={isLastUser ? lastUserMessageRef : null}>
                    <div className="inline-block bg-[#81C784] text-white px-4 py-3 rounded-2xl max-w-[75%] shadow">
                      {msg.text}
                    </div>
                  </div>
                );
              } else {
                return (
                  <div key={idx} className="text-left">
                    <div className="inline-block bg-[#F0F4EB] text-[#202020] px-4 py-3 rounded-2xl max-w-[75%] whitespace-pre-line shadow">
                      {msg.text}
                    </div>
                  </div>
                );
              }
            })}

            {waitingResponse && (
              <div className="text-left">
                <div className="inline-block bg-[#CCE7B8] text-[#202020] px-3 py-2 rounded-xl max-w-[75%] animate-pulse">
                  ...
                </div>
              </div>
            )}

            <div className="flex flex-col space-y-2 mt-4">
              {category.map((item) => (
                <button
                  key={item.no}
                  onClick={() => {
                    setChatHistory(prev => [...prev, { type: "USER", text: item.name }]);
                    if (item.type === "MAIN") getCategory("MID", item.no).then(setCategory);
                    else if (item.type === "MID") getCategory("SUB", item.no).then(setCategory);
                    else if (item.type === "SUB") getDetail(item.no);
                  }}
                  className="px-4 py-2 bg-[#749E89] text-white rounded-full hover:bg-[#3C9A5F] text-sm shadow-sm"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 border-t bg-white flex gap-2">
            <input
              ref={inputRef}
              type="text"
              disabled={isInputDisabled}
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
              className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none"
              placeholder="질문을 입력하세요..."
            />
            <button
              onClick={sendMessage}
              disabled={isInputDisabled}
              className={`px-4 py-2 rounded-lg text-sm ${isInputDisabled ? "bg-gray-200 text-gray-500" : "bg-[#3C9A5F] text-white hover:bg-[#264D3D]"}`}
            >
              전송
            </button>
          </div>
        </div>
      )}
>>>>>>> 89393e4 (로그인 완료 - 장민솔)
    </div>
  );
}