// src/components/pages/Chat.jsx

import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Header from "../templates/Header";
import instance from "../../apis/instance";
import webSocketService, { MessageType } from '../../services/WebSocketService';

const buildChatRoom = async (chatUserInfo) => {
  const res = await instance.post("/chat/completion/user/buildRoom", chatUserInfo);
  return res.data;
}

const getAllRoom = async (nickname) => {
  const res = await instance.get(`/chat/completion/user/allRoom/${nickname}`);
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
  const [currentRoom, setCurrentRoom] = useState(null);
  const [textHistory, setTextHistory] = useState([]);
  const [isOpenRoom, setIsOpenRoom] = useState(false);
  const chatEndRef = useRef(null);


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
      console.log("list", list);
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

  useEffect(() => {
    if (!currentUserInfo) return;

    // 접속 시 username으로 WebSocket 연결 시도
    webSocketService.connect(currentUserInfo.nickname);

    // ✅ 메시지 구독: 여기에서 중복 체크 추가!
    const unsubscribe = webSocketService.subscribeToMessages((msg) => {
      // 메시지가 현재 대화방과 관련 있는지 확인
      if (currentRoom && msg.roomId === currentRoom.no) {
        setTextHistory((prev) => {
          const isDuplicate = prev.some((m) =>
            m.content === msg.content &&
            m.nickname === msg.nickname &&
            m.roomId === msg.roomId
          );

          if (isDuplicate) return prev;
          return [...prev, msg];
        });
      }
    });

    // 언마운트 시 WebSocket 연결 해제
    return () => {
      unsubscribe();
      webSocketService.disconnect();
    };
  }, [currentUserInfo, currentRoom]);


  useEffect(() => {
    scrollToBottom();
  }, [textHistory]);

  useEffect(() => {
    if (isOpenRoom) {
      scrollToBottom();
    }
  }, [isOpenRoom]);

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

    const myMessage = {
      nickname: currentUserInfo.nickname,
      content: message,
      type: MessageType.CHAT,
      roomId: currentRoom.no, // 방 ID 포함 필요
      createdAt: new Date().toISOString(),
    };

    webSocketService.sendMessage(myMessage);

    setTextHistory((prev) => [...prev, myMessage]);
    console.log(myMessage);

    setChatList((prevChatList) => {
      const updatedList = prevChatList.map((list) => {
        if (list.no === currentRoom.no) {
          return {
            ...list,
            updatedAt: new Date().toISOString(),
            lastMessage: message,
          };
        }
        return list;
      });

      // updatedAt을 기준으로 정렬
      return updatedList.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    });

    setMessage("");
  };


  const fetchRoom = async (chat) => {
    setCurrentRoom(chat);
    setIsOpenRoom(true);
    const res = await viewRoomText(chat.no);
    console.log(res);
    setTextHistory(res);
  }

  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>

      <Header />
      <div className="flex mx-auto h-[600px] w-full max-w-4xl border rounded shadow mt-20 overflow-hidden">

        {/* 채팅 리스트 */}
        <div className="bg-white w-[30%] overflow-y-auto border-r border-gray-300">
          <h2 className="p-4 font-bold text-center text-xl bg-[#C7E6C9] shadow-sm m-0">
            채팅 목록
          </h2>
          <ul className="list-none p-0 m-0">
            {chatList.length > 0 && chatList.map((chat) => (
              <React.Fragment key={chat.no}>
                <li className="p-2 border-b border-gray-100 cursor-pointer hover:bg-[#F3F8F2] transition-colors" onClick={() => fetchRoom(chat)}>
                  <div className="flex justify-between items-center mb-1 p-0">
                    <p className="font-medium text-gray-800 m-0">
                      {currentUserInfo.nickname === chat.participantA ? chat.participantB : chat.participantA}
                    </p>
                    <p className="text-xs text-gray-400 m-0">{formatChatTime(chat.updatedAt)}</p>
                  </div>
                  <div className="flex item-center">
                    <p className="text-sm text-gray-500 truncate italic p-0 m-0 w-full">
                      {chat.lastMessage ? chat.lastMessage : '메시지를 전송해 보세요 !'}
                    </p>
                  </div>
                </li>
                <hr className="border-solid border-gray-500" />

              </React.Fragment>
            ))}
          </ul>
        </div>


        {/* 채팅 디테일 */}
        <div className="flex flex-col w-[70%] bg-[#F9FDF7]">
          {isOpenRoom && (
            <>
              {/* 채팅방 타이틀 */}
              <div className="p-4 font-bold text-center text-xl bg-[#C7E6C9] shadow-sm">
                {currentUserInfo.nickname === currentRoom.participantA ? currentRoom.participantB : currentRoom.participantA}
              </div>

              {/* 채팅 메시지 목록 */}
              <div className="flex flex-col gap-3 p-4 overflow-y-auto flex-1 scroll-smooth" style={{ scrollbarWidth: 'thin' }}>
                {textHistory.length > 0 && (
                  <>
                    {textHistory.map((text, idx) => {
                      const isCurrentUser = text.nickname === currentUserInfo.nickname;
                      return (
                        <div
                          key={idx}
                          className={`flex items-end ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                          {isCurrentUser && (
                            <span className="text-xs text-gray-400 mr-2">{formatChatTime(text.createdAt)}</span>
                          )}
                          <div
                            className={`max-w-[70%] px-4 py-2 rounded-lg text-sm break-words shadow-sm ${isCurrentUser
                              ? 'bg-blue-500 text-white rounded-br-none'
                              : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                              }`}
                          >
                            {text.content}
                          </div>
                          {!isCurrentUser && (
                            <span className="text-xs text-gray-400 ml-2">{formatChatTime(text.createdAt)}</span>
                          )}
                        </div>
                      );
                    })}
                    <div ref={chatEndRef} />
                  </>
                )}
              </div>

              {/* 메시지 입력창 */}
              <div className="p-3 flex border-t border-gray-200 bg-white">
                <input
                  type="text"
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 transition"
                  placeholder="메시지를 입력하세요"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSend();
                  }}
                />
                <button
                  className="ml-3 bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition-colors border-none"
                  onClick={handleSend}
                >
                  전송
                </button>
              </div>
            </>
          )}
        </div>




      </div >


    </>
  )
}