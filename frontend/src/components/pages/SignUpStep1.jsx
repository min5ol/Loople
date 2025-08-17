// src/components/pages/SignUpStep1.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkEmail } from "../../apis/user";
import logo from "../../assets/brandLogo.png";

export default function SignUpStep1() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "", passwordConfirm: "" });
  const [emailStatus, setEmailStatus] = useState({ checked: false, message: "", isValid: false });
  const [emailChecking, setEmailChecking] = useState(false);

  const emailRegex = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);
  const isEmailFormat = emailRegex.test(form.email);
  const passwordStrengthWidth = Math.min(form.password.length * 10, 100); // 0~100%
  const passwordsTouched = form.password.length > 0 || form.passwordConfirm.length > 0;
  const passwordsMatch =
    form.password.length > 0 &&
    form.passwordConfirm.length > 0 &&
    form.password === form.passwordConfirm;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "email") setEmailStatus({ checked: false, message: "", isValid: false });
  };

  // 공용: 이메일 가용성 체크 (handleNext에서도 사용)
  const checkEmailAvailability = async () => {
    if (!form.email || !isEmailFormat) {
      setEmailStatus({ checked: false, message: "올바른 이메일을 입력해주세요.", isValid: false });
      return false;
    }
    try {
      setEmailChecking(true);
      const res = await checkEmail(form.email);
      const ok = !!res?.available;
      setEmailStatus({
        checked: true,
        message: ok ? "✅ 사용 가능한 이메일입니다." : "❌ 이미 사용 중인 이메일입니다.",
        isValid: ok,
      });
      return ok;
    } catch {
      setEmailStatus({ checked: true, message: "오류가 발생했습니다. 다시 시도해주세요.", isValid: false });
      return false;
    } finally {
      setEmailChecking(false);
    }
  };

  const handleEmailCheck = async () => {
    await checkEmailAvailability();
  };

  const handleNext = async () => {
    const { email, password, passwordConfirm } = form;

    if (!email || !password || !passwordConfirm) return alert("모든 항목을 입력해주세요.");
    if (!isEmailFormat) return alert("유효한 이메일 형식을 입력해주세요.");

    // ✅ 사용자가 '중복 확인'을 안 눌렀어도 자동 확인
    let canUseEmail = emailStatus.isValid;
    if (!emailStatus.checked) {
      canUseEmail = await checkEmailAvailability();
    }
    if (!canUseEmail) return alert("이메일 중복 확인을 통과하지 못했습니다.");

    if (!passwordsMatch) return alert("비밀번호가 일치하지 않습니다.");

    // ✅ 세션에만 보존 (스토어는 쓰지 않음)
    sessionStorage.setItem("email", email);
    sessionStorage.setItem("password", password);

    navigate("/signup/step2");
  };

  return (
    <div className="min-h-screen px-6 font-ptd-400 flex items-center justify-center bg-brand-50 bg-[radial-gradient(900px_600px_at_10%_0%,#CFE7D8_0%,transparent_45%),radial-gradient(900px_600px_at_90%_100%,#FEF7E2_0%,transparent_40%)]">
      <div className="w-full max-w-md mx-auto rounded-2xl p-8 bg-white/80 backdrop-blur-md shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_8px_20px_rgba(0,0,0,0.08)]">
        {/* 진행바 1/3 */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-brand-ink/60 mb-2">
            <span>1단계</span>
            <span className="font-ptd-600 text-brand-ink">1 / 3</span>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-2">
            <div className="h-2 rounded-full bg-[#7FCF9A]" />
            <div className="h-2 rounded-full bg-brand-ink/15" />
            <div className="h-2 rounded-full bg-brand-ink/15" />
          </div>
        </div>

        <div className="text-center mb-6">
          <img src={logo} alt="Loople" className="h-12 mx-auto mb-3 drop-shadow" />
          <h2 className="text-2xl font-ptd-700 text-brand-ink">이메일로 시작하기</h2>
          <p className="text-sm text-brand-ink/60 mt-1">간단한 정보만 입력하면 바로 시작할 수 있어요 ✨</p>
        </div>

        <div className="space-y-5">
          {/* 이메일 + 중복확인 */}
          <div className="flex gap-2">
            <input
              type="email"
              name="email"
              placeholder="이메일"
              value={form.email}
              onChange={handleChange}
              autoComplete="username"
              className="ctl-input flex-1 shadow-[inset_0_2px_6px_rgba(0,0,0,0.08)] hover:shadow-[inset_0_2px_8px_rgba(0,0,0,0.12)] transition-all"
            />
            <button
              type="button"
              onClick={handleEmailCheck}
              disabled={!isEmailFormat || emailChecking}
              className={`ctl-btn-primary w-[112px] shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_4px_12px_rgba(60,154,95,0.35)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_6px_14px_rgba(60,154,95,0.45)] transition-all ${(!isEmailFormat || emailChecking) ? "opacity-60" : ""}`}
            >
              {emailChecking ? "확인 중…" : "중복 확인"}
            </button>
          </div>

          {emailStatus.message && (
            <div
              className={`text-sm px-1 ${emailStatus.isValid ? "text-[#2e7d32]" : "text-[#d32f2f]"}`}
              role="status"
            >
              {emailStatus.message}
            </div>
          )}

          {/* 비밀번호 */}
          <div className="space-y-2">
            <input
              type="password"
              name="password"
              placeholder="비밀번호"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              className="ctl-input shadow-[inset_0_2px_6px_rgba(0,0,0,0.08)] hover:shadow-[inset_0_2px_8px_rgba(0,0,0,0.12)] transition-all"
            />
            {/* 얇은 스트렝스 바 */}
            <div className="h-1 w-full rounded-full bg-brand-ink/10 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  form.password.length >= 10
                    ? "bg-[#3C9A5F]"
                    : form.password.length >= 6
                    ? "bg-[#7FCF9A]"
                    : "bg-[#CFE7D8]"
                }`}
                style={{ width: `${passwordStrengthWidth}%` }}
              />
            </div>
            <p className="text-xs text-brand-ink/50">최소 8자 권장 • 영문/숫자/기호 조합 시 보안이 더 강화돼요</p>
          </div>

          {/* 비밀번호 확인 + 매칭 상태 */}
          <div className="space-y-1">
            <input
              type="password"
              name="passwordConfirm"
              placeholder="비밀번호 확인"
              value={form.passwordConfirm}
              onChange={handleChange}
              autoComplete="new-password"
              className="ctl-input shadow-[inset_0_2px_6px_rgba(0,0,0,0.08)] hover:shadow-[inset_0_2px_8px_rgba(0,0,0,0.12)] transition-all"
            />
            {passwordsTouched && (
              <p className={`text-xs px-1 ${passwordsMatch ? "text-[#2e7d32]" : "text-[#d32f2f]"}`}>
                {passwordsMatch ? "✅ 비밀번호가 일치합니다." : "❌ 비밀번호가 일치하지 않습니다."}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleNext}
          className="ctl-btn-primary w-full mt-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_4px_12px_rgba(60,154,95,0.4)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_6px_14px_rgba(60,154,95,0.5)] transition-all"
        >
          다음
        </button>

        <p className="text-xs text-center text-brand-ink/50 mt-6">
          이미 계정이 있으신가요?{" "}
          <span
            className="text-brand-600 font-ptd-600 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            로그인
          </span>
        </p>
      </div>
    </div>
  );
}
