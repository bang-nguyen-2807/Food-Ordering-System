"use client";

import React from "react";
import { Utensils } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
  subMessage?: string;
  fullScreen?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function LoadingSpinner({
  message = "Đang tải dữ liệu...",
  subMessage = "Vui lòng chờ trong giây lát...",
  fullScreen = false,
  size = "md",
}: LoadingSpinnerProps) {
  // Kích thước vòng xoay theo prop size
  const sizeMap = {
    sm: "w-10 h-10 border-3",
    md: "w-16 h-16 border-4",
    lg: "w-20 h-20 border-[5px]",
  };

  const iconSizeMap = {
    sm: "w-4 h-4",
    md: "w-7 h-7",
    lg: "w-9 h-9",
  };

  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center max-w-sm w-full mx-auto select-none animate-in fade-in zoom-in-95 duration-200">
      {/* Container Vòng xoay kết hợp Icon FoodGo ở giữa */}
      <div className="relative flex items-center justify-center mb-6">
        {/* Vòng xoay Gradient bên ngoài */}
        <div
          className={`${sizeMap[size]} rounded-full border-orange-100 border-t-orange-500 border-r-amber-500 animate-spin`}
        ></div>

        {/* Vòng hào quang mờ phía sau */}
        <div className="absolute inset-0 rounded-full bg-orange-400/20 blur-md animate-pulse"></div>

        {/* Icon FoodGo nổi ở trung tâm */}
        <div className="absolute flex items-center justify-center text-orange-500 animate-pulse">
          <Utensils className={iconSizeMap[size]} />
        </div>
      </div>

      {/* Tiêu đề loading */}
      <h3 className="text-base font-bold text-gray-800 tracking-tight flex items-center gap-1">
        <span>{message}</span>
        <span className="flex space-x-1 ml-1">
          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce"></span>
        </span>
      </h3>

      {/* Dòng chữ phụ */}
      {subMessage && (
        <p className="text-xs text-gray-400 font-medium mt-1.5">
          {subMessage}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return (
    <div className="w-full py-12 flex items-center justify-center">
      {content}
    </div>
  );
}