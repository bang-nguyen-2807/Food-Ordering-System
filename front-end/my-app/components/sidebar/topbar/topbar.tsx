"use client";

import React, { useState } from "react";
import {
  Search,
  ShoppingCart,
  Bell,
  Utensils,
  ChevronDown,
  Menu,
  User,
  LogOut,
  Settings,
  ShieldCheck,
} from "lucide-react";
import LogoutModal from "@/components/authentication/logout/LogoutModal";

interface TopbarProps {
  onToggleSidebar?: () => void;
  cartCount?: number;
  userName?: string;
  userRole?: string;
}

export default function Topbar({
  onToggleSidebar,
  cartCount = 3,
  userName = "Minh Anh",
  userRole = "Admin System",
}: TopbarProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 w-full h-16 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 sm:px-6 flex items-center justify-between shadow-xs">
        {/* Left Section: Mobile Menu Toggle & Brand Logo */}
        <div className="flex items-center gap-3 sm:gap-4">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 lg:hidden transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Brand Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer select-none">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <Utensils className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-gray-900 leading-none">
                Food<span className="text-orange-500">Go</span>
              </span>
              <span className="text-[10px] font-medium text-gray-400 tracking-wider uppercase">
                Ordering System
              </span>
            </div>
          </div>
        </div>

        {/* Middle Section: Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm món ăn, nhà hàng, đơn hàng..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all text-gray-800 placeholder-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                Xóa
              </button>
            )}
          </div>
        </div>

        {/* Right Section: Actions & User Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notifications Button */}
          <button
            className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Thông báo"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full ring-2 ring-white"></span>
          </button>

          {/* Cart Trigger */}
          <button
            className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Giỏ hàng"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white font-bold text-[11px] rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center border-2 border-white shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          {/* Separator */}
          <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2.5 p-1.5 rounded-full sm:rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-200 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center text-sm border border-orange-200 overflow-hidden shadow-xs">
                <User className="w-5 h-5 text-orange-600" />
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-sm font-semibold text-gray-800 leading-tight">
                  {userName}
                </span>
                <span className="text-[11px] text-gray-500 font-medium">
                  {userRole}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2.5 border-b border-gray-100 sm:hidden">
                  <p className="text-sm font-semibold text-gray-800">{userName}</p>
                  <p className="text-xs text-gray-500">{userRole}</p>
                </div>
                <a
                  href="#profile"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  <User className="w-4 h-4" /> Thông tin cá nhân
                </a>
                <a
                  href="#settings"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  <Settings className="w-4 h-4" /> Cài đặt tài khoản
                </a>
                <a
                  href="#admin"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4" /> Quyền hệ thống
                </a>
                <div className="my-1 border-t border-gray-100"></div>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    setIsLogoutModalOpen(true);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modal xác nhận đăng xuất */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      />
    </>
  );
}