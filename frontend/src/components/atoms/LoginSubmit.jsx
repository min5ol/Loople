// 작성일: 2025.07.16
// 작성자: 장민솔
// 설명: 로그인용 submit 버튼. 기본 텍스트 "로그인", props 추가 확장 가능

// src/components/atoms/LoginSubmit.jsx
export default function LoginSubmit({ children = "로그인", ...rest }) {
  return (
    <button
      type="submit"
      className="w-full h-[2.93vw] cursor-pointer border-none rounded-full bg-primary text-w-ground text-[1.32vw] px-[1.46vw] font-ptd-400 outline-none cursor-pointer"
      
      // 외부에서 onClick이나 disable 등 props 추가 가능하게 설계
      {...rest}
    >
      {children}
    </button>
  );
}