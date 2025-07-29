import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../apis/instance";

// ✅ API 함수
export const chatting = async (message) => {
  const res = await instance.post("/chat/completion/withAI/text", message);
  return res.data;
};

export const buildRoom = async () => {
  const res = await instance.get("/chat/completion/withAI/room");
  return res.data;
};

// ✅ 대시보드 카드 컴포넌트
function DashboardCard({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl shadow-md p-6 text-center hover:bg-[#F6F6F6] transition text-[#202020] font-semibold text-sm"
    >
      {label}
    </button>
  );
}

// ✅ 메인 컴포넌트
export default function LoopleHome() {
  const navigate = useNavigate();

  const [showChat, setShowChat] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [room, setRoom] = useState(null);

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

      setChatHistory((prev) => [...prev, { type: "USER", text: userMessage }]);
      setUserMessage("");

      const response = await chatting(payLoad);
      setResponseMessage(response);

      setChatHistory((prev) => [...prev, { type: "AI", text: response }]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChatRoom = async () => {
    setShowChat(true);
    try {
      const room = await buildRoom();
      setRoom(room);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FEF7E2] py-10 px-6 font-[pretendard] relative">
      {/* 타이틀 */}
      <h1 className="text-2xl font-bold text-[#264D3D] mb-6">루플 홈</h1>

      {/* 기능 카드 */}
      <div className="grid grid-cols-2 gap-4 mb-16">
        <DashboardCard label="마이페이지" onClick={() => navigate("/mypage")} />
        <DashboardCard label="나의 아바타" onClick={() => navigate("/my/avatar")} />
        <DashboardCard label="나의 방" onClick={() => navigate("/my/room")} />
        <DashboardCard label="나의 루플링" onClick={() => navigate("/my/loopling")} />
        <DashboardCard label="나의 마을" onClick={() => navigate("/my/village")} />
        <DashboardCard label="퀴즈 풀기" onClick={() => navigate("/quiz")} />
      </div>

      {/* AI 챗봇 버튼 */}
      <button
        onClick={handleChatRoom}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#264D3D] rounded-full text-white text-sm flex justify-center items-center shadow-lg z-50 cursor-pointer"
      >
        AI
      </button>

      {/* AI 챗봇 창 */}
      {showChat && (
        <div className="fixed bottom-24 right-6 w-100 h-125 bg-white border border-gray-300 rounded-lg shadow-xl flex flex-col z-40 gap-2">
          {/* 상단 닫기 */}
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