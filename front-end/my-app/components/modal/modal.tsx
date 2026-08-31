"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = "lg",
}: ModalProps) {
  // Lắng nghe phím ESC để đóng modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Khóa cuộn trang (scroll) khi modal mở
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidthClass = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  }[maxWidth];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Lớp nền mờ (Backdrop) */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        aria-hidden="true"
      />

      {/* Nội dung Modal (Dialog Box) */}
      <div
        className={`relative w-full ${maxWidthClass} bg-white rounded-3xl shadow-2xl shadow-orange-500/10 border border-gray-100 p-6 sm:p-8 z-10 animate-in fade-in zoom-in-95 duration-200 overflow-hidden my-auto`}
      >
        {/* Nút Đóng Modal (X) */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tiêu đề & Mô tả Header (nếu có) */}
        {(title || description) && (
          <div className="mb-6 pr-8">
            {title && (
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm text-gray-500 font-medium mt-1">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Body Modal */}
        <div className="relative">{children}</div>
      </div>
    </div>
  );
}
