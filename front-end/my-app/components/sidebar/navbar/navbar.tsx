"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Ticket,
  BarChart3,
  Settings,
  LogOut,
  Utensils,
  BookOpen,
  Truck,
  Store,
  LayoutGrid,
  History
} from "lucide-react";
import LogoutModal from "@/components/authentication/logout/LogoutModal";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const token = localStorage.getItem("accessToken");
    setHasToken(!!token);
  }, []);

  // 1. Tránh đè giao diện SSR & Ẩn Navbar khi CHƯA ĐĂNG NHẬP (chưa có token)
  if (!isMounted || !hasToken) {
    return null;
  }

  // 2. Nếu ở Trang chủ khách hàng ("/") hoặc Trang Đăng nhập/Đăng ký -> Không hiển thị Navbar
  if (pathname === "/" || pathname?.startsWith("/authentication")) {
    return null;
  }

  // 3. Nếu ở tuyến đường Nhà hàng (/restaurant) -> Hiển thị Sidebar Đối Tác đúng theo thiết kế
  if (pathname?.startsWith("/restaurant")) {
    const merchantNavItems: NavItem[] = [
      {
        title: "Tổng quan",
        href: "/restaurant/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Quản lý đơn hàng",
        href: "/restaurant/managerOrder",
        icon: ShoppingBag,
      },
      {
        title: "Quản lý thực đơn",
        href: "/restaurant/managerMenu",
        icon: BookOpen,
      },
    ];

    return (
      <>
        <aside className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col justify-between p-4 sticky top-0 select-none shrink-0 shadow-xs z-40">
          <div className="flex flex-col gap-6">
            {/* Header Logo: FoodGo + Tag ĐỐI TÁC */}
            <div className="flex items-center gap-2.5 px-3 py-2">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold shadow-md shadow-orange-500/20">
                <Utensils className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-gray-900 leading-none">
                    Food<span className="text-orange-500">Go</span>
                  </span>
                </div>
                <span className="text-[10px] font-extrabold text-orange-600 tracking-wider uppercase mt-0.5">
                  ĐỐI TÁC
                </span>
              </div>
            </div>

            {/* Danh sách Menu Nhà hàng */}
            <nav className="space-y-1.5">
              {merchantNavItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/restaurant/dashboard" && pathname?.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all group ${
                      isActive
                        ? "bg-orange-50/80 text-orange-600 font-bold shadow-xs"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon
                      className={`w-4.5 h-4.5 transition-transform group-hover:scale-110 ${
                        isActive ? "text-orange-600" : "text-gray-400 group-hover:text-gray-600"
                      }`}
                    />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Footer Sidebar: Thông tin Nhà hàng */}
          <div className="border-t border-gray-100 pt-4 mt-auto">
            <div className="flex items-center justify-between p-2 rounded-2xl bg-gray-50/80 border border-gray-100">
              <div className="flex items-center gap-2.5 truncate">
                <div className="w-10 h-10 rounded-xl bg-orange-500 text-white font-bold flex items-center justify-center shrink-0 shadow-xs overflow-hidden">
                  <Store className="w-5 h-5" />
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-xs font-bold text-gray-900 truncate">
                    Phở Bát Đàn Gia Tru...
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium truncate">
                    Chi nhánh Hoàn Kiếm
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="p-1.5 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                title="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        <LogoutModal
          isOpen={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen(false)}
        />
      </>
    );
  }

  // 4. Nếu ở tuyến đường Tài xế (/shipper) -> Hiển thị Sidebar Tài Xế đúng theo thiết kế
  if (pathname?.startsWith("/shipper")) {
    const shipperNavItems: NavItem[] = [
      {
        title: "Tổng quan & Đơn mới",
        href: "/shipper/dashboard",
        icon: LayoutGrid,
      },
      {
        title: "Đơn hàng đang giao",
        href: "/shipper/delivering",
        icon: Truck,
      },
      {
        title: "Lịch sử giao hàng",
        href: "/shipper/history",
        icon: History,
      },
    ];

    return (
      <>
        <aside className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col justify-between p-4 sticky top-0 select-none shrink-0 shadow-xs z-40">
          <div className="flex flex-col gap-6">
            {/* Header Logo: FoodGo + Tag TÀI XẾ GIAO HÀNG */}
            <div className="flex items-center gap-2.5 px-3 py-2">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold shadow-md shadow-orange-500/20">
                <Utensils className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-gray-900 leading-none">
                    Food<span className="text-orange-500">Go</span>
                  </span>
                </div>
                <span className="text-[10px] font-extrabold text-orange-600 tracking-wider uppercase mt-0.5">
                  TÀI XẾ GIAO HÀNG
                </span>
              </div>
            </div>

            {/* Danh sách Menu Shipper */}
            <nav className="space-y-1.5">
              {shipperNavItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/shipper/dashboard" && pathname?.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all group ${
                      isActive
                        ? "bg-orange-50/80 text-orange-600 font-bold shadow-xs"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon
                      className={`w-4.5 h-4.5 transition-transform group-hover:scale-110 ${
                        isActive ? "text-orange-600" : "text-gray-400 group-hover:text-gray-600"
                      }`}
                    />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Footer Sidebar: Thông tin Tài xế */}
          <div className="border-t border-gray-100 pt-4 mt-auto">
            <div className="flex items-center justify-between p-2 rounded-2xl bg-gray-50/80 border border-gray-100">
              <div className="flex items-center gap-2.5 truncate">
                <div className="w-10 h-10 rounded-xl bg-orange-500 text-white font-bold flex items-center justify-center shrink-0 shadow-xs overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"
                    alt="Shipper Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-xs font-bold text-gray-900 truncate">
                    Trần Văn Lâm
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium truncate">
                    Đội xe: Đống Đa #HN2
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="p-1.5 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                title="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        <LogoutModal
          isOpen={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen(false)}
        />
      </>
    );
  }

  // 4. Mặc định là Sidebar Admin
  const mainNavItems: NavItem[] = [
    {
      title: "Tổng quan",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Thành viên & Đối tác",
      href: "/admin/users",
      icon: Users,
    },
    {
      title: "Quản lý đơn hàng",
      href: "/admin/orders",
      icon: ShoppingBag,
      badge: "Mới",
    },
    {
      title: "Mã khuyến mãi",
      href: "/admin/sales",
      icon: Ticket,
    },
    {
      title: "Thống kê doanh thu",
      href: "/admin/analytics",
      icon: BarChart3,
    },
  ];

  const secondaryNavItems: NavItem[] = [
    {
      title: "Cài đặt hệ thống",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <>
      <aside className="w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-100 flex flex-col justify-between p-4 sticky top-16 select-none shrink-0 shadow-xs">
        <div className="flex flex-col gap-6">
          {/* Main Navigation Category */}
          <div>
            <p className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Quản lý chính
            </p>
            <nav className="space-y-1">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname?.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold shadow-md shadow-orange-500/20"
                        : "text-gray-600 hover:bg-orange-50/60 hover:text-orange-600"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                          isActive ? "text-white" : "text-gray-500 group-hover:text-orange-600"
                        }`}
                      />
                      <span>{item.title}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-orange-100 text-orange-600"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Secondary Navigation */}
          <div>
            <p className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Cấu hình
            </p>
            <nav className="space-y-1">
              {secondaryNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold shadow-md shadow-orange-500/20"
                        : "text-gray-600 hover:bg-orange-50/60 hover:text-orange-600"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        isActive ? "text-white" : "text-gray-500 group-hover:text-orange-600"
                      }`}
                    />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Sidebar Footer User Info & Logout Card */}
        <div className="border-t border-gray-100 pt-4 mt-auto">
          <div className="bg-gray-50 rounded-2xl p-3 flex items-center justify-between border border-gray-100">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-orange-500 text-white font-bold flex items-center justify-center shrink-0 shadow-xs">
                <Utensils className="w-5 h-5" />
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-bold text-gray-800 truncate">
                  FoodGo Admin
                </span>
                <span className="text-[10px] text-gray-400 font-medium truncate">
                  Phiên bản v1.0.0
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              title="Đăng xuất"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Modal xác nhận đăng xuất */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      />
    </>
  );
}