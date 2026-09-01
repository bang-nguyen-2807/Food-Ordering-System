"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCreateAccount,
  resetCreateAccountState,
} from "@/features/authentication/createAccount/createAccountSlice";
import { AppDispatch, RootState } from "@/store/store";
import {
  User,
  AtSign,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Truck,
  ShoppingBag,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Utensils,
} from "lucide-react";

interface CreateAccountCPNProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export default function CreateAccountCPN({
  onSuccess,
  onSwitchToLogin,
}: CreateAccountCPNProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, isSuccess, error, successMessage } = useSelector(
    (state: RootState) => state.createAccount
  );

  const [systemRole, setSystemRole] = useState<"CUSTOMER" | "SHIPPER">("CUSTOMER");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [numberPhone, setNumberPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Reset form khi unmount
  useEffect(() => {
    return () => {
      dispatch(resetCreateAccountState());
    };
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Kiểm tra mật khẩu khớp nhau
    if (password !== confirmPassword) {
      setValidationError("Mật khẩu xác nhận không trùng khớp!");
      return;
    }

    if (password.length < 3) {
      setValidationError("Mật khẩu phải có ít nhất 3 ký tự!");
      return;
    }

    if (username.trim().length < 3) {
      setValidationError("Tên đăng nhập phải có ít nhất 3 ký tự!");
      return;
    }

    // Gửi action đăng ký
    const result = await dispatch(
      fetchCreateAccount({
        fullName: fullName.trim(),
        username: username.trim(),
        numberPhone: numberPhone.trim(),
        email: email.trim(),
        password,
        systemRole,
      })
    );

    if (fetchCreateAccount.fulfilled.match(result)) {
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1800);
      }
    }
  };

  // Nếu đăng ký thành công -> hiển thị màn hình chúc mừng
  if (isSuccess) {
    return (
      <div className="w-full text-center py-6 animate-in fade-in duration-300">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          Đăng Ký Thành Công! 🎉
        </h3>
        <p className="text-sm text-gray-500 font-medium mt-2 max-w-sm mx-auto">
          {successMessage ||
            `Tài khoản ${systemRole === "SHIPPER" ? "Tài xế giao hàng" : "Khách hàng"} của bạn đã sẵn sàng.`}
        </p>

        <div className="mt-6 flex justify-center">
          <button
            onClick={onSwitchToLogin}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-sm font-bold rounded-2xl shadow-lg shadow-orange-500/25 transition-all cursor-pointer"
          >
            Đăng Nhập Ngay
          </button>
        </div>
      </div>
    );
  }

  const displayError = validationError || error;

  return (
    <div className="w-full">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 mb-3">
          <Utensils className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          Tạo Tài Khoản <span className="text-orange-500">FoodGo</span>
        </h2>
        <p className="text-xs text-gray-500 font-medium mt-1">
          Điền đầy đủ thông tin bên dưới để bắt đầu
        </p>
      </div>

      {/* Lựa chọn Vai Trò (Role Tabs) */}
      <div className="mb-6 p-1 bg-gray-100/90 rounded-2xl grid grid-cols-2 gap-1 text-xs font-bold border border-gray-200/60">
        <button
          type="button"
          onClick={() => setSystemRole("CUSTOMER")}
          className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
            systemRole === "CUSTOMER"
              ? "bg-white text-orange-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Khách Hàng</span>
        </button>

        <button
          type="button"
          onClick={() => setSystemRole("SHIPPER")}
          className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
            systemRole === "SHIPPER"
              ? "bg-white text-orange-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Tài Xế Shipper</span>
        </button>
      </div>

      {/* Thông báo lỗi */}
      {displayError && (
        <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5 text-red-600 text-xs font-semibold animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{displayError}</span>
        </div>
      )}

      {/* Form Đăng ký */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* FullName */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700">Họ và Tên</label>
          <div className="relative">
            <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nguyễn Văn A"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Username */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700">Tên Đăng Nhập</label>
          <div className="relative">
            <AtSign className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username123"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Phone & Email Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">Số Điện Thoại</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                value={numberPhone}
                onChange={(e) => setNumberPhone(e.target.value)}
                placeholder="0912345678"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700">Mật Khẩu</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700">Xác Nhận Mật Khẩu</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 mt-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-sm font-bold rounded-2xl shadow-lg shadow-orange-500/20 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Đang Xử Lý...</span>
            </>
          ) : (
            <span>Tạo Tài Khoản</span>
          )}
        </button>
      </form>

      {/* Switch to Login */}
      {onSwitchToLogin && (
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 font-medium">
            Đã có tài khoản?{" "}
            <button
              onClick={onSwitchToLogin}
              className="text-orange-600 font-bold hover:underline cursor-pointer"
            >
              Đăng Nhập Ngay
            </button>
          </p>
        </div>
      )}
    </div>
  );
}
