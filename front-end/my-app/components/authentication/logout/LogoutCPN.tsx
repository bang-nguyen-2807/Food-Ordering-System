"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logout } from "@/features/authentication/login/LoginSlice";
import { AppDispatch } from "@/store/store";
import { LogOut, AlertTriangle, Loader2 } from "lucide-react";

interface LogoutCPNProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

export default function LogoutCPN({ onClose, onSuccess }: LogoutCPNProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);
    // Dispatch action đăng xuất trong Redux (clear state user, token, localStorage)
    dispatch(logout());

    setTimeout(() => {
      if (onSuccess) onSuccess();
      if (onClose) onClose();
      router.push("/authentication/login");
    }, 300);
  };

  return (
    <div className="flex flex-col items-center text-center p-2">
      <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-4 border border-red-100 shadow-xs">
        <AlertTriangle className="w-7 h-7" />
      </div>

      <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-2">
        Xác nhận đăng xuất
      </h3>
      <p className="text-sm text-gray-500 max-w-xs mb-6 leading-relaxed">
        Bạn có chắc chắn muốn đăng xuất khỏi hệ thống <span className="font-semibold text-gray-700">FoodGo</span> không?
      </p>

      <div className="flex items-center justify-center gap-3 w-full">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            disabled={isLoggingOut}
            className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-2xl transition-colors cursor-pointer disabled:opacity-50"
          >
            Hủy bỏ
          </button>
        )}
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex-1 py-3 px-4 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-red-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isLoggingOut ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Đang xử lý...</span>
            </>
          ) : (
            <>
              <LogOut className="w-4 h-4" />
              <span>Đăng xuất</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

