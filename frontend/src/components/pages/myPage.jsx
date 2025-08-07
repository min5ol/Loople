import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../apis/instance";

export default function MyPage() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        const res = await instance.get("/users/me");
        setUserInfo(res.data);
      } catch (err) {
        console.error("❌ 사용자 정보 불러오기 실패:", err);
      }
    };
    fetchMyInfo();
  }, []);

  if (!userInfo) {
    return <div className="p-8 text-[#264D3D]">로딩 중...</div>;
  }

  return (
    <div className="min-h-screen bg-[#FEF7E2] pt-24 px-6 pb-12">
      {/* 🧑 프로필 영역 */}
      <div className="bg-white p-5 rounded-lg shadow-md flex items-center gap-4 mb-6">
        <img
          src={userInfo.avatarUrl || "/default-avatar.png"}
          alt="아바타"
          className="w-16 h-16 rounded-full border border-[#3C9A5F]"
        />
        <div>
          <div className="text-lg font-bold text-[#264D3D]">
            {userInfo.nickname}
          </div>
          <div className="text-sm text-[#749E89]">{userInfo.email}</div>
        </div>
      </div>

      {/* 📊 활동 요약 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <SummaryCard label="보유 포인트" value={`${userInfo.points}P`} />
        <SummaryCard label="루플링 수" value={`${userInfo.looplings.length}종`} />
        <SummaryCard label="획득 뱃지" value={`${userInfo.badges.length}개`} />
      </div>

      {/* 🎨 내 꾸미기 바로가기 */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <div className="text-[#264D3D] font-semibold mb-2">나의 꾸미기</div>
        <div className="flex gap-2 flex-wrap">
          <QuickButton label="마이아바타" path="/myavatar" />
          <QuickButton label="마이룸" path="/myroom" />
          <QuickButton label="마이루플링" path="/myloopling" />
          <QuickButton label="마이빌리지" path="/myvillage" />
        </div>
      </div>

      {/* ⚙️ 설정 */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
          className="text-sm text-[#264D3D] border border-[#264D3D] px-3 py-1 rounded hover:bg-[#F6F6F6]"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}

// 🔹 요약 카드 컴포넌트
function SummaryCard({ label, value }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm text-center w-full">
      <div className="text-[#749E89] text-sm">{label}</div>
      <div className="text-xl font-bold text-[#264D3D]">{value}</div>
    </div>
  );
}

// 🔹 바로가기 버튼
function QuickButton({ label, path }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(path)}
      className="bg-[#3C9A5F] text-white text-sm px-4 py-2 rounded-full hover:bg-[#264D3D] transition"
    >
      {label}
    </button>
  );
}
