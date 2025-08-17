/**
 * 작성일: 2025.07.23
 * 수정일: 2025.08.17
 * 작성자: 장민솔
 * 설명: 회원가입 3단계 - zustand 스토어 분리 적용 및 버그 수정 (모달 도입/가드 개선/스타일 정리)
 */

// src/components/pages/SignUpStep3.jsx

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSignupStore } from "../../store/signupStore"; // socialData, step2Data
import { useAuthStore } from "../../store/authStore"; // setAuthInfo

import instance from "../../apis/instance";
import { searchKakaoAddress } from "../../services/kakaoService";
import { parseAddress } from "../../utils/parseAddress";
import { signup, signupSocial } from "../../services/userService";
import { DEFAULT_PROFILE_IMAGE_URL } from "../../constants/defaults";
import { loadDaumPostcodeScript } from "../../utils/loadDaumPostcode";

import ProfileImageUploader from "../organisms/ProfileImageUploader";
import SignupSuccessModal from "../atoms/SignupSuccessModal";

/* 라이트 글래스 모달 (간단 버전) */
function Modal({ open, title, desc, confirmLabel = "확인", onConfirm }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onConfirm} />
      <div
        className="relative w-[92%] max-w-sm rounded-2xl p-6
                      bg-white/80 backdrop-blur-md
                      shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_10px_24px_rgba(0,0,0,0.12)]"
      >
        <h3 className="text-lg font-ptd-700 text-brand-ink">{title}</h3>
        {desc && <p className="mt-2 text-sm text-brand-ink/70 leading-relaxed">{desc}</p>}
        <div className="mt-6 flex justify-end">
          <button
            className="ctl-btn-primary w-auto px-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_4px_10px_rgba(60,154,95,0.35)]"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SignUpStep3() {
  const navigate = useNavigate();

  const { step2Data, socialData } = useSignupStore();
  const setAuthInfo = useAuthStore((s) => s.setAuthInfo);

  const [form, setForm] = useState({
    address: "",
    detailAddress: "",
    gpsLat: "",
    gpsLng: "",
    sido: "",
    sigungu: "",
    eupmyun: "",
    ri: "",
    dong_code: "",
    profileImageUrl: null,
  });

  // 모달 상태
  const [modal, setModal] = useState({ open: false, title: "", desc: "", onConfirm: null });

  // 가입 성공 모달 (기존 컴포넌트)
  const [successOpen, setSuccessOpen] = useState(false);
  const [signupUserName, setSignupUserName] = useState("");
  const [signupUserId, setSignupUserId] = useState(null);

  const openModal = useCallback((title, desc, onConfirm) => {
    setModal({
      open: true,
      title,
      desc,
      onConfirm: onConfirm || (() => setModal((m) => ({ ...m, open: false }))),
    });
  }, []);
  const closeModal = useCallback(() => setModal((m) => ({ ...m, open: false })), []);

  // 진입 가드: Step2 필수 정보 없으면 Step2로
  useEffect(() => {
    if (step2Data?.nickname && step2Data?.phone && step2Data?.name) return;
    openModal(
      "이전 단계를 먼저 진행해주세요",
      "기본 정보 입력(이름/닉네임/휴대폰)이 필요합니다.",
      () => {
        closeModal();
        navigate("/signup/step2");
      }
    );
  }, [step2Data, navigate, openModal, closeModal]);

  const handleUpload = (url) => {
    setForm((prev) => ({ ...prev, profileImageUrl: url }));
  };

  const handleAddressSearch = async () => {
    try {
      await loadDaumPostcodeScript();

      new window.daum.Postcode({
        oncomplete: async (data) => {
          const fullAddress = data.jibunAddress || data.roadAddress;
          if (!fullAddress) {
            openModal("주소 선택이 필요해요", "검색 결과에서 주소를 하나 선택해주세요.", closeModal);
            return;
          }

          try {
            const res = await searchKakaoAddress(fullAddress);
            const result = res.documents?.[0];
            if (!result) {
              openModal("주소 검색 결과 없음", "다른 주소로 다시 검색해 주세요.", closeModal);
              return;
            }

            const { sido, sigungu, eupmyun, ri } = parseAddress(result.address);
            const { data: dongData } = await instance.get("/beopjeongdong/dong-code", {
              params: { sido, sigungu, eupmyun, ri },
            });

            setForm((prev) => ({
              ...prev,
              address: fullAddress,
              gpsLat: result.y,
              gpsLng: result.x,
              sido,
              sigungu,
              eupmyun,
              ri,
              dong_code: dongData?.dongCode || "",
            }));
          } catch (err) {
            console.error("주소 처리 오류", err);
            openModal("주소 처리 실패", "주소 좌표 또는 법정동 코드 처리 중 오류가 발생했습니다.", closeModal);
          }
        },
      }).open();
    } catch (err) {
      console.error("주소 검색 로딩 실패", err);
      openModal("주소 검색 로딩 실패", "우편번호 검색 스크립트를 불러오지 못했습니다.", closeModal);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const {
      address,
      detailAddress,
      gpsLat,
      gpsLng,
      dong_code,
      profileImageUrl,
      sido,
      sigungu,
      eupmyun,
      ri,
    } = form;

    if (!address || !detailAddress || !gpsLat || !gpsLng || !dong_code) {
      openModal("주소 정보를 확인해주세요", "주소, 상세주소, 좌표, 법정동 코드가 모두 필요합니다.", closeModal);
      return;
    }

    try {
      // 공통 페이로드 (주소/이미지)
      const finalPayload = {
        detailAddress,
        profileImageUrl: profileImageUrl ?? DEFAULT_PROFILE_IMAGE_URL,
        sido,
        sigungu,
        eupmyun,
        ...(ri && ri.trim() ? { ri } : {}),
      };

      let payload, res;

      if (socialData?.provider) {
        // 소셜 가입
        if (!socialData.email || !socialData.socialId || !step2Data?.nickname || !step2Data?.phone) {
          openModal("소셜 사용자 정보 누락", "소셜 이메일/ID 또는 기본 정보가 누락되었습니다.", closeModal);
          return;
        }
        payload = {
          ...finalPayload,
          ...step2Data, // name, nickname, phone
          ...socialData, // provider, email, socialId
          gpsLat,
          gpsLng,
          dongCode: dong_code,
          address, // 표시용
        };
        res = await signupSocial(payload);
      } else {
        // 일반 가입
        const email = sessionStorage.getItem("email");
        const password = sessionStorage.getItem("password");
        if (!email || !password) {
          openModal(
            "1단계 정보가 없습니다",
            "이메일/비밀번호 입력 후 다시 진행해주세요.",
            () => {
              closeModal();
              navigate("/signup");
            }
          );
          return;
        }
        if (!step2Data?.nickname || !step2Data?.phone) {
          openModal("기본 정보 누락", "닉네임과 휴대폰 번호를 입력해주세요.", closeModal);
          return;
        }
        payload = {
          ...finalPayload,
          ...step2Data, // name, nickname, phone
          email,
          password,
          gpsLat,
          gpsLng,
          dongCode: dong_code,
          address,
        };
        res = await signup(payload);
      }

      // ✅ 토큰/유저정보 표준화해서 저장 (accessToken 키 사용!)
      const accessToken = res.accessToken ?? res.token ?? res.jwt ?? res.access_token ?? null;
      const refreshToken = res.refreshToken ?? res.refresh_token ?? null;

      setAuthInfo({
        accessToken,
        refreshToken,
        user: {
          id: res.userId,
          email: socialData?.email ? socialData.email : payload.email,
          nickname: res.nickname,
          avatarUrl: res.profileImageUrl ?? null,
        },
      });

      // (선택) 인스턴스 헤더에 토큰 연결 — 이후 API 401 방지
      if (accessToken) {
        try {
          instance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        } catch {}
      }

      setSignupUserName(res.nickname);
      setSignupUserId(res.userId);
      setSuccessOpen(true);
    } catch (err) {
      console.error("[❌ 회원가입 실패]", err);
      openModal("회원가입 실패", "회원가입 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.", closeModal);
    }
  };

  const handleSuccessConfirm = () => {
    setSuccessOpen(false);
    // 데이터 초기화는 Complete 페이지에서 처리
    navigate(`/signup/complete?userId=${signupUserId}&name=${encodeURIComponent(signupUserName)}`);
  };

  // 표시용 이메일
  const displayEmail = socialData?.email || sessionStorage.getItem("email") || "-";

  return (
    <>
      {/* 완료 모달(기존) */}
      <SignupSuccessModal isOpen={successOpen} name={signupUserName} onConfirm={handleSuccessConfirm} />

      {/* 본문 */}
      <div
        className="
          min-h-screen px-6 font-ptd-400 flex items-center justify-center
          bg-brand-50
          bg-[radial-gradient(900px_600px_at_10%_0%,#CFE7D8_0%,transparent_45%),radial-gradient(900px_600px_at_90%_100%,#FEF7E2_0%,transparent_40%)]
        "
      >
        <div
          className="
            w-full max-w-md mx-auto rounded-2xl p-8 space-y-6
            bg-white/80 backdrop-blur-md
            shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_8px_20px_rgba(0,0,0,0.08)]
          "
        >
          {/* 상단 진행 인디케이터 (3/3) */}
          <div className="mb-2">
            <div className="flex items-center justify-between text-xs text-brand-ink/60 mb-2">
              <span>3단계</span>
              <span className="font-ptd-600 text-brand-ink">3 / 3</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <div className="h-2 rounded-full bg-[#7FCF9A]" />
              <div className="h-2 rounded-full bg-[#7FCF9A]" />
              <div className="h-2 rounded-full bg-[#7FCF9A]" />
            </div>
          </div>

          <h2 className="text-2xl font-ptd-700 text-brand-ink text-center">프로필 및 주소 입력</h2>

          {/* 요약 미니 카드 */}
          <div className="rounded-xl p-4 bg-white/70 shadow-[inset_0_1px_2px_rgba(255,255,255,0.6)]">
            <div className="text-sm text-brand-ink/70 grid grid-cols-2 gap-y-1">
              <span className="font-ptd-600 text-brand-ink/80">이름</span>
              <span>{step2Data?.name || "-"}</span>
              <span className="font-ptd-600 text-brand-ink/80">닉네임</span>
              <span>{step2Data?.nickname || "-"}</span>
              <span className="font-ptd-600 text-brand-ink/80">이메일</span>
              <span>{displayEmail}</span>
              <span className="font-ptd-600 text-brand-ink/80">휴대폰</span>
              <span>{step2Data?.phone || "-"}</span>
            </div>
          </div>

          {/* 프로필 업로드 */}
          <div className="flex flex-col items-center gap-4">
            <img
              src={form.profileImageUrl || DEFAULT_PROFILE_IMAGE_URL}
              alt="프로필 미리보기"
              className="w-24 h-24 rounded-full object-cover ring-2 ring-brand-300"
            />
            <ProfileImageUploader onUpload={handleUpload} />
          </div>

          {/* 주소 입력 */}
          <div className="pt-2 space-y-4">
            <button
              onClick={handleAddressSearch}
              className="
                ctl-btn-primary w-full
                bg-[#7FCF9A] hover:bg-[#3C9A5F]
                shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_4px_12px_rgba(127,207,154,0.35)]
                hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_6px_14px_rgba(60,154,95,0.45)]
                transition-all
                font-ptd-600
              "
            >
              주소 검색
            </button>

            <input
              name="address"
              value={form.address}
              readOnly
              className="ctl-input bg-brand-50 text-brand-ink/70"
              placeholder="선택된 주소"
            />

            <input
              name="detailAddress"
              placeholder="상세주소"
              value={form.detailAddress}
              onChange={handleChange}
              className="
                ctl-input
                shadow-[inset_0_2px_6px_rgba(0,0,0,0.08)]
                hover:shadow-[inset_0_2px_8px_rgba(0,0,0,0.12)]
                transition-all
              "
            />
          </div>

          <button
            onClick={handleSubmit}
            className="
              ctl-btn-primary w-full mt-2
              shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_4px_12px_rgba(60,154,95,0.4)]
              hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_6px_14px_rgba(60,154,95,0.5)]
              transition-all
            "
          >
            회원가입 완료
          </button>
        </div>
      </div>

      {/* 공용 모달 */}
      <Modal open={modal.open} title={modal.title} desc={modal.desc} onConfirm={modal.onConfirm || closeModal} />
    </>
  );
}
