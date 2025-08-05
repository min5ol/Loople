import { useEffect, useState } from "react";
import instance from "../apis/instance";

export default function useCurrentUser() {
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await instance.get("/users/auth/me"); // 사용자 정보 요청
        setCurrentUserId(res.data.no); // 혹은 userId 필드
      } catch (error) {
        console.error("사용자 정보를 불러오지 못했습니다.", error);
      }
    };

    fetchCurrentUser();
  }, []);

  return currentUserId;
}
