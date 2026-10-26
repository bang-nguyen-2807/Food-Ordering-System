import { X } from "lucide-react";

export interface ModalChatBotAIProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function ModalChatBotAI({
  isOpen,
  onClose,
  children,
}: ModalChatBotAIProps) {
  if (!isOpen) return null;

  return (
    // Nằm fixed góc phải màn hình, ngay phía trên nút button (bottom-24 = button cao 56px + gap)
    <div className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-[#1a1a1a] text-white px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-lg">🤖</span>
          <span className="font-bold text-sm">Trợ lý AI nhà hàng</span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-300 hover:text-white transition-colors cursor-pointer"
          aria-label="Đóng"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body — children truyền vào từ ngoài */}
      <div className="flex-1">{children}</div>
    </div>
  );
}