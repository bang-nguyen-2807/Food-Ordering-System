"use client";

import React, { useState } from "react";
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