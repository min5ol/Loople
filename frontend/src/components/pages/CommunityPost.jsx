import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useCurrentUser from "../../hooks/useCurrentUser";
import Header from "../templates/Header";
import instance from "../../apis/instance";

// 댓글 목록 조회 API 호출 함수
export const getComments = async (boardId) => {
  const res = await instance.get(`/community/${boardId}/comment`);
  return res.data;
};

// 댓글 등록 API 호출 함수
export const submitComment = async (sender) => {
  const res = await instance.post(`/community/comment`, sender);
  return res.data;
};

// 댓글 수정 API 호출 함수
export const editComment = async (sender) => {
  const res = await instance.post("/community/comment/edit", sender);
  return res.data;
};

export default function CommunityPost() {
  // React Router로부터 전달받은 게시글 데이터 및 네비게이트 함수
  const location = useLocation();
  const navigate = useNavigate();
  const post = location.state.res;

  // 댓글 리스트 상태
  const [comments, setComments] = useState([]);

  // 현재 수정중인 댓글 ID와 수정 텍스트 상태
  const [editCommentId, setEditCommentId] = useState(null);
  const [editText, setEditText] = useState("");

  // 댓글 수정 input에 포커스 주기 위한 ref
  const inputRef = useRef(null);

  // 댓글 입력창 input에 대한 ref (상태 대신 ref로 값 읽기)
  const commentInputRef = useRef(null);

  //현재 유저 정보
  const currentUserId = useCurrentUser();
  console.log("냠", currentUserId);

  // 컴포넌트가 처음 렌더링되거나 post.no가 바뀔 때 댓글 목록을 가져옴
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await getComments(post.no);
        console.log("기존 댓글: ", response);
        setComments(response);
      } catch (error) {
        console.error("Failed to fetch comments", error);
      }
    };

    fetchComments();
  }, [post.no]);

  // 댓글 수정 input이 열릴 때 포커스를 자동으로 줌
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [editCommentId]);

  // 첨부파일 확장자 추출 함수
  const getFileExtension = (filename) => {
    return filename?.split(".").pop().toLowerCase();
  };

  // 이미지 파일인지 체크
  const isImageFile = (filename) => {
    const ext = getFileExtension(filename);
    return ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext);
  };

  // 문서 파일인지 체크
  const isDocumentFile = (filename) => {
    const ext = getFileExtension(filename);
    return ["pdf", "hwp", "doc", "docx", "xls", "xlsx", "txt"].includes(ext);
  };

  // 댓글 등록 함수 - inputRef로부터 댓글 내용 읽음
  const handleComment = async () => {
    const comment = commentInputRef.current.value;

    // 빈 문자열은 무시
    if (!comment.trim()) return;

    // 서버에 보낼 데이터 생성
    const sender = {
      boardId: post.no,
      comment: comment,
      parentId: "",
    };

    try {
      // 댓글 등록 API 호출
      const res = await submitComment(sender);
      console.log("제출", res);

      // 등록 후 댓글 목록을 다시 가져와서 갱신
      const updatedComments = await getComments(post.no);
      setComments(updatedComments);

      // 입력창 초기화
      commentInputRef.current.value = "";
    } catch (error) {
      console.error("댓글 등록 실패", error);
    }
  };

  // 댓글 수정 버튼 클릭 시 해당 댓글 내용으로 수정창 열기
  const handleEditClick = (comment) => {
    setEditCommentId(comment.no);
    setEditText(comment.comment);
  };

  // 댓글 수정 취소 버튼 클릭 시 수정 상태 초기화
  const handleEditCancel = () => {
    setEditCommentId(null);
    setEditText("");
  };

  // 댓글 수정 저장 버튼 클릭 시 서버에 수정 요청
  const handleEditSave = async () => {
    const sender = {
      no: editCommentId,
      comment: editText,
    };

    try {
      // 댓글 수정 API 호출
      await editComment(sender);

      // 수정 후 댓글 목록 다시 불러오기
      const updatedComments = await getComments(post.no);
      console.log(updatedComments);
      setComments(updatedComments);

      // 수정 상태 초기화
      setEditCommentId(null);
      setEditText("");
    } catch (error) {
      console.error("댓글 수정 실패", error);
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-3xl mx-auto mt-20 p-6 bg-white rounded-lg">
        {/* 게시글 제목 및 작성자 정보 */}
        <div>

          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-[#264D3D] mb-4">{post.title}</h2>

            <div className="relative group inline-block">
              <div className="w-6 h-6 cursor-pointer flex items-center justify-center rounded">
                <span className="select-none text-lg">⋮</span>
              </div>

              {/* 옵션 메뉴 (수정, 삭제, 신고) */}
              <div className="absolute top-[110%] right-0 group-hover:block hidden w-32 bg-white rounded-md shadow-lg z-50 text-[#3C9A5F] text-sm">
                <p className="px-3 py-2 hover:bg-gray-100 cursor-pointer mt-1 mb-0">게시글 수정</p>
                <p className="px-3 py-2 hover:bg-gray-100 cursor-pointer mt-3 mb-3">게시글 삭제</p>
                <p className="px-3 py-2 hover:bg-gray-100 cursor-pointer mt-0 mb-1" onClick={() => navigate("/reportPage", {
                  state: {
                    target: "post",
                    targetId: post.no,
                  }
                })}>게시글 신고</p>
              </div>
            </div>
          </div>


          <div className="flex justify-between text-sm text-[#3C9A5F] mb-2">
            <span>
              작성자: <span className="font-semibold">{post.nickname}</span>
            </span>
            {post.category === "USED" && (
              <button className="bg-[#3C9A5F] text-[#FEF7E2] px-3 py-1 rounded hover:bg-[#264D3D] transition-colors">
                작성자와 채팅하기
              </button>
            )}
          </div>

          <div className="text-xs text-[#749E89] mb-4">
            작성일: {new Date(post.createdAt).toLocaleString()}
          </div>

          {/* 게시글 내용 */}
          <p className="text-[#202020] leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>

          {/* 첨부파일 있을 때 처리 */}
          {post.attachedFile && (
            <div className="mt-4">
              {isImageFile(post.attachedFile) ? (
                <img src={post.attachedFile} alt="첨부 이미지" className="max-w-full rounded-lg shadow-md border border-[#81C784]" />
              ) : isDocumentFile(post.attachedFile) ? (
                <a href={post.attachedFile} download className="text-[#3C9A5F] hover:underline font-medium" target="_blank" rel="noopener noreferrer" >
                  첨부파일 다운로드
                </a>
              ) : (
                <span className="text-red-600 font-semibold">
                  지원하지 않는 파일 형식입니다.
                </span>
              )}
            </div>
          )}
        </div>

        {/* 댓글 섹션 */}
        <section className="flex flex-col bg-[#f9fdf7] rounded-lg p-4 border border-[#C7E6C9]">
          <p className="text-xl font-semibold text-[#264D3D] m-0 mb-2">댓글</p>
          <hr />

          {/* 댓글 리스트 */}
          <div className="space-y-4 max-h-96 mb-6 flex-grow overflow-y-auto">
            {comments.length > 0 &&
              comments.map((comment) => (
                <div
                  key={comment.no}
                  className="bg-white p-5 rounded shadow border border-[#C7E6C9]"
                >
                  <div className="flex justify-between items-center text-sm text-[#3C9A5F] mb-1">
                    <span className="font-semibold">{comment.nickname}</span>
                    <div className="flex items-center gap-2">
                      <div>
                        <span className="block text-xs text-gray-400">
                          {new Date(comment.createdAt).toLocaleString()}
                        </span>
                        {comment.updatedAt != comment.createdAt && (
                          <span className="block text-xs text-gray-400">
                            수정: {new Date(comment.updatedAt).toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* 댓글 옵션 버튼 */}
                      <div className="relative group inline-block">
                        <div className="w-5 h-5 cursor-pointer flex items-center justify-center">
                          <span className="select-none">⋮</span>
                        </div>

                        {/* 옵션 메뉴 (수정, 삭제, 신고) */}

                        {
                          comment.userId === currentUserId && (
                            <button onClick={() => handleEdit(comment)}>수정</button>
                          )
                        }

                        <div className="absolute top-full right-0 mt-0 group-hover:block hidden w-28 bg-white rounded shadow-lg z-50">
                          <p className="px-3 py-2 hover:bg-gray-100 cursor-pointer mt-1 mb-0" onClick={() => handleEditClick(comment)}>댓글 수정</p>
                          <p className="px-3 py-2 hover:bg-gray-100 cursor-pointer mt-3 mb-3">댓글 삭제</p>
                          <p className="px-3 py-2 hover:bg-gray-100 cursor-pointer mt-0 mb-1" onClick={() => navigate("/reportPage", {
                            state: {
                              target: "comment",
                              targetId: comment.no,
                            }
                          })}>댓글 신고</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 수정 중인 댓글은 input으로, 아닌 경우는 일반 텍스트로 표시 */}
                  {editCommentId === comment.no ? (
                    <div>
                      <input
                        ref={inputRef}
                        type="text"
                        className="w-full box-border pt-3 pb-3 border"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      />
                      <div className="flex justify-end gap-2 mt-2 right">
                        <button
                          onClick={handleEditSave}
                          className="px-3 py-1 bg-[#3C9A5F] text-white rounded border-none"
                        >
                          수정
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="px-3 py-1 bg-[#f2f2f2] rounded border-none"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p>{comment.comment}</p>
                  )}
                </div>
              ))}
          </div>

          {/* 댓글 입력창 및 등록 버튼 */}
          <div className="flex w-full gap-2 mt-4">
            <input
              type="text"
              placeholder="댓글을 입력하세요"
              className="flex-1 border border-[#81C784] border-solid rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#3C9A5F] box-border"
              ref={commentInputRef}
            />
            <button
              type="submit"
              className="bg-[#3C9A5F] text-[#FEF7E2] px-5 py-2 rounded hover:bg-[#264D3D] transition-colors whitespace-nowrap border-none"
              onClick={handleComment}
            >
              등록
            </button>
          </div>
        </section>

        {/* 홈으로 이동 버튼 */}
        <button
          onClick={() => navigate("/looplehome")}
          className="mt-8 w-full bg-[#81C784] text-[#FEF7E2] py-3 rounded-lg font-semibold hover:bg-[#264D3D] transition-colors border-none"
        >
          홈으로 이동
        </button>
      </div>
    </>
  );
}
