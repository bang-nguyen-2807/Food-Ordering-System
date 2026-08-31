"use client";

import React from "react";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

interface ErrorSpinnerProps {
  title?: string;
  message?: string | null;
  onRetry?: () => void;
  fullScreen?: boolean;
  retryText?: string;
  showHomeButton?: boolean;
}

export default function ErrorSpinner({
  title = "Không thể tải dữ liệu",
  message = "Đã có lỗi xảy ra trong quá trình xử lý hoặc mất kết nối tới máy chủ.",
  onRetry,
  fullScreen = false,
  retryText = "Thử lại ngay",
  showHomeButton = false,
}: ErrorSpinnerProps) {
  const content = (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-red-500/5 border border-red-100 p-8 sm:p-10 text-center animate-in fade-in zoom-in-95 duration-200 mx-auto">
      {/* Icon Cảnh báo lỗi */}
      <div className="relative w-16 h-16 rounded-2xl bg-red-50 text-red-500 border border-red-100 flex items-center justify-center mx-auto mb-5 shadow-xs">
        <AlertCircle className="w-8 h-8" />
        <div className="absolute inset-0 rounded-2xl bg-red-400/10 blur-sm"></div>
      </div>

      {/* Tiêu đề lỗi */}
      <h3 className="text-xl font-extrabold text-gray-900 tracking-tight mb-2">
        {title}
      </h3>

      {/* Nội dung chi tiết lỗi */}
      <p className="text-sm text-gray-500 leading-relaxed mb-6 font-medium">
        {message || "Vui lòng kiểm tra lại kết nối mạng hoặc thử lại sau ít phút."}
      </p>

      {/* Nhóm nút hành động */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-sm font-bold rounded-xl shadow-md shadow-orange-500/20 hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{retryText}</span>
          </button>
        )}

        {showHomeButton && (
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl border border-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Trang chủ</span>
          </Link>
        )}
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50/90 backdrop-blur-sm p-4">
        {content}
      </div>
    );
  }

  return (
    <div className="w-full py-12 flex items-center justify-center px-4">
      {content}
    </div>
  );
}