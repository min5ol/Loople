import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../templates/Header";
import instance from "../../apis/instance";
import webSocketService, { MessageType } from '../../services/WebSocketService';
import hamburgerMenu from "../../assets/hamburgerMenu.png";

const buildChatRoom = async (chatUserInfo, postId) => {
  const res = await instance.post(`/chat/completion/user/buildRoom/${postId}`, chatUserInfo);
  return res.data;
}

const getAllRoom = async (nickname) => {
  const res = await instance.get(`/chat/completion/user/allRoom/${nickname}`);
  return res.data
}

const viewRoomText = async (roomId, nickname) => {
  const res = await instance.get(`/chat/completion/user/${roomId}/text`, { params: { nickname } });
  return res.data;
}

const deleteChatRoom = async (roomId, nickname) => {
  const res = await instance.get(`/chat/completion/user/delete/${roomId}`, { params: { nickname } });
  return res.data;
}

export default function Chat() {
  const navigate = useNavigate()
  const location = useLocation();
  const currentUserInfo = location.state?.currentUserInfo;
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
    console.log("user", currentUserInfo);
    console.log("post", post);
  }, [])

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
    setCurrentRoom(null);
    setIsOpenRoom(false);

    const fetchAllRoom = async () => {
      const list = await getAllRoom(currentUserInfo.nickname);
      setChatList(list);
      console.log("list", list);
    }

    fetchAllRoom();

    if (!chatUserInfo.participantA || !chatUserInfo.participantB || !post?.no) return;

    const fetchBuild = async () => {
      const saved = await buildChatRoom(chatUserInfo, post.no);
      setCurrentRoom(saved);
      console.log("ss", saved);
      setIsOpenRoom(true);
      setIsShowChatInfo(false);
      setIsChatMenuOpen(false);
      setChatList((prev) => {
        const exists = prev.find((room) => room.no === saved.no);
        if (exists) return prev;
        return [...prev, saved];
      });
      const res = await viewRoomText(saved.no, currentUserInfo.nickname);
      setTextHistory(res);
      console.log(saved);

      fetchBuild();
    }
  }, [currentUserInfo, chatUserInfo]);


  //webSocket
  useEffect(() => {
    if (!currentUserInfo) return;

    // 접속 시 username으로 WebSocket 연결 시도
    webSocketService.connect(currentUserInfo.nickname);

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
      nickname: currentUserInfo.nickname,
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
    setCurrentRoom(chat);
    setIsOpenRoom(true);
    const res = await viewRoomText(chat.no, currentUserInfo.nickname);
    console.log(res);
    setTextHistory(res);
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
      await deleteChatRoom(currentRoom.no, currentUserInfo.nickname);
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

      <Header currentUserInfo={currentUserInfo} />
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

                  <div className="flex justify-between items-center">
                    <div>
                      {/* ✅ 게시물 제목 표시 */}
                      {chat.postTitle && (
                        <p className="text-xs text-green-600 font-semibold truncate mb-1 italic">
                          📌 {chat.postTitle}
                        </p>
                      )

                      }<div className="flex item-center">
                        <p className="text-sm text-gray-500 truncate italic p-0 m-0 w-full">
                          {chat.lastMessage ? chat.lastMessage : '메시지를 전송해 보세요 !'}
                        </p>
                      </div>
                    </div>

                    {chat.unreadCount > 0 && (
                      <div>
                        <span className="bg-red-500 text-white text-xs rounded-full px-2 ml-2">
                          {chat.unreadCount}
                        </span>
                      </div>
                    )}

                  </div>



                </li>
                <hr />
              </React.Fragment>
            ))}
          </ul>

        </div>


        {/* 채팅 디테일 */}
        <div className="flex flex-col w-[70%] bg-[#F9FDF7]">
          {isOpenRoom && (
            <>
              {/* 채팅방 타이틀 */}
              <div className="p-4 flex justify-between items-center bg-[#C7E6C9] shadow-sm relative">
                <div className="flex items-center">
                  <button className="text-xl font-normal text-gray-700 bg-transparent rounded-full border-none cursor-pointer" onClick={() => setIsOpenRoom(!isOpenRoom)}>
                    &lt;
                  </button>
                </div>

                <div className="font-bold text-xl">
                  {currentUserInfo.nickname === currentRoom.participantA
                    ? currentRoom.participantB
                    : currentRoom.participantA}
                </div>
                <div className="flex justify-center items-center">
                  <img src={hamburgerMenu} alt="메뉴" className="w-6 h-6 cursor-pointer" onClick={() => setIsChatMenuOpen(!isChatMenuOpen)} />

                </div>
                {isChatMenuOpen && (
                  <div className="absolute right-2 top-12 bg-white shadow-lg rounded-md border z-10 w-48">
                    <ul className="text-sm text-gray-700 list-none p-0">
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => {
                        setIsShowChatInfo(!isShowChatInfo);
                        setIsOpenRoom(!isChatMenuOpen);
                        setIsChatMenuOpen(!isChatMenuOpen);
                      }}>채팅방 정보</li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">채팅방 고정</li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">알림 끄기</li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600 font-semibold" onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}>
                        채팅방 나가기
                      </li>
                    </ul>
                  </div>
                )}

              </div>

              <div className="bg-white p-3 text-lg font-semibold text-green-700 truncate max-w-full flex justify-center items-center" title={currentRoom.postTitle}>
                <p className="p-0 m-0"> {currentRoom.postTitle} </p>
              </div>


              {/* 채팅 메시지 목록 */}
              <div className="flex flex-col gap-3 p-4 overflow-y-auto flex-1 scroll-smooth" ref={chatEndRef} style={{ scrollbarWidth: 'thin' }}>

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
                            className={`max-w-[70%] px-4 py-2 rounded-lg text-sm break-words shadow-sm text-[#202020] ${isCurrentUser
                              ? 'bg-[#CCE7B8] rounded-br-none'
                              : 'bg-[#F0F4EB] rounded-bl-none'
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
                  </>
                )}
              </div>

              {/* 메시지 입력창 */}
              <div className="p-3 flex border-t border-gray-200 bg-white">
                <input
                  type="text"
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2"
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

          {isShowChatInfo && (
            <div className="p-4 rounded-lg shadow-lg bg-white border border-gray-300 w-full h-full z-20 box-border relative">
              <p className="text-lg font-semibold mb-3 text-gray-800">
                채팅 상대:{" "}
                <span className="text-green-600">
                  {currentUserInfo.nickname === currentRoom.participantA
                    ? currentRoom.participantB
                    : currentRoom.participantA}
                </span>
              </p>
              <button
                className="w-full text-left py-2 px-3 mb-2 rounded hover:bg-green-100 transition-colors text-green-700 font-medium border border-green-300"
                onClick={() => navigate("/communityPost", { state: { currentUserInfo, post } })}
              >
                🔗 중고 게시글 보러가기
              </button>
              <button
                className="w-full text-left py-2 px-3 rounded hover:bg-red-100 transition-colors text-red-600 font-medium border border-red-300"
                onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
              >
                🚪 채팅방 나가기
              </button>
              <button
                className="absolute bottom-2 left-2 text-xl font-normal text-gray-700 bg-transparent rounded-full border-none cursor-pointer"
                onClick={() => { setIsShowChatInfo(false); setIsOpenRoom(true); }}
              >
                &lt;
              </button>
            </div>

          )}

          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded shadow-lg w-90 text-center">
                {isDeleting ? (
                  // ✅ 처리중 UI
                  <p className="text-gray-800 text-lg">채팅방을 삭제하는 중입니다</p>
                ) : (
                  <>
                    <p className="text-gray-800 mb-4">정말 채팅방을 나가시겠습니까?</p>
                    <p className="text-gray-800 mb-4">한 번 삭제된 채팅방 데이터는 복구할 수 없습니다.</p>
                    <div className="flex justify-center gap-4">
                      <button className="mt-2 px-4 py-2 bg-[#3C9A5F] text-white rounded hover:bg-[#264D3D] border-none" onClick={handleDelete}>
                        확인
                      </button>
                      <button className="mt-2 px-4 py-2 bg-[#3C9A5F] text-white rounded hover:bg-[#264D3D] border-none" onClick={handleDeleteCancel}>
                        취소
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}



        </div>




      </div >


    </>
  )
}