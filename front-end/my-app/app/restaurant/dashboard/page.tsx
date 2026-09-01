"use client";

import React from "react";
import {
  ShoppingBag,
  DollarSign,
  Clock,
  CheckCircle2,
  Bell,
  Utensils,
  ChevronRight,
  TrendingUp
} from "lucide-react";

export default function MerchantDashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* 1. Header Trang: Tổng quan hoạt động + Badge Đang mở cửa + Nút thông báo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Tổng quan hoạt động
          </h1>
          <p className="text-sm text-gray-500 font-medium mt-1">
            Chào mừng trở lại! Dưới đây là hiệu suất kinh doanh của nhà hàng hôm nay.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200/60 rounded-full text-xs font-extrabold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Đang mở cửa
          </span>

          <button className="p-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-full border border-gray-200 shadow-xs transition-all cursor-pointer relative">
            <Bell className="w-4 h-4 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
          </button>
        </div>
      </div>

      {/* 2. 4 Thẻ Thống Kê KPI Tổng Quan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Thẻ 1: Đơn hàng hôm nay */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-gray-400">Đơn hàng hôm nay</span>
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              48 đơn
            </h3>
            <p className="text-xs font-bold text-emerald-600 mt-1 flex items-center gap-1">
              +12% <span className="text-gray-400 font-medium">so với hôm qua</span>
            </p>
          </div>
        </div>

        {/* Thẻ 2: Doanh thu ước tính */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-gray-400">Doanh thu ước tính</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              3.120.000đ
            </h3>
            <p className="text-xs font-bold text-emerald-600 mt-1 flex items-center gap-1">
              +18.4% <span className="text-gray-400 font-medium">tuần này</span>
            </p>
          </div>
        </div>

        {/* Thẻ 3: Đơn đang xử lý */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-gray-400">Đơn đang xử lý</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              8 đơn
            </h3>
            <p className="text-xs font-bold text-emerald-600 mt-1">
              4 đơn chờ chuẩn bị
            </p>
          </div>
        </div>

        {/* Thẻ 4: Đã hoàn thành */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-gray-400">Đã hoàn thành</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              40 đơn
            </h3>
            <p className="text-xs font-bold text-emerald-600 mt-1">
              Tỷ lệ hoàn thành 98%
            </p>
          </div>
        </div>

      </div>

      {/* 3. Khung Doanh thu tuần này & Đơn hàng vừa đặt */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Biểu đồ doanh thu tuần này (3 cột) */}
        <div className="lg:col-span-3 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Doanh thu tuần này</h2>
            <span className="text-xs font-semibold text-gray-400">Đơn vị: Nghìn VNĐ</span>
          </div>

          <div className="h-64 flex items-end justify-between gap-3 pt-8 px-4 border-b border-gray-100">
            {[
              { day: "Thứ 2", val: "1800k", h: 40 },
              { day: "Thứ 3", val: "2400k", h: 52 },
              { day: "Thứ 4", val: "2100k", h: 46 },
              { day: "Thứ 5", val: "3200k", h: 68 },
              { day: "Thứ 6", val: "2900k", h: 62 },
              { day: "Thứ 7", val: "4500k", h: 95, active: true },
              { day: "Chủ Nhật", val: "3800k", h: 80 },
            ].map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                <span className="text-[11px] font-bold text-gray-500 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.val}
                </span>
                <div
                  style={{ height: `${item.h}%` }}
                  className={`w-full max-w-[42px] rounded-2xl transition-all shadow-xs ${
                    item.active
                      ? "bg-gradient-to-t from-orange-500 to-amber-500"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                ></div>
                <span className="text-xs font-semibold text-gray-400 mt-3">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Danh sách đơn hàng vừa đặt (2 cột) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Đơn hàng vừa đặt</h2>
            <button className="text-xs font-bold text-orange-500 hover:underline cursor-pointer">
              Xem tất cả
            </button>
          </div>

          <div className="space-y-3">
            {[
              {
                id: "#FG-9923",
                customer: "Minh Anh",
                items: "2x Phở Đặc Biệt, 1x Nộm Bò Khô",
                total: "170.000đ",
                status: "Chờ nhận",
                statusClass: "bg-blue-50 text-blue-600"
              },
              {
                id: "#FG-9920",
                customer: "Hoàng Nam",
                items: "1x Cơm Rang Dưa Bò, 1x Trà chanh",
                total: "75.000đ",
                status: "Đang chế biến",
                statusClass: "bg-amber-50 text-amber-600"
              },
              {
                id: "#FG-9918",
                customer: "Khánh Linh",
                items: "3x Bún Chả Hà Nội, 2x Nước sấu",
                total: "210.000đ",
                status: "Chờ tài xế",
                statusClass: "bg-orange-50 text-orange-600"
              },
              {
                id: "#FG-9917",
                customer: "Văn Đức",
                items: "1x Phở Tái Chín, 1x Quẩy thêm",
                total: "65.000đ",
                status: "Đang giao",
                statusClass: "bg-emerald-50 text-emerald-600"
              }
            ].map((order, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-gray-50/60 border border-gray-100 space-y-2 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                    <span className="text-gray-900">{order.id}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-500 font-semibold">{order.customer}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${order.statusClass}`}>
                    {order.status}
                  </span>
                </div>

                <p className="text-xs text-gray-500 font-medium truncate">{order.items}</p>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-gray-400 text-[11px]">Tổng cộng</span>
                  <span className="font-extrabold text-gray-900">{order.total}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
