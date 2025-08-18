// src/components/pages/Chat.jsx

import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../templates/Header";
import instance from "../../apis/instance";
import webSocketService, { MessageType } from '../../services/WebSocketService';
import hamburgerMenu from "../../assets/hamburgerMenu.png";
import { useAuthStore } from "../../store/authStore";

const buildChatRoom = async (partner, postId) => {
  const res = await instance.get(`/chat/completion/user/buildRoom/${postId}`, { params: { partner } });
  return res.data;
}

const getAllRoom = async () => {
  const res = await instance.get(`/chat/completion/user/allRoom`);
  return res.data
}

const viewRoomText = async (roomId) => {
  const res = await instance.get(`/chat/completion/user/${roomId}/text`);
  return res.data;
}

const deleteChatRoom = async (roomId) => {
  const res = await instance.get(`/chat/completion/user/delete/${roomId}`);
  return res.data;
}

export default function Chat() {
  const { userInfo, clearAuthInfo } = useAuthStore();
  const navigate = useNavigate()
  const location = useLocation();
  const post = location.state?.post;

  const [chatList, setChatList] = useState([]);
  const [chatUserInfo, setChatUserInfo] = useState({
    participantA: "",
    participantB: ""
  });

  const [message, setMessage] = useState("");
  const [currentRoom, setCurrentRoom] = useState(null);
  const [textHistory, setTextHistory] = useState([]);
  const [isOpenRoom, setIsOpenRoom] = useState(false);
  const chatEndRef = useRef(null);
  const [isChatMenuOpen, setIsChatMenuOpen] = useState(false);
  const [isShowChatInfo, setIsShowChatInfo] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);


  useEffect(() => {
    console.log("user", userInfo);
    console.log("post", post);
  }, [])

  // 1. chatUserInfo 설정 (userInfo, post가 준비되었을 때만)
  useEffect(() => {
    if (!userInfo || !post) return;

    setChatUserInfo({
      participantA: userInfo.nickname,
      participantB: post.nickname,
    });
  }, [userInfo, post]);

  // 2. 채팅방 및 채팅 리스트 설정
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!chatUserInfo.participantA || !chatUserInfo.participantB || !post?.no) return;

        // 1. 기존 채팅방 리스트 가져오기
        const list = await getAllRoom();
        setChatList(list);

        // 2. 방 생성 또는 가져오기
        const saved = await buildChatRoom(post.nickname, post.no);
        setCurrentRoom(saved);
        setIsOpenRoom(true);
        setIsShowChatInfo(false);
        setIsChatMenuOpen(false);

        // 3. 채팅방 리스트에 추가
        setChatList((prev) => {
          const filtered = prev.filter(room => room.no !== saved.no); // 중복 제거
          return [saved, ...filtered]; // 새 방을 맨 앞으로!
        });

        // 4. 채팅 기록 가져오기
        const res = await viewRoomText(saved.no);
        setTextHistory(res);
      } catch (error) {
        console.error("채팅방 생성 또는 데이터 로딩 실패:", error);
      }
    };

    fetchData();
  }, [chatUserInfo, post]);



  //webSocket
  useEffect(() => {
    if (!userInfo) return;

    // 접속 시 username으로 WebSocket 연결 시도
    webSocketService.connect(userInfo.nickname);

    // ✅ 메시지 구독: 여기에서 중복 체크 추가!
    const unsubscribe = webSocketService.subscribeToMessages((msg) => {
      if (!msg) return;

      if (currentRoom && msg.roomId === currentRoom.no) {
        // 시간 분까지만 포맷해서 비교하는 함수
        function formatToSecond(dateStr) {
          if (!dateStr) return "";
          const str = typeof dateStr === "string" ? dateStr : getLocalDateTimeString();
          return str.substring(0, 19);
        }

        setTextHistory((prev) => {
          const isDuplicate = prev.some(m =>
            m.content === msg.content &&
            m.nickname === msg.nickname &&
            m.roomId === msg.roomId &&
            formatToSecond(m.createdAt) === formatToSecond(msg.createdAt)
          );

          if (isDuplicate) return prev;

          // setChatList((prevChatList) => {
          //   const updatedList = prevChatList.map((list) => {
          //     if (list.no === currentRoom.no) {
          //       return {
          //         ...list,
          //         updatedAt: msg.createdAt || new Date(),
          //         lastMessage: msg.content,
          //         unreadCount: 0, // 현재 열려있는 방이니 안 읽은 거 없음
          //       };
          //     }
          //     return list;
          //   });
          //   return updatedList.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
          // });

          // return [...prev, msg];
        });

      }
      //   else {
      //     // 현재 열려있지 않은 방 메시지 -> 알림 처리
      //     setChatList((prevChatList) => {
      //       const updatedList = prevChatList.map((list) => {
      //         if (list.no === msg.roomId) {
      //           return {
      //             ...list,
      //             updatedAt: msg.createdAt || getLocalDateTimeString(),
      //             lastMessage: msg.content,
      //             unreadCount: (list.unreadCount || 0) + 1, // 안 읽은 메시지 수 증가
      //           };
      //         }
      //         return list;
      //       });
      //       return updatedList.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      //     });

      //     // 예: 브라우저 알림 띄우기 (권한 필요)
      //     if (Notification.permission === "granted") {
      //       new Notification(`새 메시지: ${msg.content}`);
      //     }
      //   }
    });



    // 언마운트 시 WebSocket 연결 해제
    return () => {
      unsubscribe();
      webSocketService.disconnect();
    };
  }, [userInfo, currentRoom]);


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


  function getLocalDateTimeString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }


  const handleSend = async () => {
    if (!message.trim()) return;


    const myMessage = {
      nickname: userInfo.nickname,
      content: message,
      type: MessageType.CHAT,
      roomId: currentRoom.no, // 방 ID 포함 필요
      createdAt: getLocalDateTimeString(),
    };

    webSocketService.sendMessage(myMessage);

    setTextHistory((prev) => [...prev, myMessage]);
    console.log(myMessage);

    setChatList((prevChatList) => {
      const updatedList = prevChatList.map((list) => {
        if (list.no === currentRoom.no) {
          return {
            ...list,
            updatedAt: getLocalDateTimeString(),
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
    const res = await viewRoomText(chat.no);
    setTextHistory(res);
    setIsOpenRoom(true);
    setCurrentRoom(chat);
  }

  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollTop = chatEndRef.current.scrollHeight;
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(!showDeleteConfirm);
    setIsChatMenuOpen(!isChatMenuOpen);
  }

  const handleDelete = async () => {
    setIsDeleting(true); // 🔄 삭제 중 표시 시작
    try {
      await deleteChatRoom(currentRoom.no);
      setChatList(prevList => prevList.filter(room => room.no !== currentRoom.no));
      setCurrentRoom(null);
      setIsShowChatInfo(false);
      setIsOpenRoom(false);
      setShowDeleteConfirm(false); // 모달 닫기 (이 시점에서!)
    } catch (error) {
      console.error("채팅방 삭제 실패:", error);
    } finally {
      setIsDeleting(false); // ✅ 끝나면 항상 끔
    }
  }


return (
  <>
    <Header />

    <div className="mx-auto mt-20 w-full max-w-5xl rounded-2xl overflow-hidden bg-white/80 backdrop-blur-md ring-1 ring-black/5 shadow-[0_12px_28px_rgba(0,0,0,0.08)]">
      <div className="flex h-[640px]">

        {/* 채팅 리스트 */}
        <aside className="w-[32%] min-w-[240px] border-r border-[#EAEAEA] bg-white flex flex-col">
          <div className="px-4 py-3 text-sm font-ptd-700 text-[#202020] bg-white/90 sticky top-0 z-10 ring-1 ring-black/5">
            채팅 목록
          </div>

          <ul className="flex-1 overflow-y-auto">
            {chatList.length > 0 &&
              chatList.map((chat) => (
                <li
                  key={chat.no}
                  className="px-4 py-3 border-b border-[#F0F0F0] cursor-pointer hover:bg-[#FAFAFA] transition"
                  onClick={() => fetchRoom(chat)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="m-0 text-[13px] font-ptd-600 text-[#202020] truncate">
                      {userInfo.nickname === chat.participantA
                        ? chat.participantB
                        : chat.participantA}
                    </p>
                    <p className="m-0 text-[11px] text-[#9CA3AF]">
                      {formatChatTime(chat.updatedAt)}
                    </p>
                  </div>

                  {/* 게시물 제목 */}
                  {chat.postTitle && (
                    <p className="m-0 mb-0.5 text-[11px] text-[#166534]/80 truncate">
                      📌 {chat.postTitle}
                    </p>
                  )}

                  <div className="flex items-center justify-between gap-2">
                    <p className="m-0 text-[12px] text-[#6B7280] italic truncate">
                      {chat.lastMessage || "메시지를 전송해 보세요!"}
                    </p>
                    {chat.unreadCount > 0 && (
                      <span className="shrink-0 px-2 py-0.5 rounded-full text-[11px] bg-[#EF4444] text-white">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </li>
              ))}
          </ul>
        </aside>

        {/* 채팅 디테일 */}
        <section className="flex-1 bg-[#F6F6F6] flex flex-col">
          {isOpenRoom && currentRoom && (
            <>
              {/* 상단 바 */}
              <div className="px-4 py-3 flex items-center justify-between bg-white/90 backdrop-blur-md ring-1 ring-black/5">
                <button
                  className="text-sm text-[#404040] rounded-full hover:bg-[#F3F3F3] w-8 h-8 inline-flex items-center justify-center"
                  onClick={() => setIsOpenRoom(!isOpenRoom)}
                  aria-label="목록으로"
                >
                  ‹
                </button>

                <div className="text-[15px] font-ptd-700 text-[#202020] truncate">
                  {userInfo.nickname === currentRoom.participantA
                    ? currentRoom.participantB
                    : currentRoom.participantA}
                </div>

                <button
                  className="w-8 h-8 rounded-full hover:bg-[#F3F3F3] inline-flex items-center justify-center"
                  onClick={() => setIsChatMenuOpen(!isChatMenuOpen)}
                  aria-label="채팅 메뉴"
                >
                  <img src={hamburgerMenu} alt="" className="w-4 h-4 opacity-70" />
                </button>

                {/* 드롭다운 메뉴 */}
                {isChatMenuOpen && (
                  <div className="absolute right-4 top-14 w-44 rounded-lg bg-white ring-1 ring-black/5 shadow-lg z-10">
                    <ul className="py-1 text-[13px] text-[#374151]">
                      <li
                        className="px-3 py-2 hover:bg-[#F7F7F7] cursor-pointer"
                        onClick={() => {
                          setIsShowChatInfo(!isShowChatInfo);
                          setIsOpenRoom(!isChatMenuOpen);
                          setIsChatMenuOpen(!isChatMenuOpen);
                        }}
                      >
                        채팅방 정보
                      </li>
                      <li className="px-3 py-2 hover:bg-[#F7F7F7] cursor-pointer">
                        채팅방 고정
                      </li>
                      <li className="px-3 py-2 hover:bg-[#F7F7F7] cursor-pointer">
                        알림 끄기
                      </li>
                      <li
                        className="px-3 py-2 hover:bg-[#F7F7F7] cursor-pointer text-[#B91C1C] font-ptd-600"
                        onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
                      >
                        채팅방 나가기
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* 게시물 제목 바 */}
              <div
                className="px-4 py-2 bg-white text-[13px] text-[#166534]/85 text-center truncate ring-1 ring-black/5"
                title={currentRoom.postTitle}
              >
                {currentRoom.postTitle}
              </div>

              {/* 메시지 리스트 */}
              <div
                ref={chatEndRef}
                className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
                style={{ scrollbarWidth: "thin" }}
              >
                {textHistory?.length > 0 &&
                  textHistory.map((text, idx) => {
                    const isMe = text.nickname === userInfo.nickname;
                    return (
                      <div
                        key={idx}
                        className={`flex items-end ${isMe ? "justify-end" : "justify-start"}`}
                      >
                        {isMe && (
                          <span className="text-[11px] text-[#9CA3AF] mr-2">
                            {formatChatTime(text.createdAt)}
                          </span>
                        )}
                        <div
                          className={[
                            "max-w-[72%] px-3 py-2 rounded-2xl text-[13px] shadow-sm",
                            isMe
                              ? "bg-white text-[#202020] rounded-br-none ring-1"
                              : "bg-[#F3F4F6] text-[#202020] rounded-bl-none",
                          ].join(" ")}
                          style={isMe ? { boxShadow: "0 2px 6px rgba(0,0,0,0.06)", borderColor: "rgba(129,199,132,0.45)" } : {}}
                        >
                          {text.content}
                        </div>
                        {!isMe && (
                          <span className="text-[11px] text-[#9CA3AF] ml-2">
                            {formatChatTime(text.createdAt)}
                          </span>
                        )}
                      </div>
                    );
                  })}
              </div>

              {/* 입력 영역 */}
              <div className="px-3 py-3 bg-white ring-1 ring-[#EAEAEA]">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    className="
                      flex-1 rounded-lg px-3 py-2 text-[14px]
                      bg-white border border-[#E5E7EB]
                      placeholder:text-[#9CA3AF]
                      focus:outline-none focus:ring-2 focus:ring-[#81C784]/40 focus:border-transparent
                    "
                    placeholder="메시지를 입력하세요"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSend();
                    }}
                  />
                  <button
                    className="
                      px-4 h-10 rounded-lg text-sm font-ptd-600
                      bg-[#202020] text-white
                      hover:bg-[#111]
                      transition
                    "
                    onClick={handleSend}
                  >
                    전송
                  </button>
                </div>
              </div>
            </>
          )}

          {/* 채팅방 정보 패널 */}
          {isShowChatInfo && (
            <div className="relative flex-1 bg-white p-5 ring-1 ring-black/5">
              <p className="text-[15px] font-ptd-700 text-[#202020] mb-3">
                채팅 상대:{" "}
                <span className="text-[#166534]">
                  {userInfo.nickname === currentRoom?.participantA
                    ? currentRoom?.participantB
                    : currentRoom?.participantA}
                </span>
              </p>
              <button
                className="w-full text-left px-3 py-2 rounded-lg ring-1 ring-black/5 hover:bg-[#F7F7F7] transition text-[#202020] text-[14px] mb-2"
                onClick={() => navigate("/communityPost", { state: { post } })}
              >
                🔗 중고 게시글 보러가기
              </button>
              <button
                className="w-full text-left px-3 py-2 rounded-lg ring-1 ring-red-200/60 hover:bg-red-50 transition text-[#B91C1C] text-[14px]"
                onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
              >
                🚪 채팅방 나가기
              </button>

              <button
                className="absolute bottom-3 left-3 w-9 h-9 rounded-full hover:bg-[#F3F3F3] inline-flex items-center justify-center text-[#404040]"
                onClick={() => {
                  setIsShowChatInfo(false);
                  setIsOpenRoom(true);
                }}
                aria-label="뒤로"
              >
                ‹
              </button>
            </div>
          )}
        </section>
      </div>
    </div>

    {/* 삭제 확인 모달 */}
    {showDeleteConfirm && (
      <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
        <div className="w-[92%] max-w-sm rounded-2xl bg-white p-5 ring-1 ring-black/5 shadow-2xl">
          {isDeleting ? (
            <p className="text-center text-[15px] text-[#374151]">채팅방을 삭제하는 중입니다…</p>
          ) : (
            <>
              <p className="text-[#202020] text-[15px] font-ptd-600 text-center">
                정말 채팅방을 나가시겠습니까?
              </p>
              <p className="mt-2 text-center text-[13px] text-[#6B7280]">
                한 번 삭제된 채팅방 데이터는 복구할 수 없습니다.
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <button
                  className="px-4 h-10 rounded-lg text-sm bg-[#EF4444] text-white hover:bg-[#DC2626] transition"
                  onClick={handleDelete}
                >
                  삭제
                </button>
                <button
                  className="px-4 h-10 rounded-lg text-sm bg-white ring-1 ring-black/10 hover:bg-[#F7F7F7] transition"
                  onClick={handleDeleteCancel}
                >
                  취소
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    )}
  </>
);
}