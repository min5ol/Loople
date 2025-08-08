// src/components/modals/EditProfileImageModal.jsx

import usePresignedUpload from "../../hooks/usePresignedUpload";
import { updateProfileImage } from "../../apis/user";
import Modal from "../common/Modal";

export default function EditProfileImageModal({ onClose, onSuccess }) {
  const { uploadFile } = usePresignedUpload();
  const [file, setFile] = useState(null);

  const handleConfirm = async () => {
    if (!file) return;
    const imageUrl = await uploadFile(file); // S3 업로드
    await updateProfileImage(imageUrl); // DB 업데이트
    onSuccess(imageUrl);
    onClose();
  };

  return (
    <Modal title="프로필 이미지 변경" onClose={onClose} onConfirm={handleConfirm}>
      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
    </Modal>
  );
}