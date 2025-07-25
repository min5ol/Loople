// 작성일: 2025.07.14
// 작성자: 장민솔
// 설명: 버튼 컴포넌트 variant에 따라 스타일 다르게 적용. 클릭 시 onClick 실행

// src/components/atoms/Button.jsx
export default function Button({ children, onClick, variant = 'primary' })
{
  return(
    <button className={`w-60 py-3 rounded-full ${variant === 'primary'} ? 'bg-primary text-background' : bg-background text-primary border border-primary'}`} onClick={onClick}>
      {children}
    </button>
  );
}