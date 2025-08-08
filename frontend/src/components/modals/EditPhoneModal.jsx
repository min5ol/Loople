// src/components/modals/EditPhoneModal.jsx

import Modal from "../common/Modal";
import { updatePhone } from "../../apis/user";
import { useState } from "react";

export default function EditPhoneModal({ currentPhone, onClose, onSuccess }) {
  const [phone, setPhone] = useState(currentPhone);
  const [verified, setVerified] = useState(false);

  const simulatePassAuth = async () => {
    alert("패스 인증 시뮬레이션 성공");
    setVerified(true);
  };

  const handleConfirm = async () => {
    if (!verified) {
      alert("먼저 패스 인증을 완료해주세요.");
      return;
    }
    await updatePhone(phone);
    onSuccess(phone);
    onClose();
  };

  return (
    <Modal title="휴대폰 번호 변경" onClose={onClose} onConfirm={handleConfirm}>
      <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border p-2 rounded-lg mb-3" />
      <button onClick={simulatePassAuth} className="px-3 py-1 rounded-lg bg-secondary text-white">
        패스 인증하기
      </button>
    </Modal>
  );
}
