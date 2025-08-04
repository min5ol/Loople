import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../apis/instance";

export const getPostByCategory = async (category) => {
  const res = await instance.post("/community/posts", {category});
  return res.data;
}

export const getDetailPost = async(no) => {
  const res = await instance.post("/community/post", {no})
  return res.data;
}

export default function Community() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 기본 카테고리 "FREE"로 게시글 불러오기
        await handlePost("FREE");
      } catch (err) {
        console.error("게시글 불러오기 실패:", err);
      }
    };

    fetchData();
  }, []);

  const handlePost = async (category) => {
    const res = await getPostByCategory(category);
    console.log(res);
    setPosts(res);
  }

  const fetchDetailPost = async (no) => {
    console.log(no);

    const res = await getDetailPost(no);
    console.log(res);

    navigate("/communityPost", {
      state: { res }
    });
  };

  return (
    <>
      <p>Loople의 게시판은 동네 기반 게시판입니다 !</p>
      <div className="flex justify-between">

        <div>
          <button onClick={() => handlePost("FREE")}>자유게시판</button>
          <button onClick={() => handlePost("USED")}>중고나눔게시판</button>
        </div>
        <button onClick={() => navigate("/newPost")}>글쓰기</button>
      </div>

      <div className="mx-auto p-4 bg-white">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.no} className="flex justify-between items-center" onClick={() => { fetchDetailPost(post.no); }}>
              <div className="w-8 text-center text-gray-600"></div>
              <div className="flex-1 font-medium truncate px-2">{post.title}</div>
              <div className="w-48 text-gray-500 text-xs whitespace-nowrap text-right">
                {post.nickname} | {new Date(post.createdAt).toLocaleDateString()}
              </div>
            </div>

          ))
        ) : (
          <div className="text-center text-gray-400 py-8">게시글이 없습니다.</div>
        )}
      </div>

    </>
  );

}