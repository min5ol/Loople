// src/components/pages/CommunityPost.jsx

import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../templates/Header";
import instance from "../../apis/instance";
import { useAuthStore } from "../../store/authStore";

// 댓글 목록 조회 API 호출 함수
export const getComments = async (boardId) => {
  const res = await instance.get(`/community/${boardId}/comment`);
  return res.data;
};

// 댓글 등록 API 호출 함수
export const submitComment = async (sender) => {
  const res = await instance.post(`/community/comment/add`, sender);
  return res.data;
};

// 댓글 수정 API 호출 함수
export const editComment = async (sender) => {
  const res = await instance.post("/community/comment/edit", sender);
  return res.data;
};

export const deleteContent = async (target, targetId) => {
  const res = await instance.get("/community/delete", { params: { target, targetId } });
  return res.data
};

export default function CommunityPost() {
  const { userInfo, clearAuthInfo } = useAuthStore();
  // React Router로부터 전달받은 게시글 데이터 및 네비게이트 함수
  const location = useLocation();
  const navigate = useNavigate();
  const post = location.state?.post;

  // 댓글 리스트 상태
  const [comments, setComments] = useState([]);

  // 현재 수정중인 댓글 ID와 수정 텍스트 상태
  const [editCommentId, setEditCommentId] = useState(null);
  const [editText, setEditText] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [currentComment, setCurrentComment] = useState(null);

  // 댓글 수정 input에 포커스 주기 위한 ref
  const inputRef = useRef(null);

  const commentRef = useRef(null);

  // 댓글 입력창 input에 대한 ref (상태 대신 ref로 값 읽기)
  const commentInputRef = useRef(null);

  const [errorMessage, setErrorMessage] = useState(null);

  //새로고침 시 -> location.state 사라짐
  useEffect(() => {
    if (!post?.no) {
      navigate("/looplehome");
      return;
    }

    const fetchComments = async () => {
      try {
        const data = await getComments(post.no);
        setComments(data);
      } catch (error) {
        console.error("댓글 불러오기 실패", error);
        setErrorMessage("댓글을 불러오는 데 실패했습니다.");
      }
    };

    fetchComments();
  }, [post, navigate]); // post가 바뀌거나 컴포넌트 마운트 시 실행

  //첫 실행
  useEffect(() => {
    if (post?.comments) {
      setComments(post.comments);
    }
  }, []);


  // 댓글 수정 input이 열릴 때 포커스를 자동으로 줌
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [editCommentId]);

  useEffect(() => {
    if (commentRef.current) {
      commentRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentComment])

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

    setCurrentComment(comment);

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

      setComments(prev => [...prev, res]);

      // 입력창 초기화
      commentInputRef.current.value = "";
      setCurrentComment("");
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
      const update = await editComment(sender);
      console.log("updaet", update);

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

  const runIfOwner = (target, type, targetType) => {
    console.log("t", target);
    console.log("u", userInfo)
    if (target.userId === userInfo.userId) {
      if (type === "수정") {
        if (targetType === "comment") {
          handleEditClick(target);
        } else if (targetType === "post") {
          navigate("/newPost", { state: { post } });
        }
      } else if (type === "삭제") {
        setDeleteTarget(targetType);
        setDeleteTargetId(target.no);
        setShowDeleteConfirm(true);
      }
    } else {
      setErrorMessage(`해당 ${targetType === "post" ? "게시글" : "댓글"} 작성자만 ${type} 가능합니다.`);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteContent(deleteTarget, deleteTargetId);
      console.log("성공");
      if (deleteTarget === "comment") {
        const updatedComments = await getComments(post.no);
        setComments(updatedComments);
      } else if (deleteTarget === "post") {
        navigate("/loopleHome");
      }

      setShowDeleteConfirm(false);
      setShowDeleteSuccess(true);

      setTimeout(() => {
        setShowDeleteSuccess(false);
      }, 2000);

    } catch (error) {
      console.log("실패", error);
    }
  }

  const handleDeleteCancel = async () => {
    setDeleteTarget(null);
    setDeleteTargetId(null);
    setShowDeleteConfirm(false);
  }

  return (
    <div>
      <Header />

      <div className="max-w-3xl mx-auto mt-20 px-6 py-7 rounded-2xl bg-white/85 backdrop-blur-md ring-1 ring-black/5 shadow-[inset_0_1px_2px_rgba(255,255,255,0.65),0_12px_28px_rgba(0,0,0,0.10)]">
        {/* 제목 + 우측 메뉴 */}
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-2xl md:text-3xl font-ptd-700 text-brand-ink leading-tight">
            {post.title}
          </h2>

          <div className="relative group shrink-0">
            <button
              className="w-9 h-9 grid place-items-center rounded-full bg-white/90 ring-1 ring-black/5 hover:bg-brand-100 transition"
              aria-label="게시글 옵션"
              title="게시글 옵션"
            >
              ⋮
            </button>

            {/* 옵션 메뉴 */}
            <div className="absolute right-0 mt-2 hidden group-hover:block w-40 rounded-xl bg-white ring-1 ring-black/5 shadow-xl overflow-hidden z-10">
              <button
                className="w-full px-4 py-2 text-left text-sm text-brand-ink hover:bg-brand-50"
                onClick={() => runIfOwner(post, "수정", "post")}
              >
                게시글 수정
              </button>
              <button
                className="w-full px-4 py-2 text-left text-sm text-[#B91C1C] hover:bg-brand-50"
                onClick={() => runIfOwner(post, "삭제", "post")}
              >
                게시글 삭제
              </button>
              <button
                className="w-full px-4 py-2 text-left text-sm text-brand-ink hover:bg-brand-50"
                onClick={() =>
                  navigate("/reportPage", {
                    state: { target: "post", targetId: post.no },
                  })
                }
              >
                게시글 신고
              </button>
            </div>
          </div>
        </div>

        {/* 메타 정보 */}
        <div className="mt-3 flex items-center justify-between text-xs md:text-sm">
          <span className="text-brand-ink/70">
            작성자: <span className="font-ptd-600 text-brand-ink">{post.nickname}</span>
          </span>

          {post.category === "USED" && post.userId !== userInfo.userId && (
            <button
              onClick={() => navigate("/chat", { state: { post } })}
              className="h-9 px-3 rounded-full bg-brand-600 text-white text-sm font-ptd-600 hover:bg-brand-500 transition"
            >
              💬 채팅하기
            </button>
          )}
        </div>

        <div className="mt-1 text-[12px] text-brand-ink/60">
          작성일: {new Date(post.createdAt).toLocaleString()}
          {post.createdAt !== post.updatedAt && post.category !== "NOTICE" && (
            <span className="ml-1">(수정: {new Date(post.updatedAt).toLocaleString()})</span>
          )}
        </div>

        {/* 본문 */}
        <div className="mt-5 text-[15px] leading-relaxed text-brand-ink whitespace-pre-wrap">
          {post.content}
        </div>

        {/* 첨부파일 */}
        {post.attachedFile && (
          <div className="mt-5">
            {isImageFile(post.attachedFile) ? (
              <img
                src={post.attachedFile}
                alt="첨부 이미지"
                className="max-w-full rounded-xl ring-1 ring-brand-300 shadow-md"
              />
            ) : isDocumentFile(post.attachedFile) ? (
              <a
                href={post.attachedFile}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 h-10 rounded-full bg-brand-100 text-brand-ink hover:bg-brand-300 transition text-sm"
              >
                📎 첨부파일 다운로드
              </a>
            ) : (
              <span className="text-[#B91C1C] font-ptd-600">지원하지 않는 파일 형식입니다.</span>
            )}
          </div>
        )}

        {/* 댓글 섹션 */}
        <section className="mt-8 rounded-2xl bg-brand-50 ring-1 ring-black/5 p-4">
          <p className="text-lg font-ptd-700 text-brand-ink m-0 mb-3">댓글</p>
          <div className="h-px bg-black/5 mb-4" />

          {/* 댓글 리스트 */}
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {comments.length > 0 &&
              comments.map((comment, index) => {
                const isLast = index === comments.length - 1;
                const isEditing = editCommentId === comment.no;

                return (
                  <div
                    key={comment.no}
                    ref={isLast ? commentRef : null}
                    className="rounded-xl bg-white/90 ring-1 ring-black/5 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-ptd-600 text-brand-ink">{comment.nickname}</span>
                          <span className="text-brand-ink/50">
                            {new Date(comment.createdAt).toLocaleString()}
                            {comment.updatedAt !== comment.createdAt && (
                              <span className="ml-1">(수정)</span>
                            )}
                          </span>
                        </div>

                        {/* 본문/수정 입력 */}
                        {isEditing ? (
                          <div className="mt-2">
                            <input
                              ref={inputRef}
                              type="text"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="w-full h-11 px-4 rounded-lg bg-white placeholder-black/40 ring-1 ring-brand-300 focus:outline-none focus:ring-4 shadow-[inset_0_2px_6px_rgba(0,0,0,0.06)]"
                            />
                            <div className="mt-2 flex justify-end gap-2">
                              <button
                                onClick={handleEditSave}
                                className="h-9 px-3 rounded-lg bg-brand-600 text-white text-sm font-ptd-600 hover:bg-brand-500 transition"
                              >
                                수정
                              </button>
                              <button
                                onClick={handleEditCancel}
                                className="h-9 px-3 rounded-lg bg-white ring-1 ring-black/10 text-sm hover:bg-brand-50 transition"
                              >
                                취소
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="mt-1 text-sm text-brand-ink">{comment.comment}</p>
                        )}
                      </div>

                      {/* 댓글 옵션 */}
                      <div className="relative group shrink-0">
                        <button className="w-8 h-8 grid place-items-center rounded-full hover:bg-brand-100">
                          ⋮
                        </button>
                        <div className="absolute right-0 mt-2 hidden group-hover:block w-32 rounded-xl bg-white ring-1 ring-black/5 shadow-xl overflow-hidden z-10">
                          <button
                            className="w-full px-3 py-2 text-left text-sm hover:bg-brand-50"
                            onClick={() => runIfOwner(comment, "수정", "comment")}
                          >
                            댓글 수정
                          </button>
                          <button
                            className="w-full px-3 py-2 text-left text-sm text-[#B91C1C] hover:bg-brand-50"
                            onClick={() => runIfOwner(comment, "삭제", "comment")}
                          >
                            댓글 삭제
                          </button>
                          <button
                            className="w-full px-3 py-2 text-left text-sm hover:bg-brand-50"
                            onClick={() =>
                              navigate("/reportPage", {
                                state: { target: "comment", targetId: comment.no },
                              })
                            }
                          >
                            댓글 신고
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* 입력창 */}
          <div className="mt-4 flex gap-2">
            <input
              ref={commentInputRef}
              type="text"
              placeholder="댓글을 입력하세요"
              className="flex-1 h-11 px-4 rounded-lg bg-white placeholder-black/40 ring-1 ring-brand-300 focus:outline-none focus:ring-4 shadow-[inset_0_2px_6px_rgba(0,0,0,0.06)]"
              onKeyDown={(e) => e.key === "Enter" && handleComment()}
            />
            <button
              type="submit"
              onClick={handleComment}
              className="h-11 px-5 rounded-lg bg-brand-600 text-white font-ptd-600 hover:bg-brand-500 transition"
            >
              등록
            </button>
          </div>
        </section>

        {/* 홈으로 이동 */}
        <button
          onClick={() => navigate("/looplehome")}
          className="mt-7 w-full h-12 rounded-xl bg-brand-500 text-white font-ptd-700 hover:bg-brand-600 transition"
        >
          홈으로 이동
        </button>

        {/* 에러 모달 */}
        {errorMessage && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
            <div className="w-[88%] max-w-sm rounded-2xl bg-white p-5 ring-1 ring-black/5 shadow-2xl text-center">
              <p className="text-brand-ink mb-4">{errorMessage}</p>
              <button
                onClick={() => setErrorMessage("")}
                className="h-10 px-4 rounded-lg bg-brand-600 text-white font-ptd-600 hover:bg-brand-500 transition"
              >
                닫기
              </button>
            </div>
          </div>
        )}

        {/* 삭제 확인 모달 */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
            <div className="w-[88%] max-w-sm rounded-2xl bg-white p-6 ring-1 ring-black/5 shadow-2xl text-center">
              <p className="text-brand-ink mb-2">정말 삭제하시겠습니까?</p>
              <p className="text-brand-ink/70 mb-4">삭제하면 되돌릴 수 없습니다.</p>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={handleDelete}
                  className="h-10 px-4 rounded-lg bg-[#EF4444] text-white hover:bg-[#DC2626] transition"
                >
                  확인
                </button>
                <button
                  onClick={handleDeleteCancel}
                  className="h-10 px-4 rounded-lg bg-white ring-1 ring-black/10 hover:bg-brand-50 transition"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 삭제 완료 토스트 */}
        {showDeleteSuccess && (
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50">
            <div className="px-5 py-3 rounded-xl bg-white/95 ring-1 ring-black/5 shadow-lg text-sm text-brand-ink">
              삭제되었습니다.
            </div>
          </div>
        )}
      </div>
    </div>
  );

}
