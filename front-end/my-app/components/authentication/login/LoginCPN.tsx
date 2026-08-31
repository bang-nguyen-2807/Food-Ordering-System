"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLoginUser } from "../../../features/authentication/login/LoginSlice";
import { AppDispatch, RootState } from "../../../store/store";
import { Utensils, User, Lock, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import CreateAccountModal from "../createAccount/CreateAccountModal";

export default function LoginCPN() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  // Lấy dữ liệu từ Redux Store
  const { isLoading, error } = useSelector((state: RootState) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Gửi action đăng nhập
    const result = await dispatch(fetchLoginUser({ username, password }));

    // Nếu đăng nhập thành công
    if (fetchLoginUser.fulfilled.match(result)) {
      alert("Đăng nhập thành công!");
      window.location.href = "/admin/dashboard"; // Chuyển trang
    }
  };

  return (
    <>
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-orange-500/5 border border-gray-100 p-8 sm:p-10 transition-all">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/25 mb-4">
            <Utensils className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Food<span className="text-orange-500">Go</span>
          </h2>
          <p className="text-sm text-gray-500 mt-1.5 font-medium">
            Đăng nhập để truy cập hệ thống quản lý
          </p>
        </div>

        {/* Thông báo lỗi từ Redux */}
        {error && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-medium animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
            <span className="flex-1">{error}</span>
          </div>
        )}

        {/* Form Đăng nhập */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username / Email Input */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Tên đăng nhập / Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                required
                placeholder="Nhập tên đăng nhập hoặc email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50/70 border border-gray-200 rounded-2xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Mật khẩu
              </label>
              <a
                href="#forgot-password"
                className="text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors"
              >
                Quên mật khẩu?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Nhập mật khẩu của bạn"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-11 py-3 bg-gray-50/70 border border-gray-200 rounded-2xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="w-4 h-4 text-orange-600 border-gray-300 rounded-md focus:ring-orange-500 cursor-pointer"
            />
            <label
              htmlFor="remember-me"
              className="ml-2.5 block text-xs font-medium text-gray-600 cursor-pointer select-none"
            >
              Ghi nhớ đăng nhập trên thiết bị này
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-sm font-bold rounded-2xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 focus:outline-none focus:ring-4 focus:ring-orange-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang xác thực...</span>
              </>
            ) : (
              <span>Đăng Nhập</span>
            )}
          </button>
        </form>

        {/* Footer Info */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500">
            Chưa có tài khoản FoodGo?{" "}
            <button
              type="button"
              onClick={() => setIsRegisterOpen(true)}
              className="font-bold text-orange-600 hover:text-orange-700 transition-colors cursor-pointer inline-block ml-1"
            >
              Đăng ký ngay
            </button>
          </p>
        </div>
      </div>

      {/* Modal Đăng Ký Tạo Tài Khoản */}
      <CreateAccountModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={() => {
          setIsRegisterOpen(false);
        }}
      />
    </>
  );
}