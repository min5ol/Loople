export default function LoginInputField({ type, name, value, onChange }) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-[25.48vw] h-[2.93vw] border-none rounded-full bg-[#152B22] px-[1.46vw] shadow-inner text-w-ground text-[1.32vw] font-ptd-400 outline-none"
    />
  );
}