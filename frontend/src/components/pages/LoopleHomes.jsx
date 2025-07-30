import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../apis/instance";

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
    setCategory(mainCategory.map(main => ({
      type: main.categoryType,
      no: main.no,
      name: main.name,
    })));
  };

  const getMidCategory = async (parentId) => {
    setCategory([]);
    const midCategory = await getCategory("MID", parentId);

    if (midCategory.length === 0) {
      const subCategory = await getCategory("SUB", parentId);
      setCategory(subCategory.map(sub => ({
        type: sub.categoryType,
        no: sub.no,
        name: sub.name,
      })));
    } else {
      setCategory(midCategory.map(mid => ({
        type: mid.categoryType,
        no: mid.no,
        name: mid.name,
      })));
    }
  };

  const getSubCategory = async (parentId) => {
    setCategory([]);
    const subCategory = await getCategory("SUB", parentId);
    setCategory(subCategory.map(sub => ({
      type: sub.categoryType,
      no: sub.no,
      name: sub.name,
    })));
  };

  const getDetail = async (parentId) => {
    setCategory([]);
    if (parentId === 17) {
      setIsInputDisabled(false);
    }

    const detail = await getDetails(parentId);

    const detailMessages = detail.map((item) => {
      let prefix = "";
      switch (item.infoType) {
        case "배출 방법": prefix = "✅ 배출 방법"; break;
        case "주의 사항": prefix = "⚠️ 주의 사항"; break;
        case "FAQ": prefix = "💬 FAQ"; break;
        default: prefix = "";
      }
      return { type: "AI", text: prefix + item.content };
    });

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
    } catch (error) {
      console.error("메시지 전송 실패:", error);
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
    if (!isInputDisabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isInputDisabled]);

  return (
    <div className="relative">

      {/* 🧭 상단 네비게이션 탭 */}
      <div className="fixed top-0 left-0 w-full bg-[#F6F6F6] z-50 flex justify-center gap-4 py-3 border-b border-gray-300">
        <button onClick={() => navigate("/mypage")} className="text-sm text-[#264D3D] font-medium hover:underline">
          마이페이지
        </button>
        <button onClick={() => navigate("/myroom")} className="text-sm text-[#264D3D] font-medium hover:underline">
          마이룸
        </button>
        <button onClick={() => navigate("/myavatar")} className="text-sm text-[#264D3D] font-medium hover:underline">
          마이아바타
        </button>
        <button onClick={() => navigate("/myloopling")} className="text-sm text-[#264D3D] font-medium hover:underline">
          마이루플링
        </button>
        <button onClick={() => navigate("/myvillage")} className="text-sm text-[#264D3D] font-medium hover:underline">
          마이빌리지
        </button>
        <button onClick={() => navigate("/quiz")} className="text-sm text-[#264D3D] font-medium hover:underline">
          퀴즈 풀기
        </button>
      </div>

      {/* 💬 AI 챗봇 플로팅 버튼 */}
      <button
        onClick={handleChatRoom}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#264D3D] rounded-full text-white text-sm flex justify-center items-center shadow-lg z-50 cursor-pointer">
        AI
      </button>

      {/* 🧾 콘텐츠 영역 */}
      <div className="pt-16">
        {showChatRoom && (
          <div
            ref={chatContainerRef}
            className="fixed bottom-24 right-6 w-130 h-170 bg-white border border-gray-300 rounded-lg shadow-xl flex flex-col z-40 gap-2"
          >
            {/* 챗봇 헤더 */}
            <div className="flex justify-between items-center p-3 bg-[#3C9A5F] border-b border-[#264D3D] text-[#FEF7E2] rounded-t-lg">
              <span className="font-semibold">AI 챗봇</span>
              <button
                onClick={() => setShowChatRoom(false)}
                className="hover:text-[#81C784] bg-transparent border-none p-0 m-0 focus:outline-none text-2xl cursor-pointer text-[#FEF7E2]"
              >
                x
              </button>
            </div>

            {/* 챗봇 내용 */}
            <div className="flex-1 p-4 overflow-y-auto space-y-2 text-sm">
              {chatHistory.map((msg, idx) => {
                if (msg.type === "USER") {
                  const isLastUserMessage = chatHistory.slice(idx + 1).find(m => m.type === "USER") == null;
                  return (
                    <div
                      key={idx}
                      className="text-right"
                      ref={isLastUserMessage ? lastUserMessageRef : null}
                    >
                      <span className="inline-block bg-[#CCE7B8] text-[#202020] px-3 py-2 rounded-xl max-w-[75%]">
                        {msg.text}
                      </span>
                    </div>
                  );
                } else {
                  return (
                    <div key={idx} className="text-left">
                      <span className="inline-block bg-[#F0F4EB] text-[#202020] px-3 py-2 rounded-xl max-w-[75%] whitespace-pre-line">
                        {msg.text}
                      </span>
                    </div>
                  );
                }
              })}

              {waitingResponse && (
                <div className="text-left">
                  <span className="inline-block bg-[#CCE7B8] text-[#202020] px-3 py-2 rounded-xl max-w-[75%] animate-pulse">
                    ...
                  </span>
                </div>
              )}

              {/* 카테고리 버튼 */}
              <div className="flex flex-col space-y-2 mt-2 w-[70%]">
                {category && category.map((item) => (
                  <button
                    key={item.no}
                    onClick={() => {
                      setChatHistory(prev => [...prev, { type: "USER", text: item.name }]);

                      if (item.type === "MAIN") getMidCategory(item.no);
                      else if (item.type === "MID") getSubCategory(item.no);
                      else if (item.type === "SUB") getDetail(item.no);
                    }}
                    className="px-4 py-2 bg-[#3C9A5F] text-white rounded-lg hover:bg-[#264D3D] text-sm cursor-pointer border-none"
                  >
                    {item.name}
                  </button>
                ))}
              </div>

              {/* 처음으로 */}
              <button
                onClick={handleChatRoom}
                className="mt-2 px-4 py-2 bg-[#F0F4EB] text-[#202020] rounded-lg hover:bg-[#CCE7B8] text-sm self-start border-none cursor-pointer"
              >
                ⬅ 처음으로 이동
              </button>
            </div>

            {/* 입력창 */}
            <div className="p-3 border-t flex gap-2">
              <input
                ref={inputRef}
                type="text"
                disabled={isInputDisabled}
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none bg-white focus:bg-[#F6F6F6]"
                onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
              />
              <button
                disabled={isInputDisabled}
                onClick={sendMessage}
                className={`px-4 py-2 rounded-lg text-sm border-none bg-[#3C9A5F]
                ${isInputDisabled
                  ? "text-gray-700 cursor-not-allowed"
                  : "text-white cursor-pointer hover:bg-[#264D3D]"
                }`}
              >
                전송
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}