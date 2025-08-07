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
  const [textHistory, setTextHistory] = useState([]);


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
    setTextHistory((prev) => [...prev, res]);
    setMessage("");
  }

  const fetchRoom = async (chat) => {
    setCurrentRoom(chat);
    const res = await viewRoomText(chat.no);
    console.log(res);
    setTextHistory(res);
  }

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

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
          {textHistory.length > 0 && (
            <>
              {/* 채팅방 타이틀 (닉네임) */}
              <div className="p-4 font-bold text-center text-2xl bg-[#C7E6C9]">
                {currentUserInfo.nickname === currentRoom.participantA ? currentRoom.participantB : currentRoom.participantA}
              </div>

              {/* 채팅 메시지 목록 */}
              <div className="flex flex-col gap-2 p-4 overflow-y-auto flex-1">
                {textHistory.map((text, idx) => {
                  const isCurrentUser = text.nickname === currentUserInfo.nickname;

                  return (
                    <div key={idx} className={`flex items-center ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                      {isCurrentUser && (
                        <span className="text-xs text-gray-500 mr-3">{formatChatTime(text.createdAt)}</span>
                      )}
                      <span className={`max-w-xs px-4 py-2 rounded-lg text-sm break-words ${isCurrentUser
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-gray-200 text-gray-800 rounded-bl-none'
                        }`}
                      >
                        {text.content}
                      </span>
                      {!isCurrentUser && (
                        <span className="text-xs text-gray-500 ml-3">{formatChatTime(text.createdAt)}</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 메시지 입력창 */}
              <div className="p-3 flex border-t">
                <input
                  type="text"
                  className="flex-1 border rounded px-3 py-2 focus:outline-none"
                  placeholder="메시지를 입력하세요"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSend();
                  }}
                />
                <button
                  className="ml-3 bg-[#3C9A5F] text-white px-5 py-2 rounded hover:bg-[#264D3D] transition-colors border-none"
                  onClick={handleSend}
                >
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