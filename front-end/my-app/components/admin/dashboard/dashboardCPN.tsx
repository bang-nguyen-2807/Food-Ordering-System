"use client";

import ErrorSpinner from "@/components/spinner/error";
import LoadingSpinner from "@/components/spinner/loading";
import { fetchDashboard , fetchOrderComplete , fetchOrderConfirmed } from "@/features/admin/dashboard/dashboardSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Store,
  Truck,
  TrendingUp,
  RefreshCw,
  Clock,
  CheckCircle2,
  Layers,
  Sparkles,
  ChevronRight,
  Utensils,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

export default function DashboardCPN() {
  const dispatch = useDispatch<AppDispatch>();
  const { data, dataCompleteOrders, dataConfirmedOrders, loading, err } = useSelector(
    (state: RootState) => state.adminDashboard
  );

  useEffect(() => {
    dispatch(fetchDashboard());
    dispatch(fetchOrderComplete()); // đơn hàng thành công // /api/admin/dashboard/order/complete
    dispatch(fetchOrderConfirmed()); // đơn hàng chờ xác nhận // /api/admin/dashboard/order/confirmed
  }, [dispatch]);


  // xử lí loading
  if (loading) {
    return <LoadingSpinner message="Đang tải dữ liệu bảng điều khiển" />;
  }

  // xử lí err
  if (err) {
    return (
      <ErrorSpinner
        message={err}
        onRetry={() => dispatch(fetchDashboard())}
      />
    );
  }

  // Format tiền tệ VNĐ
  const formatVND = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {data.map((item, key) => (
        <div key={key} className="space-y-8">
          {/* Header Bảng Điều Khiển */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  Tổng Quan Hệ Thống
                </h1>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200/60 rounded-full text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Trực tuyến
                </span>
              </div>
              <p className="text-sm text-gray-500 font-medium mt-1">
                Báo cáo tổng hợp số liệu người dùng, đối tác, đơn hàng và doanh thu FoodGo
              </p>
            </div>

            <button
              onClick={() => dispatch(fetchDashboard())}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-semibold rounded-2xl border border-gray-200 transition-all active:scale-95 self-start sm:self-auto cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-gray-500" />
              <span>Làm mới số liệu</span>
            </button>
          </div>

          {/* 5 Thẻ Thống Kê Chính Từ API */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
            {/* 1. Doanh thu hôm nay */}
            <div className="bg-gradient-to-br from-orange-500 to-amber-500 p-5 rounded-3xl text-white shadow-lg shadow-orange-500/20 relative overflow-hidden flex flex-col justify-between group hover:scale-[1.02] transition-transform">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-white/80 uppercase tracking-wider">
                  Doanh thu hôm nay
                </span>
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tight mb-1 truncate" title={formatVND(item.revenue)}>
                  {formatVND(item.revenue)}
                </h3>
                <p className="text-xs text-white/90 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Đơn hoàn tất hôm nay</span>
                </p>
              </div>
            </div>

            {/* 2. Đơn hàng đang xử lý */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs hover:border-orange-200 hover:shadow-md transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Đơn đang xử lý
                </span>
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-1">
                  {Number(item.orderTotal || 0).toLocaleString("vi-VN")}
                </h3>
                <p className="text-xs font-medium text-blue-600 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Chờ quán & đang giao</span>
                </p>
              </div>
            </div>

            {/* 3. Tổng khách hàng */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs hover:border-orange-200 hover:shadow-md transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Khách hàng
                </span>
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-1">
                  {Number(item.usersTotals || 0).toLocaleString("vi-VN")}
                </h3>
                <p className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Tài khoản hoạt động</span>
                </p>
              </div>
            </div>

            {/* 4. Tổng nhà hàng đối tác */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs hover:border-orange-200 hover:shadow-md transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Nhà hàng
                </span>
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Store className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-1">
                  {Number(item.restaurantTotals || 0).toLocaleString("vi-VN")}
                </h3>
                <p className="text-xs font-medium text-purple-600 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Quán ăn đối tác</span>
                </p>
              </div>
            </div>

            {/* 5. Tổng shipper */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs hover:border-orange-200 hover:shadow-md transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Tài xế giao hàng
                </span>
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-1">
                  {Number(item.shipperTotals || 0).toLocaleString("vi-VN")}
                </h3>
                <p className="text-xs font-medium text-amber-600 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Shipper trực tuyến</span>
                </p>
              </div>
            </div>
          </div>

          {/* Phân Tích Xu Hướng & Phân Bổ Trạng Thái Đơn */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Biểu đồ xu hướng tuần */}
            <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Xu Hướng Hoạt Động Tuần Này
                  </h2>
                  <p className="text-xs text-gray-400 font-medium">
                    Biến động doanh thu và đơn hàng theo từng ngày
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                  <span className="w-3 h-3 rounded-md bg-gradient-to-r from-orange-500 to-amber-500"></span>
                  <span>Doanh thu đạt chuẩn</span>
                </div>
              </div>

              {/* Bar Visual */}
              <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-gray-100">
                {[
                  { day: "Th 2", height: "45%", val: "8.5Tr", current: false },
                  { day: "Th 3", height: "60%", val: "12.2Tr", current: false },
                  { day: "Th 4", height: "35%", val: "6.8Tr", current: false },
                  { day: "Th 5", height: "80%", val: "18.4Tr", current: false },
                  { day: "Th 6", height: "70%", val: "15.0Tr", current: false },
                  { day: "Th 7", height: "95%", val: "24.5Tr", current: true },
                  { day: "CN", height: "85%", val: "21.1Tr", current: false },
                ].map((col, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[11px] font-bold text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      {col.val}
                    </span>
                    <div className="w-full max-w-[40px] bg-gray-100 rounded-2xl h-full flex items-end p-1">
                      <div
                        style={{ height: col.height }}
                        className={`w-full rounded-xl transition-all duration-500 ${
                          col.current
                            ? "bg-gradient-to-t from-orange-500 to-amber-400 shadow-md shadow-orange-500/25"
                            : "bg-orange-300 hover:bg-orange-400"
                        }`}
                      ></div>
                    </div>
                    <span className={`text-xs font-semibold ${col.current ? "text-orange-600 font-bold" : "text-gray-500"}`}>
                      {col.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Phân bổ trạng thái đơn */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-6 flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Phân Bổ Trạng Thái Đơn
                </h2>
                <p className="text-xs text-gray-400 font-medium">
                  Tỷ lệ xử lý đơn hàng trên toàn hệ thống
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-gray-700">Đã giao thành công (Completed)</span>
                    <span className="text-emerald-600">82%</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: "82%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-gray-700">Đang chuẩn bị & giao (Processing)</span>
                    <span className="text-orange-600">15%</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: "15%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-gray-700">Chờ xác nhận (Pending)</span>
                    <span className="text-blue-600">3%</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "3%" }}></div>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-orange-50/70 border border-orange-200/60 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">Quản lý thực đơn</p>
                    <p className="text-[10px] text-gray-500">Cập nhật giá và món ăn</p>
                  </div>
                </div>
                <Link
                  href="/admin/orders"
                  className="p-2 text-orange-600 hover:bg-orange-100 rounded-xl transition-colors"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Bảng 1: Danh Sách Đơn Hàng Vừa Tiếp Nhận (Confirmed) */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Đơn Hàng Vừa Tiếp Nhận
                </h2>
                <p className="text-xs text-gray-400 font-medium">
                  Danh sách đơn hàng mới nhất đã xác nhận và đang xử lý
                </p>
              </div>

              <Link
                href="/admin/orders"
                className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors"
              >
                <span>Xem tất cả</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Mã đơn</th>
                    <th className="py-3 px-4">Khách hàng</th>
                    <th className="py-3 px-4">Nhà hàng / Quán</th>
                    <th className="py-3 px-4">Chi tiết món</th>
                    <th className="py-3 px-4">Tổng tiền</th>
                    <th className="py-3 px-4">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {dataConfirmedOrders && dataConfirmedOrders.length > 0 ? (
                    dataConfirmedOrders.map((order) => (
                      <tr key={order.OrderId} className="hover:bg-orange-50/30 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-gray-900">#{order.OrderId}</td>
                        <td className="py-3.5 px-4 font-semibold text-gray-800">
                          {order.CustomerName || order.FullName || "Khách hàng"}
                        </td>
                        <td className="py-3.5 px-4 text-gray-600">{order.RestaurantName || "N/A"}</td>
                        <td className="py-3.5 px-4 text-gray-500 text-xs truncate max-w-[200px]" title={order.ItemsSummary}>
                          {order.ItemsSummary || "Chưa có thông tin món"}
                        </td>
                        <td className="py-3.5 px-4 font-extrabold text-gray-900">
                          {formatVND(order.OrderTotal ?? order.TotalPrice ?? 0)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border bg-blue-50 text-blue-600 border-blue-200">
                            {order.OrderStatus}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-400 text-sm italic">
                        Chưa có đơn hàng mới nào cần xử lý.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bảng 2: Danh Sách Đơn Hàng Đã Hoàn Thành (Completed) */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Đơn Hàng Đã Hoàn Thành
                </h2>
                <p className="text-xs text-gray-400 font-medium">
                  Danh sách các đơn hàng đã được giao thành công tới khách hàng
                </p>
              </div>

              <Link
                href="/admin/orders"
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                <span>Xem tất cả</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Mã đơn</th>
                    <th className="py-3 px-4">Khách hàng</th>
                    <th className="py-3 px-4">Nhà hàng / Quán</th>
                    <th className="py-3 px-4">Chi tiết món</th>
                    <th className="py-3 px-4">Tổng tiền</th>
                    <th className="py-3 px-4">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {dataCompleteOrders && dataCompleteOrders.length > 0 ? (
                    dataCompleteOrders.map((order) => (
                      <tr key={order.OrderId} className="hover:bg-emerald-50/30 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-gray-900">#{order.OrderId}</td>
                        <td className="py-3.5 px-4 font-semibold text-gray-800">
                          {order.CustomerName || order.FullName || "Khách hàng"}
                        </td>
                        <td className="py-3.5 px-4 text-gray-600">{order.RestaurantName || "N/A"}</td>
                        <td className="py-3.5 px-4 text-gray-500 text-xs truncate max-w-[200px]" title={order.ItemsSummary}>
                          {order.ItemsSummary || "Chưa có thông tin món"}
                        </td>
                        <td className="py-3.5 px-4 font-extrabold text-gray-900">
                          {formatVND(order.OrderTotal ?? order.TotalPrice ?? 0)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border bg-emerald-50 text-emerald-600 border-emerald-200">
                            {order.OrderStatus}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-400 text-sm italic">
                        Chưa có đơn hàng hoàn thành nào trong hệ thống.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}