// src/components/modals/EditNicknameModal.jsx

import { checkNickname, updateNickname } from "../../apis/user";
import Modal from "../common/Modal";
import { useState } from "react";

export default function EditNicknameModal({ currentNickname, onClose, onSuccess }) {
  const [nickname, setNickname] = useState(currentNickname);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    const isAvailable = await checkNickname(nickname);
    if (!isAvailable) {
      setError("이미 사용 중인 닉네임입니다.");
      return;
    }
    await updateNickname(nickname);
    onSuccess(nickname);
    onClose();
  };

  return (
    <Modal title="닉네임 변경" onClose={onClose} onConfirm={handleConfirm}>
      <input value={nickname} onChange={(e) => setNickname(e.target.value)} className="w-full border p-2 rounded-lg" />
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </Modal>
  );
}
