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
      <div className="py-8 text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-500 border border-emerald-100 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <CheckCircle2 className="w-9 h-9" />
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
        {/* Họ và Tên */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            Họ và tên
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              required
              placeholder="VD: Nguyễn Văn A"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium"
            />
          </div>
        </div>

        {/* Tên đăng nhập & Số điện thoại (2 cột) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Tên đăng nhập
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <AtSign className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                placeholder="VD: nguyenana"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Số điện thoại
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                required
                placeholder="VD: 0901234567"
                value={numberPhone}
                onChange={(e) => setNumberPhone(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium"
              />
            </div>
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              required
              placeholder="VD: an@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium"
            />
          </div>
        </div>

        {/* Mật khẩu & Xác nhận mật khẩu (2 cột) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Mật khẩu
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Ít nhất 3 ký tự"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Xác nhận mật khẩu
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium"
              />
            </div>
          </div>
        </div>

        {/* Nút Đăng ký */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-sm font-bold rounded-2xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Đang tạo tài khoản...</span>
            </>
          ) : (
            <span>Đăng Ký Tài Khoản {systemRole === "SHIPPER" ? "Tài Xế" : "Khách Hàng"}</span>
          )}
        </button>
      </form>

      {/* Footer Switch to Login */}
      {onSwitchToLogin && (
        <div className="mt-5 text-center text-xs text-gray-500">
          Đã có tài khoản FoodGo?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-bold text-orange-600 hover:text-orange-700 transition-colors cursor-pointer"
          >
            Đăng nhập ngay
          </button>
        </div>
      )}
    </div>
  );
}

