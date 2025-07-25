// 작성일자: 2025.07.14
// 작성자: 장민솔
// 설명: 로그인 입력 필드. type, name, value, onChange 받아서 스타일 적용

// src/components/atoms/LoginInputField.jsx
export default function LoginInputField({ type, name, value, onChange }) {
  return (
    <input
      type={type} // input 타입
      name={name} // key 값
      value={value} // value 값
      onChange={onChange} // 입력 바뀔 때마다 바깥에서 상태 업데이트 연결
      className="w-[25.48vw] h-[2.93vw] border-none rounded-full bg-[#152B22] px-[1.46vw] shadow-inner text-w-ground text-[1.32vw] font-ptd-400 outline-none"
    />
  );
}