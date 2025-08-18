// src/components/pages/Community.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../apis/instance";
import { useAuthStore } from "../../store/authStore";

export const getPostByCategory = async (payLoad) => {
  const res = await instance.post("/community/posts", payLoad);
  return res.data;
}

export const getDetailPost = async (no) => {
  const res = await instance.get(`/community/post/${no}`)
  return res.data;
}

export default function Community() {
  const { userInfo, clearAuthInfo } = useAuthStore();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [noticePosts, setNoticePosts] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const generalPostsPerPage = postsPerPage - noticePosts.length;
  const indexOfLastPost = currentPage * generalPostsPerPage;
  const indexOfFirstPost = indexOfLastPost - generalPostsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(posts.length / generalPostsPerPage);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await handlePost("NOTICE");
      } catch (err) {
        console.error("게시글 불러오기 실패:", err);
      }
    };

    fetchData();
  }, []);


  const handlePost = async (category) => {
    const payLoad = {
      userId: userInfo.no,
      category: category
    }
    const res = await getPostByCategory(payLoad);
    setCurrentPage(1);

    if (category === "FREE" || category === "USED" || category === "ALL") {
      setSelectedBoard(category);
      setPosts(res);
      console.log("free, used, all", res);
    } else {
      setNoticePosts(res);
      console.log("notice", res);
    }
  }

  const fetchDetailPost = async (no) => {
    const post = await getDetailPost(no);
    navigate("/communityPost", {state: {post}});
  };

return (
  <div className="mt-20 px-6 py-10 max-w-4xl mx-auto bg-white/85 backdrop-blur-md rounded-2xl shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_12px_28px_rgba(0,0,0,0.1)] ring-1 ring-black/5">
    {/* 헤더 메시지 */}
    <p className="text-center text-brand-ink text-lg md:text-xl font-ptd-600 mb-6">
      🌿 Loople 게시판에 오신 걸 환영합니다!
      <br />
      소소한 이야기와 나눔을 함께해요.
    </p>

    {/* 상단 카테고리 + 글쓰기 버튼 */}
    <div className="flex justify-between mb-5">
      <div className="space-x-2">
        <button
          onClick={() => handlePost("ALL")}
          className={`px-4 h-10 rounded-full text-sm font-ptd-600 transition
            ${selectedBoard === "ALL"
              ? "bg-brand-600 text-white shadow-md"
              : "bg-brand-100 text-brand-ink hover:bg-brand-300"
            }`}
        >
          자유게시판
        </button>
        <button
          onClick={() => handlePost("FREE")}
          className={`px-4 h-10 rounded-full text-sm font-ptd-600 transition
            ${selectedBoard === "FREE"
              ? "bg-brand-600 text-white shadow-md"
              : "bg-brand-100 text-brand-ink hover:bg-brand-300"
            }`}
        >
          우리동네게시판
        </button>
        <button
          onClick={() => handlePost("USED")}
          className={`px-4 h-10 rounded-full text-sm font-ptd-600 transition
            ${selectedBoard === "USED"
              ? "bg-brand-600 text-white shadow-md"
              : "bg-brand-100 text-brand-ink hover:bg-brand-300"
            }`}
        >
          중고나눔게시판
        </button>
      </div>
      <button
        onClick={() => navigate("/newPost")}
        className="px-5 h-10 rounded-full bg-brand-500 text-white font-ptd-600 shadow hover:bg-brand-600 transition"
      >
        글쓰기
      </button>
    </div>

    {/* 게시글 리스트 */}
    <div className="space-y-2">
      {/* 공지 */}
      {noticePosts.length > 0 &&
        noticePosts.map((notice) => (
          <div
            key={notice.no}
            onClick={() => fetchDetailPost(notice.no)}
            className="p-3 flex justify-between items-center cursor-pointer rounded-lg bg-brand-100 hover:bg-brand-300/60 transition"
          >
            <div className="shrink-0">📢</div>
            <div className="flex-1 font-ptd-500 truncate px-2">{notice.title}</div>
            <div className="w-44 text-gray-500 text-xs text-right shrink-0">
              {notice.nickname} | {new Date(notice.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}

      {/* 일반 게시글 */}
      {currentPosts.length > 0 &&
        currentPosts.map((post, index) => (
          <div
            key={post.no}
            onClick={() => fetchDetailPost(post.no)}
            className="p-3 flex justify-between items-center bg-white/90 rounded-lg cursor-pointer hover:bg-brand-50 transition"
          >
            <div className="w-8 text-center text-gray-400 text-sm">
              {posts.length - (indexOfFirstPost + index)}
            </div>
            <div className="flex-1 font-ptd-400 truncate px-2">{post.title}</div>
            <div className="w-44 text-gray-500 text-xs text-right shrink-0">
              {post.nickname} | {new Date(post.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
    </div>

    {/* 페이지네이션 */}
    <div className="flex justify-center gap-2 mt-6">
      {[...Array(totalPages)].map((_, idx) => (
        <button
          key={idx}
          onClick={() => setCurrentPage(idx + 1)}
          className={`px-3 h-9 rounded-full text-sm font-ptd-500 transition
            ${currentPage === idx + 1
              ? "bg-brand-600 text-white shadow"
              : "bg-white text-gray-700 hover:bg-brand-100"
            }`}
        >
          {idx + 1}
        </button>
      ))}
    </div>
  </div>
);
}
