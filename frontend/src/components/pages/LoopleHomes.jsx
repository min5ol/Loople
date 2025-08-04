import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../apis/instance";
import Community from "./Community";

//#81C784, #749E89, #3C9A5F, #264D3D, #F6F6F6, #FEF7E2, #202020

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
        case "지역별 URL": prefix = ""; break;
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

    const detail = await getDetails(parentId);
    console.log("getDetails 응답, detail: ", detail);

    const detailMessages = getDetailMessages(detail, parentId);

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
        <button onClick={() => navigate("/mypage")} className="text-sm text-[#264D3D] font-medium hover:underline">마이페이지</button>
        <button onClick={() => navigate("/myroom")} className="text-sm text-[#264D3D] font-medium hover:underline">마이룸</button>
        <button onClick={() => navigate("/myavatar")} className="text-sm text-[#264D3D] font-medium hover:underline">마이아바타</button>
        <button onClick={() => navigate("/myloopling")} className="text-sm text-[#264D3D] font-medium hover:underline">마이루플링</button>
        <button onClick={() => navigate("/myvillage")} className="text-sm text-[#264D3D] font-medium hover:underline">마이빌리지</button>
        <button onClick={() => navigate("/quiz")} className="text-sm text-[#264D3D] font-medium hover:underline">퀴즈 풀기</button>
        <button onClick={() => navigate("/rule")} className="text-sm text-[#264D3D] font-medium hover:underline">지역별 규칙 조회</button>
      </div>

      {/* 지역 커뮤니티 */}
      <div className="mt-20 px-6 py-10 max-w-4xl mx-auto bg-[#FEF7E2] border border-[#264D3D] rounded-xl shadow-lg">
        <Community />
      </div>



      {/* 💬 AI 챗봇 플로팅 버튼 */}
      <button
        onClick={handleChatRoom}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#264D3D] rounded-full text-white text-sm flex justify-center items-center shadow-lg z-50 cursor-pointer"
      >
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
                aria-label="Close Chat"
              >
                ×
              </button>
            </div>

            {/* 챗봇 내용 */}
            <div className="flex-1 p-4 overflow-y-auto space-y-2 text-sm">
              {chatHistory.map((msg, idx) => {
                if (msg.type === "USER") {
                  const isLastUserMessage = !chatHistory.slice(idx + 1).some(m => m.type === "USER");
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
                      <span className="inline-block bg-[#F0F4EB] text-[#202020] px-3 py-2 rounded-xl w-[75%] whitespace-pre-line">
                        {msg.isHtml ? (
                          <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                        ) : (
                          msg.text
                        )}
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
                {category && category.length > 0 ? (
                  category.map((item) => (
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
                  ))
                ) : null}
              </div>

              {/* 처음으로 버튼 */}
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
                className={`px-4 py-2 rounded-lg text-sm border-none bg-[#3C9A5F] ${isInputDisabled
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