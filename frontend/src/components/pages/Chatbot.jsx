// src/components/pages/Chatbot.jsx

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../apis/instance";
import { useAuthStore } from "../../store/authStore";

export const buildRoom = async () => {
  const res = await instance.get(`/chat/completion/chatbot/buildRoom`);
  return res.data;
};

export const getCategory = async (categoryType, parentId) => {
  const res = await instance.get("/chat/completion/chatbot/category", {
    params: { categoryType, parentId },
  });
  return res.data;
};

export const getDetails = async (parentId) => {
  const res = await instance.get("/chat/completion/chatbot/details", {
    params: { parentId },
  });
  return res.data;
};

export const sendMessages = async (userMessage) => {
  const res = await instance.post("/chat/completion/chatbot/text", userMessage);
  return res.data;
};

export default function Chatbot() {
  const { userInfo, clearAuthInfo } = useAuthStore();
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

  const MessageType = {
    CHAT: 'CHAT',
    JOIN: 'JOIN',
    LEAVE: 'LEAVE',
  };

  const handleChatRoom = async () => {
    setChatHistory([{ type: "AI", text: "안녕하세요😊 분리 배출 정보를 알려드리는 챗봇입니다. 버튼을 눌러주세요 !" }]);
    setCategory([]);
    setUserMessage('');
    setIsInputDisabled(true);

    const room = await buildRoom(userInfo.nickname);
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

  const renderLink = (url, label) => {
    return `<a href="${url || '#'}" class="text-[#202020] ${url ? 'hover:text-green-900 hover:underline' : 'pointer-events-none opacity-50'}" target="_blank" rel="noopener noreferrer">[${label}]</a>`;
  }

  const method = (data) => {
    return data ? `<br/><br/><strong>📋 배출 방법</strong>${data}` : null;
  }

  const renderItem = (icon, label, value) => {
    return value ? `<span class="mt-4 mb-4">&nbsp;${icon} ${label}: ${value}</span><br/>` : null;
  }

  const localInfo = (gov, type) => {
    if (gov.wasteType === type) {
      let typeLabel = type;

      switch (type) {
        case "GENERAL": typeLabel = "일반쓰레기"; break;
        case "FOOD": typeLabel = "음식물쓰레기"; break;
        case "RECYCLING": typeLabel = "재활용쓰레기"; break;
        default: break;
      }

      return `
        <strong>🗂️ ${typeLabel} 수거 정보</strong>
        ${[
          renderItem("🕒", "배출 시간", gov.disposalTime),
          renderItem("📅", "배출 요일", gov.disposalDays),
          renderItem("📍", "배출 장소", gov.disposalLocation),
          renderItem("📋", "배출 방법", gov.disposalMethod),
        ].filter(Boolean).join('')}
        `;
    } else {
      return '';
    }
  };

  const getDetailMessages = (detail, parentId) => {
    return detail.flatMap((item) => {
      let prefix = "";
      switch (item.infoType) {
        case "배출 방법": prefix = "✅ 배출 방법"; break;
        case "주의 사항": prefix = "⚠️ 주의 사항"; break;
        case "FAQ": prefix = "💬 FAQ"; break;
        case "지역별 정보": prefix = ""; break;
        default: prefix = "";
      }

      if (!item.localGovern) { return [{ type: "AI", text: `${prefix ? prefix : ""}${item.content}` }]; }

      const basicMessage = `<br/><strong class="text-[#202020]">\n🚨 참고 부탁드립니다!</strong>\n정보가 변경될 수 있으니, 정확한 사항은 홈페이지에서 확인해 주세요.`;

      return item.localGovern
        .filter((gov) => {
          if (parentId == 43) return gov.wasteType === "GENERAL" || gov.wasteType === null;
          if (parentId == 44) return gov.wasteType === "FOOD" || gov.wasteType === null;
          if (parentId == 45) return gov.wasteType === "RECYCLING" || gov.wasteType === null;
          if (parentId == 46) return gov.wasteType === "GENERAL" || gov.wasteType === null;
          return true;
        })
        .map((gov) => {
          const local = `${gov.sido}` + " " + `${gov.sigungu}`;
          let data = `<strong>📍 ${local}의 수거 정보</strong>
        ${renderLink(gov.homepage, `${local} 홈페이지 바로가기`)}
        ${renderLink(gov.allInfoUrl, "쓰레기 수거 정보 보기")}
        `;
          const methodInfo = [
            method(gov.disposalMethod)
          ].filter(Boolean).join('');

          if (gov.wasteType == "GENERAL" && parentId == 43) { data += `${renderLink(gov.generalUrl, "일반쓰레기 수거 정보 보기")}`; }
          else if (gov.wasteType == "FOOD" && parentId == 44) { data += `${renderLink(gov.foodUrl, "음식물쓰레기 수거 정보 보기")}`; }
          else if (gov.wasteType == "RECYCLING" && parentId == 45) { data += `${renderLink(gov.recyclingUrl, "재활용쓰레기 수거 정보 보기")}`; }
          else if (gov.wasteType == "GENERAL" && parentId == 46) { data += `${renderLink(gov.bulkyUrl, "대형폐기물 수거 정보 보기")}`; }
          else if (parentId == 47) {
            const infos = [
              localInfo(gov, "GENERAL"),
              localInfo(gov, "FOOD"),
              localInfo(gov, "RECYCLING")
            ].filter(Boolean).join('');

            return {
              type: "AI",
              text: `<strong>📍${local} 수거 정보</strong>
              ${infos}
              ℹ️ 자세한 정보는 홈페이지를 참고해 주세요 !
              ${renderLink(gov.homepage, "🔗 자세히 보기")}`,
              isHtml: true
            }
          } else {
            data += `${renderLink(gov.generalUrl, "일반쓰레기 수거 정보 보기")}
          ${renderLink(gov.foodUrl, "음식물쓰레기 수거 정보 보기")}
          ${renderLink(gov.disposalUrl, "재활용 수거 정보 보기")}
          ${renderLink(gov.bulkyUrl, "대형폐기물 수거 정보 보기")}`;
          }

          return { type: "AI", text: `${data} ${methodInfo} ${basicMessage}`, isHtml: true };
        });

    })
  }

  const getDetail = async (parentId) => {
    console.log("getDetail 호출, parentId: ", parentId);

    setCategory([]);
    if (parentId === 17) {
      setIsInputDisabled(false);
    }

    const detail = await getDetails(parentId, userInfo.no);
    console.log("getDetails 응답, detail: ", detail);

    const detailMessages = getDetailMessages(detail, parentId);

    setChatHistory(prev => [...prev, ...detailMessages]);
  };

  const sendMessage = async () => {
    if (!userMessage.trim()) return;

    setChatHistory(prev => [...prev, { type: "USER", text: userMessage }]);
    setWaitingResponse(true);

    const payLoad = { roomId: room.no, content: userMessage, nickname: userInfo.nickname, type: MessageType.CHAT };
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
  <>
    {/* 💬 플로팅 트리거 버튼 (Home 톤 맞춤) */}
    <button
      onClick={handleChatRoom}
      className="
        fixed bottom-6 right-6 z-50
        w-14 h-14 rounded-full
        bg-brand-600 text-white
        shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_10px_22px_rgba(0,0,0,0.18)]
        hover:bg-brand-500 transition-colors
        focus:outline-none focus:ring-4 focus:ring-brand-300
      "
      aria-label="AI 챗봇 열기"
    >
      AI
    </button>

    {/* 🧊 글래스 챗봇 패널 */}
    {showChatRoom && (
      <div
        ref={chatContainerRef}
        className="
          fixed bottom-24 right-6 z-40
          w-[380px] h-[560px]
          rounded-2xl overflow-hidden
          bg-white/85 backdrop-blur-md
          shadow-[inset_0_1px_2px_rgba(255,255,255,0.65),0_16px_36px_rgba(0,0,0,0.14)]
          ring-1 ring-black/5
          flex flex-col
        "
      >
        {/* 헤더: 얇은 그라디언트 + 최소 강조 */}
        <div
          className="
            px-4 py-3 flex items-center justify-between
            bg-gradient-to-r from-brand-600 to-brand-500 text-white
            shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]
          "
        >
          <span className="font-ptd-700 tracking-tight">AI 챗봇</span>
          <button
            onClick={() => setShowChatRoom(false)}
            className="w-8 h-8 grid place-items-center rounded-full hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-brand-300"
            aria-label="닫기"
            title="닫기"
          >
            <span className="text-xl leading-none">×</span>
          </button>
        </div>

        {/* 대화 영역 */}
        <div
          className="
            flex-1 p-4 space-y-3 overflow-y-auto
            bg-brand-50
          "
        >
          {chatHistory.map((msg, idx) => {
            const isUser = msg.type === "USER";
            const isLastUser = isUser && !chatHistory.slice(idx + 1).some(m => m.type === "USER");
            return (
              <div
                key={idx}
                className={isUser ? "flex justify-end" : "flex justify-start"}
                ref={isLastUser ? lastUserMessageRef : null}
              >
                <div
                  className={[
                    "px-3 py-2 rounded-xl max-w-[76%] shadow-sm text-sm",
                    isUser
                      ? "bg-brand-500 text-white rounded-br-none"
                      : "bg-white/90 text-brand-ink rounded-bl-none ring-1 ring-black/5",
                  ].join(" ")}
                >
                  {msg.isHtml ? (
                    <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            );
          })}

          {/* 응답 대기 뱃지 */}
          {waitingResponse && (
            <div className="flex justify-start">
              <div className="px-3 py-2 rounded-xl max-w-[76%] shadow-sm text-sm bg-white/90 text-brand-ink ring-1 ring-black/5 animate-pulse">
                ...
              </div>
            </div>
          )}

          {/* 카테고리 (세련된 pill 버튼) */}
          {category?.length > 0 && (
            <div className="flex flex-col gap-2 pt-1">
              {category.map((item) => (
                <button
                  key={item.no}
                  onClick={() => {
                    setChatHistory(prev => [...prev, { type: "USER", text: item.name }]);
                    if (item.type === "MAIN") getMidCategory(item.no);
                    else if (item.type === "MID") getSubCategory(item.no);
                    else if (item.type === "SUB") getDetail(item.no);
                  }}
                  className="
                    w-full h-10 px-4 rounded-full
                    bg-white text-brand-ink
                    ring-1 ring-black/5
                    hover:bg-brand-100 transition
                    text-sm font-ptd-600
                    focus:outline-none focus:ring-4 focus:ring-brand-300
                  "
                >
                  {item.name}
                </button>
              ))}
            </div>
          )}

          {/* 처음으로 */}
          <button
            onClick={handleChatRoom}
            className="
              mt-2 h-10 px-4 rounded-full
              bg-brand-100 text-brand-ink
              hover:bg-brand-300 transition
              text-sm
              focus:outline-none focus:ring-4 focus:ring-brand-300
            "
          >
            ⬅ 처음으로 이동
          </button>
        </div>

        {/* 입력 영역: Home.jsx의 ctl 스타일 계승 */}
        <div className="p-3 border-t border-white/60 bg-white/85 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              disabled={isInputDisabled}
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="메시지를 입력하세요"
              className="
                flex-1 h-11 px-4 rounded-lg
                bg-white placeholder-black/40
                ring-1 ring-brand-300
                focus:outline-none focus:ring-4
                disabled:bg-brand-50
                shadow-[inset_0_2px_6px_rgba(0,0,0,0.06)]
              "
            />
            <button
              onClick={sendMessage}
              disabled={isInputDisabled}
              className={[
                "h-11 px-5 rounded-lg font-ptd-600 text-sm text-white",
                "shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_4px_10px_rgba(0,0,0,0.10)]",
                "focus:outline-none focus:ring-4 focus:ring-brand-300",
                isInputDisabled
                  ? "bg-brand-300 cursor-not-allowed"
                  : "bg-brand-600 hover:bg-brand-500",
              ].join(" ")}
            >
              전송
            </button>
          </div>
        </div>
      </div>
    )}
  </>
);


}