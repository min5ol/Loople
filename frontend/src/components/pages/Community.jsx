// src/components/pages/Community.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../apis/instance";

export const getPostByCategory = async (payLoad) => {
  const res = await instance.post("/community/posts", payLoad);
  return res.data;
}

export const getDetailPost = async (no) => {
  const res = await instance.get(`/community/post/${no}`)
  return res.data;
}

export default function Community({ currentUserInfo }) {
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
    if (!currentUserInfo?.no) return;

    const fetchData = async () => {
      try {
        await handlePost("NOTICE");
      } catch (err) {
        console.error("게시글 불러오기 실패:", err);
      }
    };

    fetchData();
  }, [currentUserInfo.no]);


  const handlePost = async (category) => {
    const payLoad = {
      userId: currentUserInfo.no,
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
    navigate("/communityPost", {
      state: { post, currentUserInfo }
    });
  };

  return (
    <div className="mt-20 px-6 py-10 max-w-4xl mx-auto bg-[#749E89] border border-[#4A7C59] rounded-xl shadow-lg">
      <p className="text-center text-white text-xl font-semibold mb-6">
        🌿 Loople 게시판에 오신 걸 환영합니다!<br />
        여러분의 소소한 이야기와 나눔을 함께해요.
      </p>

      <div className="flex justify-between mb-4">
        <div className="space-x-3">
          <button onClick={() => handlePost("ALL")} className={`px-4 py-2 rounded-md shadow transition border-none hover:bg-[#264D3D] hover:text-white cursor-pointer
              ${selectedBoard === "ALL"
              ? "bg-[#264D3D] text-white "
              : "bg-[#C7E6C9]"
            }`}>
            자유게시판
          </button>
          <button onClick={() => handlePost("FREE")} className={`px-4 py-2 rounded-md shadow transition border-none hover:bg-[#264D3D] hover:text-white cursor-pointer
              ${selectedBoard === "FREE"
              ? "bg-[#264D3D] text-white "
              : "bg-[#C7E6C9]"
            }`}>
            우리동네게시판
          </button>
          <button onClick={() => handlePost("USED")} className={`px-4 py-2 rounded-md shadow transition border-none hover:bg-[#264D3D] hover:text-white cursor-pointer
              ${selectedBoard === "USED"
              ? "bg-[#264D3D] text-white"
              : "bg-[#C7E6C9]"
            }`}>
            중고나눔게시판
          </button>
        </div>
        <button onClick={() => navigate("/newPost", { state: { currentUserInfo } })} className="px-5 py-2 rounded-md shadow bg-[#C7E6C9] text-[#264D3D] hover:bg-[#264D3D] hover:text-white transition border-none cursor-pointer">
          글쓰기
        </button>
      </div>

      <div className="mx-auto p-4">
        {noticePosts.length > 0 && (
          noticePosts.map((notice) => (
            <div key={notice.no} onClick={() => fetchDetailPost(notice.no)} className="p-3 flex justify-between items-center mb-3 cursor-pointer bg-[#FEF7E2]">
              <div>📢</div>
              <div className="flex-1 font-medium truncate px-2">{notice.title}</div>
              <div className="w-48 text-gray-500 text-xs whitespace-nowrap text-right">
                {notice.nickname} | {new Date(notice.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))
        )}


        {currentPosts.length > 0 && (
          currentPosts.map((post, index) => (
            <div key={post.no} className="p-3 flex justify-between items-center bg-white mb-3 cursor-pointer" onClick={() => fetchDetailPost(post.no)}>
              {/* 페이지별 인덱스 다시 계산 (전체에서 번호를 매기려면) */}
              <div className="w-8 text-center text-gray-600">
                {posts.length - (indexOfFirstPost + index)}
              </div>
              <div className="flex-1 font-medium truncate px-2">{post.title}</div>
              <div className="w-48 text-gray-500 text-xs whitespace-nowrap text-right">
                {post.nickname} | {new Date(post.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))
        )}

        {/* 페이지네이션 */}
        <div className="flex justify-center gap-2 mt-6">
          {[...Array(totalPages)].map((_, idx) => (
            <button key={idx} className={`px-3 py-1 rounded-md border hover:bg-[#264D3D] hover:text-white cursor-pointer border-none
            ${currentPage === idx + 1
                ? "bg-[#264D3D] text-white"
                : "bg-white text-gray-700"
              }`}
              onClick={() => setCurrentPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );


}
