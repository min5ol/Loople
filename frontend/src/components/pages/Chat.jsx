import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../templates/Header";
import instance from "../../apis/instance";

const buildChatRoom = async (chatUserInfo) => {
  const res = await instance.post("/chat/completion/user/buildRoom", chatUserInfo);
  return res.data;
}

const getAllRoom = async (nickname) => {
  const res = await instance.get(`/chat/completion/user/allRoom/${nickname}`);
  return res.data
}

const sendMessage = async (payLoad) => {
  const res = await instance.post("/chat/completion/user/send", payLoad);
  return res.data
}

const viewRoomText = async (roomId) => {
  const res = await instance.get(`/chat/completion/user/${roomId}/text`);
  return res.data;
}

export default function Chat() {
  const location = useLocation();
  const currentUserInfo = location.state?.currentUserInfo;
  const post = location.state?.post;

  const [receiver, setReceiver] = useState(null);
  const [chatList, setChatList] = useState([]);
  const [chatUserInfo, setChatUserInfo] = useState(null);
  const [message, setMessage] = useState("");
  const [currentRoom, setCurrentRoom] = useState([]);
  const [beforeText, setBeforeText] = useState([]);


  useEffect(() => {
    if (currentUserInfo && post) {
      setChatUserInfo({
        participantA: currentUserInfo.nickname,
        participantB: post.nickname,
      });
    }
  }, [currentUserInfo, post]);

  useEffect(() => {
    setChatList([]);

    const fetchAllRoom = async () => {
      const list = await getAllRoom(currentUserInfo.nickname);
      setChatList(list);
      console.log(list);
    }

    fetchAllRoom();

    if (currentUserInfo != null && post != null) {
      setReceiver(post);

      const fetchBuild = async () => {
        const saved = await buildChatRoom(chatUserInfo);
        setCurrentRoom(saved);
        setChatList((prev) => [...prev, saved]);
        console.log(saved);
      };

      fetchBuild();
    }
  }, [currentUserInfo, chatUserInfo]);

  const formatChatTime = (updatedAt) => {
    const date = new Date(updatedAt);
    const now = new Date();

    const isToday =
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate();

    if (isToday) {
      // 시:분 (두 자리 맞춤)
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${hours}:${minutes}`;
    } else {
      // 년.월.일
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}.${month}.${day}`;
    }

  }

  const handleSend = async () => {
    if (!message.trim()) return;

    const payLoad = {
      nickname: currentUserInfo.nickname,
      roomId: currentRoom.no,
      content: message,
    }

    const res = await sendMessage(payLoad);
    console.log("send", res);
    setMessage("");
  }

  const fetchRoom = async(chat) => {
    const res = await viewRoomText(chat.no);
    console.log(res);
    setBeforeText(res);
  }


  return (
    <>

      <Header />
      <div className="flex mx-auto h-[600px] w-full max-w-4xl border rounded shadow mt-20 overflow-hidden">
        {/* 채팅 리스트 */}
        <div className="bg-white w-[30%] overflow-y-auto border-r border-gray-300">
          <ul className="list-none p-0">
            {chatList.length > 0 && chatList.map((chat, key) => (
              <li key={key} className="p-4 border-b border-gray-200 cursor-pointer hover:bg-[#F9FDF7]" onClick={() => fetchRoom(chat)}>
                <div className="flex justify-between">
                  <p className="font-semibold">{currentUserInfo.nickname === chat.participantA ? chat.participantB : chat.participantA}</p>
                  <p className="text-sm text-gray-500">{formatChatTime(chat.updatedAt)}</p>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {chat.lastMessage && (
                    chat.lastMessage
                  )}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* 채팅 디테일 */}
        <div className="flex flex-col w-[70%] bg-[#F9FDF7]">
          {/* beforeText && () */}
          {receiver && (
            <>
              <div className="p-4  font-bold text-center text-2xl bg-[#C7E6C9]">
                {receiver.nickname}
              </div>

              {/* 메시지 리스트 영역 */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {beforeText>0 && beforeText.map((text, idx) => {
                  <h2>{text.content}</h2>
                  // <h2>{text.createdAt}</h2>
                })}
              </div>

              {/* 입력창 */}
              <div className="p-3 flex">
                <input type="text" className="flex-1 border rounded px-3 py-2 focus:outline-none" placeholder="메시지를 입력하세요" value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }} />
                <button className="ml-3 bg-[#3C9A5F] text-white px-5 py-2 rounded hover:bg-[#264D3D] transition-colors border-none" onClick={handleSend}>
                  전송
                </button>
              </div>
            </>
          )}
        </div>
      </div>


    </>
  )
}