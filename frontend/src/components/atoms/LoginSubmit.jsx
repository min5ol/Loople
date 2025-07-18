export default function LoginSubmit({ children = "로그인", ...rest }) {
  return (
    <button
      type="submit"
      className="w-full h-[2.93vw] cursor-pointer border-none rounded-full bg-primary text-w-ground text-[1.32vw] px-[1.46vw] font-ptd-400 outline-none cursor-pointer"
      {...rest}
    >
      {children}
    </button>
  );
}