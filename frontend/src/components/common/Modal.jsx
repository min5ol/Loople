// src/components/common/Modal.jsx

export default function Modal({ title, children, onClose, onConfirm, confirmText = "확인" }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-ptd-700 mb-4">{title}</h2>
        <div className="mb-6">{children}</div>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 font-ptd-500">
            취소
          </button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-light font-ptd-500">
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}