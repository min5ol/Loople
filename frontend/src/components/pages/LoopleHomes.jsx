import React, {useState} from "react";
import instance from "../../apis/instance";

export const buildRoom = async() => {
  const res = await instance.get("/chat/completion/buildRoom/withAI");
  return res.data;
}

export const getCategory = async(categoryType, parentId) => {
  const res = await instance.get("/chat/completion/category", {
    params: {
      categoryType,
      parentId,
    }
  });
  return res.data;
}

export const getDetails = async(parentId) => {
  const res = await instance.get("/chat/completion/details", {
    params: {parentId},
  });
  return res.data;
};

export default function LoopleHome(){
  const [room, setRoom] = useState(null);
  const [showChatRoom, setShowChatRoom] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { type: "AI", text: "안녕하세요😊 분리 배출 정보를 알려드리는 챗봇입니다. 버튼을 눌러주세요 !" }
  ]);
  const [isInputDisabled, setIsInputDisabled] = useState(true);
  const [userMessage, setUserMessage] = useState('');
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [details, setDetails] = useState([]);

  const handleChatRoom = async() => {
    console.log("handleChatRoom");

    setChatHistory([{ type: "AI", text: "안녕하세요😊 분리 배출 정보를 알려드리는 챗봇입니다. 버튼을 눌러주세요 !" }]);
    setCategory([]);
    setSelectedCategory(null);
    setDetails(null);
    setUserMessage('');

    //방 생성
    const room = await buildRoom();
    setRoom(room);

    //채팅방 보기 상태
    setShowChatRoom(true);

    const mainCategory = await getCategory("MAIN", null);

    setCategory(mainCategory.map(main => ({
      type: main.categoryType,
      no: main.no,
      name: main.name,
    })));
  }

  const getMidCategory = async(parentId) => {
    setCategory([]);

    const midCategory = await getCategory("MID", parentId);
  
    if(midCategory.length === 0){
      // MID가 없으면 바로 SUB 조회
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
  }

  const getSubCategory = async(parentId) => {
    setCategory([]);

    const subCategory = await getCategory("SUB", parentId);

    setCategory(subCategory.map(sub => ({
      type: sub.categoryType,
      no: sub.no,
      name: sub.name,
    })))

  }

  const getDetail = async(parentId) => {
    console.log("getdetail");
    setCategory([]);
    if(parentId == 17){
      setIsInputDisabled(false);
    } 

    const detail = await getDetails(parentId);
    setDetails(detail.map(det => ({
      infoType: det.infoType,
      content: det.content,
    })));
  }

  const sendMessage = async() => {
  }

  return(
    <div className="relative">
      <button onClick={handleChatRoom} className="fixed bottom-6 right-6 w-14 h-14 bg-[#264D3D] rounded-full text-white text-sm flex justify-center items-center shadow-lg z-50 cursor-pointer">AI</button>

      {showChatRoom && (
        <div className="fixed bottom-24 right-6 w-100 h-125 bg-white border border-gray-300 rounded-lg shadow-xl flex flex-col z-40 gap-2">
          {/* 상단 */}
          <div className="flex justify-between items-center p-3 bg-[#3C9A5F] border-b border-[#264D3D] text-[#FEF7E2] rounded-t-lg">
            <span className="font-semibold">AI 챗봇</span>
            <button onClick={() => {
              setShowChatRoom(false);
            }} className="hover:text-[#81C784] bg-transparent border-none p-0 m-0 focus:outline-none text-2xl cursor-pointer text-[#FEF7E2]">x</button>
          </div>


          {/* 채팅 내용 */}
          <div className="flex-1 p-4 overflow-y-auto space-y-2 text-sm">
            {chatHistory.map((msg, idx) => msg.type == "USER" ? (
              <div key={idx} className="text-right">
                  <span className="inline-block bg-[#F6F6F6] text-[#202020] px-3 py-2 rounded-xl max-w-[75%]">
                    {msg.text}
                  </span>
              </div>
            ):(
              <div key={idx} className="text-left">
                <span className="inline-block bg-[#F6F6F6] text-[#202020] px-3 py-2 rounded-xl max-w-[75%]">
                  {msg.text}
                </span>
              </div>
            )
            )}

            <div className="flex flex-col space-y-2 mt-2 w-[70%]">
              {category && (
                <>
                  {category.map((item) => (
                    <button key={item.no} onClick={() => { 
                      setChatHistory((prev) => [...prev, { type: "USER", text: item.name }]);

                      if (item.type === "MAIN") { getMidCategory(item.no); }
                      else if (item.type === "MID") { getSubCategory(item.no); }
                      else if (item.type === "SUB") { getDetail(item.no); }
                    }} 
                    className="px-4 py-2 bg-[#3C9A5F] text-white rounded-lg hover:bg-[#264D3D] text-sm cursor-pointer border-none">
                      {item.name}
                    </button>
                  ))}

                  <button onClick={handleChatRoom} className="mt-2 px-4 py-2 bg-[#FEF7E2] text-[#202020] rounded-lg hover:bg-[#F1E8C9] text-sm self-start border-none cursor-pointer">
                    ⬅ 처음으로 이동
                  </button>
                </>
              )}
            </div>


            <div className="flex flex-col space-y-4 mt-4">
              {details && details.map((item, idx) => {
                const titleStyle = "font-semibold text-[#264D3D] mb-2";
                const boxStyle = "bg-[#F6F6F6] p-3 rounded-md border border-gray-200 shadow-sm";

                switch (item.infoType) {
                  case "배출 방법":
                    return (
                      <div key={idx} className={boxStyle}>
                        <div className={titleStyle}>✅ 배출 방법</div>
                        <div className="whitespace-pre-line leading-relaxed">{item.content}</div>
                      </div>
                    );
                  case "주의사항":
                    return (
                      <div key={idx} className={boxStyle}>
                        <div className={titleStyle}>⚠️ 주의 사항</div>
                        <div className="whitespace-pre-line leading-relaxed">{item.content}</div>
                      </div>
                    );
                  case "FAQ":
                    return (
                      <div key={idx} className={boxStyle}>
                        <div className={titleStyle}>💬 FAQ</div>
                        <div className="whitespace-pre-line leading-relaxed">{item.content}</div>
                      </div>
                    );
                  default:
                    return (
                      <div key={idx} className={boxStyle}>
                        <div className="whitespace-pre-line leading-relaxed">{item.content}</div>
                      </div>
                    );
                }
              })}
            </div>
          </div>



          {/* 입력창 */}
          <div className="p-3 border-t flex gap-2">
            <input type="text" disabled={isInputDisabled} value={userMessage} onChange={(e) => setUserMessage(e.target.value)} className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none bg-white focus:bg-[#F6F6F6]"></input>
            <button onClick={sendMessage} className="px-4 py-2 bg-[#3C9A5F] text-white rounded-lg hover:bg-[#264D3D] text-sm cursor-pointer border-none">전송</button>
          </div>
        </div>
      )}
    </div>
  )
}