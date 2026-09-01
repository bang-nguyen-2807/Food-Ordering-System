"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  fetchAnalyticsData,
  setFilters,
  resetFilters,
  AnalyticsFilterState
} from "@/features/admin/analytics/analyticsSlice";
import LoadingSpinner from "@/components/spinner/loading";
import ErrorSpinner from "@/components/spinner/error";
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Calendar,
  CreditCard,
  Store,
  PieChart,
  BarChart3,
  Award,
  Clock,
  AlertTriangle,
  Receipt,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Utensils,
  CheckCircle2,
  XCircle,
  Tag,
  ChevronRight
} from "lucide-react";

export default function AnalyticsCPN() {
  const dispatch = useDispatch<AppDispatch>();
  const { data, filters, loading, err } = useSelector((state: RootState) => state.adminAnalytics);

  const [localStartDate, setLocalStartDate] = useState(filters.startDate || "");
  const [localEndDate, setLocalEndDate] = useState(filters.endDate || "");

  useEffect(() => {
    dispatch(fetchAnalyticsData());
  }, [dispatch]);

  // Handler khi thay đổi bộ lọc thời gian preset
  const handleTimeRangeChange = (range: string) => {
    const newFilters: Partial<AnalyticsFilterState> = { timeRange: range };
    if (range !== "custom") {
      newFilters.startDate = "";
      newFilters.endDate = "";
      setLocalStartDate("");
      setLocalEndDate("");
    }
    dispatch(setFilters(newFilters));
    dispatch(fetchAnalyticsData(newFilters));
  };

  // Handler khi áp dụng ngày tùy chọn
  const handleApplyCustomDates = () => {
    if (!localStartDate || !localEndDate) return;
    const newFilters: Partial<AnalyticsFilterState> = {
      timeRange: "custom",
      startDate: localStartDate,
      endDate: localEndDate
    };
    dispatch(setFilters(newFilters));
    dispatch(fetchAnalyticsData(newFilters));
  };

  // Handler khi chọn nhà hàng
  const handleRestaurantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const restId = Number(e.target.value);
    const newFilters = { restaurantId: restId };
    dispatch(setFilters(newFilters));
    dispatch(fetchAnalyticsData(newFilters));
  };

  // Handler khi chọn phương thức thanh toán
  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pMethod = e.target.value;
    const newFilters = { paymentMethod: pMethod };
    dispatch(setFilters(newFilters));
    dispatch(fetchAnalyticsData(newFilters));
  };

  // Format tiền tệ VNĐ
  const formatVND = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    }).format(amount || 0);
  };

  // Export dữ liệu đơn hàng ra CSV
  const handleExportCSV = () => {
    if (!data || !data.orders || data.orders.length === 0) return;
    
    const headers = ["Mã đơn", "Thời gian", "Khách hàng", "Số điện thoại", "Nhà hàng", "Thanh toán", "Tiền món", "Giảm giá", "Phí ship", "Tổng tiền", "Trạng thái"];
    const csvRows = [headers.join(",")];

    data.orders.forEach(o => {
      const row = [
        `"#${o.OrderId}"`,
        `"${new Date(o.CreatedAt).toLocaleString("vi-VN")}"`,
        `"${o.CustomerName || ''}"`,
        `"${o.CustomerPhone || ''}"`,
        `"${o.RestaurantName || ''}"`,
        `"${o.PaymentMethod || 'CASH'}"`,
        o.SubTotal,
        o.DiscountAmount,
        o.DeliveryFee,
        o.TotalPrice,
        `"${o.OrderStatus}"`
      ];
      csvRows.push(row.join(","));
    });

    const blob = new Blob(["\uFEFF" + csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `baocao_doanhthu_${filters.timeRange}_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading && !data) {
    return <LoadingSpinner message="Đang tải số liệu thống kê doanh thu..." />;
  }

  if (err && !data) {
    return (
      <ErrorSpinner
        message={err}
        onRetry={() => dispatch(fetchAnalyticsData())}
      />
    );
  }

  const overview = data?.overview || {
    netRevenue: 0,
    grossRevenue: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    previousNetRevenue: 0,
    growthRate: 0
  };

  const timeline = data?.timeline || [];
  const paymentDist = data?.paymentDistribution || [];
  const categoryDist = data?.categoryDistribution || [];
  const topProducts = data?.topProducts || [];
  const peakHours = data?.peakHours || [];
  const discountLoss = data?.discountAndLoss || {
    TotalDiscountSpent: 0,
    OrdersUsedVoucher: 0,
    TotalLossCancelled: 0,
    CancelledOrdersCount: 0
  };
  const ordersList = data?.orders || [];
  const restaurants = data?.restaurants || [];

  // Tìm giá trị max doanh thu trong timeline để tính chiều cao cột chart SVG
  const maxRevenueInTimeline = Math.max(...timeline.map(t => Number(t.Revenue || 0)), 1);
  const maxHourRevenue = Math.max(...peakHours.map(p => Number(p.Revenue || 0)), 1);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* 1. Header Trang & Thao Tác Báo Cáo */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Thống Kê Doanh Thu
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 border border-amber-200/60 rounded-full text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              Báo cáo thời gian thực
            </span>
          </div>
          <p className="text-sm text-gray-500 font-medium mt-1">
            Phân tích chuyên sâu doanh thu, hiệu quả khuyến mãi, khung giờ cao điểm và top món ăn FoodGo
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => dispatch(fetchAnalyticsData())}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-semibold rounded-2xl border border-gray-200 transition-all active:scale-95 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 text-gray-500 ${loading ? "animate-spin" : ""}`} />
            <span>Làm mới</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-sm font-bold rounded-2xl shadow-md shadow-orange-500/20 transition-all active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Xuất Báo Cáo CSV</span>
          </button>
        </div>
      </div>

      {/* 2. Thanh Bộ Lọc Linh Hoạt (Filtering Options) */}
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
          <Filter className="w-4 h-4 text-orange-500" />
          <span>Bộ Lọc Dữ Liệu Phân Tích</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Lọc khoảng thời gian preset */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "today", label: "Hôm nay" },
              { id: "yesterday", label: "Hôm qua" },
              { id: "7days", label: "7 ngày qua" },
              { id: "30days", label: "30 ngày qua" },
              { id: "this_month", label: "Tháng này" },
              { id: "last_month", label: "Tháng trước" },
              { id: "custom", label: "Tùy chọn" }
            ].map(btn => (
              <button
                key={btn.id}
                onClick={() => handleTimeRangeChange(btn.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filters.timeRange === btn.id
                    ? "bg-orange-500 text-white shadow-sm shadow-orange-500/30"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-100"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Lọc theo Chi nhánh/Nhà hàng & Thanh toán */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Dropdown Chi nhánh */}
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
              <Store className="w-4 h-4 text-orange-500 shrink-0" />
              <select
                value={filters.restaurantId || 0}
                onChange={handleRestaurantChange}
                className="bg-transparent text-xs font-semibold text-gray-700 focus:outline-none cursor-pointer"
              >
                <option value={0}>Tất cả Chi nhánh / Quán</option>
                {restaurants.map(r => (
                  <option key={r.RestaurantId} value={r.RestaurantId}>
                    {r.RestaurantName}
                  </option>
                ))}
              </select>
            </div>

            {/* Dropdown Thanh toán */}
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
              <CreditCard className="w-4 h-4 text-orange-500 shrink-0" />
              <select
                value={filters.paymentMethod || "ALL"}
                onChange={handlePaymentMethodChange}
                className="bg-transparent text-xs font-semibold text-gray-700 focus:outline-none cursor-pointer"
              >
                <option value="ALL">Tất cả thanh toán</option>
                <option value="CASH">Tiền mặt (COD)</option>
                <option value="BANKING">Chuyển khoản / Ví điện tử</option>
              </select>
            </div>
          </div>
        </div>

        {/* Khung ngày Tùy chọn */}
        {filters.timeRange === "custom" && (
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-gray-100 animate-in fade-in">
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
              <span className="text-xs font-bold text-gray-500">Từ:</span>
              <input
                type="date"
                value={localStartDate}
                onChange={e => setLocalStartDate(e.target.value)}
                className="bg-transparent text-xs font-semibold text-gray-800 focus:outline-none cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
              <span className="text-xs font-bold text-gray-500">Đến:</span>
              <input
                type="date"
                value={localEndDate}
                onChange={e => setLocalEndDate(e.target.value)}
                className="bg-transparent text-xs font-semibold text-gray-800 focus:outline-none cursor-pointer"
              />
            </div>

            <button
              onClick={handleApplyCustomDates}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
            >
              Áp dụng lọc
            </button>
          </div>
        )}
      </div>

      {/* 3. Thẻ Chỉ Số Tổng Quan (KPI Summary Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
        
        {/* Thẻ 1: Doanh Thu Thực Nhận (Net Revenue) */}
        <div className="bg-gradient-to-br from-orange-500 to-amber-500 p-5 rounded-3xl text-white shadow-lg shadow-orange-500/20 relative overflow-hidden flex flex-col justify-between group hover:scale-[1.02] transition-transform">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-white/80 uppercase tracking-wider">
              Doanh thu thực nhận
            </span>
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {formatVND(overview.netRevenue)}
            </h3>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-white/90">
              {overview.growthRate >= 0 ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-white/20 text-white font-bold">
                  <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                  +{overview.growthRate}%
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-red-500/40 text-white font-bold">
                  <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                  {overview.growthRate}%
                </span>
              )}
              <span className="text-white/70 text-[11px]">so với kỳ trước</span>
            </div>
          </div>
        </div>

        {/* Thẻ 2: Doanh Thu Gộp (Gross Revenue) */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex flex-col justify-between group hover:border-orange-200 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Doanh thu gộp (Món)
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              {formatVND(overview.grossRevenue)}
            </h3>
            <p className="text-[11px] font-medium text-gray-400 mt-1">
              Trước khi áp dụng voucher/giảm giá
            </p>
          </div>
        </div>

        {/* Thẻ 3: Tổng Số Đơn Hàng */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex flex-col justify-between group hover:border-orange-200 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Tổng đơn hàng
            </span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              {overview.totalOrders} <span className="text-xs font-normal text-gray-400">đơn</span>
            </h3>
            <div className="flex items-center gap-3 mt-2 text-xs font-semibold">
              <span className="text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {overview.completedOrders} xong
              </span>
              <span className="text-red-500 flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" /> {overview.cancelledOrders} hủy
              </span>
            </div>
          </div>
        </div>

        {/* Thẻ 4: Giá Trị Trung Bình / Đơn (AOV) */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex flex-col justify-between group hover:border-orange-200 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Giá trị TB / Đơn (AOV)
            </span>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              {formatVND(overview.averageOrderValue)}
            </h3>
            <p className="text-[11px] font-medium text-gray-400 mt-1">
              Trung bình chi tiêu / lượt đặt món
            </p>
          </div>
        </div>

        {/* Thẻ 5: Tỷ Lệ Tăng Trưởng */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex flex-col justify-between group hover:border-orange-200 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Tăng trưởng so cùng kỳ
            </span>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${overview.growthRate >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
              {overview.growthRate >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            </div>
          </div>
          <div>
            <h3 className={`text-2xl font-bold ${overview.growthRate >= 0 ? "text-emerald-600" : "text-red-600"}`}>
              {overview.growthRate >= 0 ? `+${overview.growthRate}%` : `${overview.growthRate}%`}
            </h3>
            <p className="text-[11px] font-medium text-gray-400 mt-1 truncate">
              Kỳ trước: {formatVND(overview.previousNetRevenue)}
            </p>
          </div>
        </div>

      </div>

      {/* 4. Biểu Đồ Trực Quan Hóa (Charts Section) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Biểu đồ 1: Biến động doanh thu theo thời gian (Line/Bar SVG Chart) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-orange-500" />
                Biến Động Doanh Thu Theo Thời Gian
              </h2>
              <p className="text-xs text-gray-400 font-medium">
                {filters.timeRange === "today" || filters.timeRange === "yesterday"
                  ? "Thống kê theo từng mốc giờ trong ngày"
                  : "Thống kê theo từng ngày trong khoảng thời gian đã chọn"}
              </p>
            </div>
          </div>

          {/* Vùng Vẽ Biểu Đồ SVG Tự Dựng Trực Quan */}
          {timeline.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
              <BarChart3 className="w-10 h-10 text-gray-300 mb-2" />
              <p className="text-xs font-semibold">Chưa có dữ liệu doanh thu trong khoảng thời gian này</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="h-64 flex items-end justify-between gap-2 pt-6 px-2 border-b border-gray-100">
                {timeline.map((item, idx) => {
                  const rev = Number(item.Revenue || 0);
                  const heightPercent = Math.max(Math.round((rev / maxRevenueInTimeline) * 100), 6);

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                      {/* Tooltip Hover */}
                      <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-xl shadow-lg pointer-events-none whitespace-nowrap z-20">
                        <div>{item.TimeLabel}</div>
                        <div className="text-orange-400">{formatVND(rev)}</div>
                        <div className="text-gray-300 text-[10px]">{item.CompletedCount} đơn hoàn tất</div>
                      </div>

                      {/* Thanh Bar Graph */}
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full max-w-[36px] bg-gradient-to-t from-orange-500 to-amber-400 rounded-t-xl group-hover:from-orange-600 group-hover:to-amber-500 transition-all shadow-xs"
                      ></div>
                    </div>
                  );
                })}
              </div>

              {/* Trục X thời gian */}
              <div className="flex items-center justify-between text-[11px] font-semibold text-gray-400 px-2 overflow-x-auto">
                {timeline.map((item, idx) => (
                  <span key={idx} className="truncate text-center max-w-[50px]">
                    {item.TimeLabel.length > 10 ? item.TimeLabel.slice(5) : item.TimeLabel}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Biểu đồ 2: Phân bổ theo Khung Giờ Cao Điểm (Peak Hours) */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              Khung Giờ Cao Điểm
            </h2>
            <p className="text-xs text-gray-400 font-medium">
              Top các khung giờ vàng có doanh thu & đơn hàng cao nhất
            </p>
          </div>

          <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
            {peakHours.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-8">Chưa có dữ liệu khung giờ</p>
            ) : (
              peakHours.slice(0, 6).map((item, idx) => {
                const percent = Math.round((Number(item.Revenue || 0) / maxHourRevenue) * 100);
                const isPeak = item.HourSlot >= 11 && item.HourSlot <= 13 || item.HourSlot >= 18 && item.HourSlot <= 20;

                return (
                  <div key={idx} className="space-y-1.5 p-2.5 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="flex items-center gap-2 text-gray-800 font-bold">
                        <span className={`w-2 h-2 rounded-full ${isPeak ? "bg-orange-500 animate-pulse" : "bg-gray-300"}`}></span>
                        {item.HourSlotText}
                      </span>
                      <span className="text-gray-900 font-bold">{formatVND(item.Revenue)} ({item.OrderCount} đơn)</span>
                    </div>

                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${percent}%` }}
                        className={`h-full rounded-full transition-all ${isPeak ? "bg-gradient-to-r from-orange-500 to-amber-500" : "bg-gray-400"}`}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* 5. Phân Tích Tỷ Trọng & Chi Phí Khuyến Mãi / Thất Thoát */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Tỷ trọng Phương Thức Thanh Toán */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-5">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-blue-500" />
            Phương Thức Thanh Toán
          </h2>

          <div className="space-y-4">
            {paymentDist.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-6">Chưa có thông tin thanh toán</p>
            ) : (
              paymentDist.map((p, idx) => {
                const totalAllRev = paymentDist.reduce((acc, curr) => acc + Number(curr.TotalRevenue || 0), 0);
                const percent = totalAllRev > 0 ? Math.round((Number(p.TotalRevenue || 0) / totalAllRev) * 100) : 0;
                const isCash = p.PaymentMethod === "CASH";

                return (
                  <div key={idx} className="p-3.5 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="flex items-center gap-2 text-gray-800">
                        <span className={`w-3 h-3 rounded-full ${isCash ? "bg-amber-500" : "bg-blue-500"}`}></span>
                        {isCash ? "Tiền mặt (COD)" : "Chuyển khoản / Ví MoMo / VNPay"}
                      </span>
                      <span className="text-gray-900">{percent}%</span>
                    </div>

                    <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${percent}%` }}
                        className={`h-full rounded-full ${isCash ? "bg-amber-500" : "bg-blue-500"}`}
                      ></div>
                    </div>

                    <div className="flex justify-between text-[11px] font-medium text-gray-500">
                      <span>{p.TotalOrders} đơn hàng</span>
                      <span className="font-bold text-gray-800">{formatVND(p.TotalRevenue)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Tỷ trọng Danh Mục Món Ăn */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-5">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-emerald-500" />
            Tỷ Trọng Danh Mục Món
          </h2>

          <div className="space-y-3.5 max-h-[250px] overflow-y-auto pr-1">
            {categoryDist.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-6">Chưa có dữ liệu danh mục</p>
            ) : (
              categoryDist.map((c, idx) => {
                const totalCatRev = categoryDist.reduce((acc, curr) => acc + Number(curr.TotalRevenue || 0), 0);
                const percent = totalCatRev > 0 ? Math.round((Number(c.TotalRevenue || 0) / totalCatRev) * 100) : 0;

                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-gray-700 font-bold">{c.CategoryName}</span>
                      <span className="text-gray-900 font-bold">{formatVND(c.TotalRevenue)} ({percent}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${percent}%` }}
                        className="h-full bg-emerald-500 rounded-full"
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Phân Tích Khuyến Mãi & Tổn Thất Đơn Hủy */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
              <Tag className="w-5 h-5 text-purple-500" />
              Khuyến Mãi & Thất Thoát
            </h2>

            <div className="space-y-3">
              {/* Chi phí Voucher */}
              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-purple-700">Tổng chi khuyến mãi</p>
                  <p className="text-lg font-extrabold text-purple-900">{formatVND(discountLoss.TotalDiscountSpent)}</p>
                  <p className="text-[10px] text-purple-600 font-medium">{discountLoss.OrdersUsedVoucher} lượt dùng mã discount</p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-purple-200/60 text-purple-700 flex items-center justify-center shrink-0">
                  <Tag className="w-4 h-4" />
                </div>
              </div>

              {/* Thất thoát Đơn Hủy */}
              <div className="p-4 rounded-2xl bg-red-50/60 border border-red-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-red-700">Tổn thất đơn bị hủy</p>
                  <p className="text-lg font-extrabold text-red-900">{formatVND(discountLoss.TotalLossCancelled)}</p>
                  <p className="text-[10px] text-red-600 font-medium">{discountLoss.CancelledOrdersCount} đơn boom / hủy thất thoát</p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-red-200/60 text-red-700 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          <div className="text-[11px] font-medium text-gray-400 bg-gray-50 p-3 rounded-2xl border border-gray-100">
            💡 Gợi ý: Kiểm tra các đơn bị hủy liên tục trong cùng khung giờ để tối ưu hóa quy trình chế biến của bếp.
          </div>
        </div>

      </div>

      {/* 6. Top Món Đóng Góp Doanh Thu Cao Nhất */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Top Món Ăn Mang Lại Doanh Thu Cao Nhất
            </h2>
            <p className="text-xs text-gray-400 font-medium mt-0.5">
              Xếp hạng 10 thực đơn có dòng tiền đóng góp tốt nhất hệ thống
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="py-3 px-4">Hạng</th>
                <th className="py-3 px-4">Tên Món Ăn</th>
                <th className="py-3 px-4">Danh Mục</th>
                <th className="py-3 px-4 text-center">Đã Bán</th>
                <th className="py-3 px-4 text-right">Tổng Doanh Thu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {topProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-xs text-gray-400">
                    Chưa có số liệu thực đơn
                  </td>
                </tr>
              ) : (
                topProducts.map((p, idx) => (
                  <tr key={p.MenuItemId || idx} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-extrabold ${
                        idx === 0 ? "bg-amber-500 text-white" : idx === 1 ? "bg-gray-300 text-gray-800" : idx === 2 ? "bg-amber-700 text-white" : "bg-gray-100 text-gray-600"
                      }`}>
                        {idx + 1}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-800 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 font-bold overflow-hidden">
                        {p.ImageUrl ? (
                          <img src={p.ImageUrl} alt={p.ItemName} className="w-full h-full object-cover" />
                        ) : (
                          <Utensils className="w-4 h-4" />
                        )}
                      </div>
                      <span>{p.ItemName}</span>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-gray-500">
                      {p.CategoryName}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-gray-700">
                      {p.QuantitySold} phần
                    </td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-orange-600">
                      {formatVND(p.TotalRevenue)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 7. Bảng Kê Chi Tiết Đơn Hàng (Order Table) */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-gray-700" />
              Bảng Kê Chi Tiết Đơn Hàng ({ordersList.length})
            </h2>
            <p className="text-xs text-gray-400 font-medium mt-0.5">
              Danh sách các đơn phát sinh tương ứng với bộ lọc thời gian & chi nhánh
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="py-3 px-4">Mã Đơn</th>
                <th className="py-3 px-4">Thời Gian</th>
                <th className="py-3 px-4">Khách Hàng</th>
                <th className="py-3 px-4">Nhà Hàng</th>
                <th className="py-3 px-4">Thanh Toán</th>
                <th className="py-3 px-4 text-right">Giảm Giá</th>
                <th className="py-3 px-4 text-right">Tổng Tiền</th>
                <th className="py-3 px-4 text-center">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs font-semibold">
              {ordersList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-gray-400">
                    Không có đơn hàng nào khớp với điều kiện lọc
                  </td>
                </tr>
              ) : (
                ordersList.map(o => (
                  <tr key={o.OrderId} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-orange-600">
                      #{o.OrderId}
                    </td>
                    <td className="py-3.5 px-4 text-gray-500">
                      {new Date(o.CreatedAt).toLocaleString("vi-VN")}
                    </td>
                    <td className="py-3.5 px-4 text-gray-800">
                      <div className="font-bold">{o.CustomerName || "Khách vãng lai"}</div>
                      <div className="text-[10px] text-gray-400">{o.CustomerPhone}</div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-700">
                      {o.RestaurantName}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        o.PaymentMethod === "CASH" ? "bg-amber-50 text-amber-600 border border-amber-200/60" : "bg-blue-50 text-blue-600 border border-blue-200/60"
                      }`}>
                        {o.PaymentMethod === "CASH" ? "Tiền mặt" : "Chuyển khoản"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-purple-600 font-bold">
                      {o.DiscountAmount > 0 ? `-${formatVND(o.DiscountAmount)}` : "-"}
                    </td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-gray-900">
                      {formatVND(o.TotalPrice)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        o.OrderStatus === "COMPLETED"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200/60"
                          : o.OrderStatus === "CANCELLED"
                          ? "bg-red-50 text-red-600 border border-red-200/60"
                          : "bg-orange-50 text-orange-600 border border-orange-200/60"
                      }`}>
                        {o.OrderStatus === "COMPLETED" ? "Hoàn tất" : o.OrderStatus === "CANCELLED" ? "Đã hủy" : o.OrderStatus}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
