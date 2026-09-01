"use client";

import { fetchInfoOrder, fetchRestaurantsList, infoOrder } from "@/features/admin/order/OrderSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, ChevronDown, ShoppingBag, AlertCircle, Check, Store } from "lucide-react";
import LoadingSpinner from "@/components/spinner/loading";
import ErrorSpinner from "@/components/spinner/error";

export default function OrderCPN() {
    const dispatch = useDispatch<AppDispatch>();
    const { dataOrder, restaurants, loading, err } = useSelector((state: RootState) => state.adminOrder);
    const [status, setStatus] = useState<string>("");
    const [restaurantId, setRestaurantId] = useState<number>(0);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    
    const [isStatusOpen, setIsStatusOpen] = useState<boolean>(false);
    const [isRestaurantOpen, setIsRestaurantOpen] = useState<boolean>(false);

    const statusOptions = [
        { label: "Tất cả", value: "" },
        { label: "Chờ xử lý", value: "pending" },
        { label: "Đã xác nhận", value: "confirmed" },
        { label: "Đang chuẩn bị", value: "preparing" },
        { label: "Đang giao hàng", value: "delivering" },
        { label: "Hoàn thành", value: "completed" },
        { label: "Đã hủy", value: "cancelled" }
    ];

    useEffect(() => {
        dispatch(fetchRestaurantsList());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchInfoOrder({ Status: status, RestaurantId: restaurantId }));
    }, [dispatch, status, restaurantId]);

    const handleSelectStatus = (val: string) => {
        setStatus(val);
        setIsStatusOpen(false);
    };

    const handleSelectRestaurant = (id: number) => {
        setRestaurantId(id);
        setIsRestaurantOpen(false);
    };

    // Đơn hàng được chọn để xem chi tiết (Mặc định chọn đơn đầu tiên)
    const selectedOrder = dataOrder.find(o => o.OrderId === selectedOrderId) || dataOrder[0];
    // xử lí loading
      if (loading && dataOrder.length === 0) {
        return <LoadingSpinner message="Đang tải dữ liệu đơn hàng" />;
      }
    
      // xử lí err
      if (err && dataOrder.length === 0) {
        return (
          <ErrorSpinner
            message={err}
            onRetry={() => dispatch(fetchInfoOrder({ Status: status, RestaurantId: restaurantId }))}
          />
        );
      }

    const selectedRestaurantName = restaurants.find(r => r.RestaurantId === restaurantId)?.RestaurantName || "Tất cả nhà hàng";

    return (
        <div className="w-full min-h-screen bg-[#F8FAFC] p-4 md:p-8 text-slate-800 font-sans">
            {/* Header Section */}
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                    Quản lý tất cả đơn hàng
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                    Theo dõi và giám sát thời gian thực mọi đơn hàng đang giao dịch trên ứng dụng.
                </p>
            </div>

            {/* Filter Control Bar */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
                {/* Custom Status Dropdown Menu */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => {
                            setIsStatusOpen(!isStatusOpen);
                            setIsRestaurantOpen(false);
                        }}
                        className="flex items-center bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-2xl px-4 py-2.5 shadow-xs hover:shadow-sm text-sm font-medium text-slate-700 hover:border-slate-300 transition-all cursor-pointer"
                    >
                        <span className="text-slate-400 mr-2 text-xs font-normal">Trạng thái:</span>
                        <span className="font-semibold text-slate-900">
                            {statusOptions.find(o => o.value === status)?.label || "Tất cả"}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 ml-2 transition-transform duration-200 ${isStatusOpen ? "rotate-180 text-[#FF5722]" : ""}`} />
                    </button>

                    {isStatusOpen && (
                        <>
                            {/* Backdrop đóng menu khi click ra ngoài */}
                            <div className="fixed inset-0 z-40" onClick={() => setIsStatusOpen(false)} />

                            {/* Dropdown Menu Tùy Chỉnh đẹp tinh tế với thanh cuộn */}
                            <div className="absolute top-full left-0 mt-2 z-50 w-56 bg-white/95 backdrop-blur-md border border-slate-200/70 rounded-2xl shadow-xl shadow-slate-200/60 p-1.5 max-h-60 overflow-y-auto space-y-0.5 text-sm transition-all duration-200">
                                {statusOptions.map((opt) => {
                                    const isSelected = status === opt.value;
                                    return (
                                        <div
                                            key={opt.value}
                                            onClick={() => handleSelectStatus(opt.value)}
                                            className={`px-3.5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between font-medium ${
                                                isSelected
                                                    ? "bg-[#FFF4F0] text-[#FF5722] font-semibold"
                                                    : "hover:bg-slate-100/70 text-slate-700 hover:text-slate-900"
                                            }`}
                                        >
                                            <span>{opt.label}</span>
                                            {isSelected && <Check className="w-4 h-4 text-[#FF5722]" />}
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>

                {/* Filter theo nhà hàng Custom Dropdown Menu */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => {
                            setIsRestaurantOpen(!isRestaurantOpen);
                            setIsStatusOpen(false);
                        }}
                        className="flex items-center bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-2xl px-4 py-2.5 shadow-xs hover:shadow-sm text-sm font-medium text-slate-700 hover:border-slate-300 transition-all cursor-pointer"
                    >
                        <span className="text-slate-400 mr-2 text-xs font-normal">Lọc theo:</span>
                        <span className="font-semibold text-slate-900 max-w-[160px] truncate">
                            {selectedRestaurantName}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 ml-2 transition-transform duration-200 ${isRestaurantOpen ? "rotate-180 text-[#FF5722]" : ""}`} />
                    </button>

                    {isRestaurantOpen && (
                        <>
                            {/* Backdrop đóng menu khi click ra ngoài */}
                            <div className="fixed inset-0 z-40" onClick={() => setIsRestaurantOpen(false)} />

                            {/* Dropdown Menu Tùy Chỉnh Nhà Hàng */}
                            <div className="absolute top-full left-0 mt-2 z-50 w-64 bg-white/95 backdrop-blur-md border border-slate-200/70 rounded-2xl shadow-xl shadow-slate-200/60 p-1.5 max-h-64 overflow-y-auto space-y-0.5 text-sm transition-all duration-200">
                                <div
                                    onClick={() => handleSelectRestaurant(0)}
                                    className={`px-3.5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between font-medium ${
                                        restaurantId === 0
                                            ? "bg-[#FFF4F0] text-[#FF5722] font-semibold"
                                            : "hover:bg-slate-100/70 text-slate-700 hover:text-slate-900"
                                    }`}
                                >
                                    <span>Tất cả nhà hàng</span>
                                    {restaurantId === 0 && <Check className="w-4 h-4 text-[#FF5722]" />}
                                </div>
                                {restaurants.map((res) => {
                                    const isSelected = restaurantId === res.RestaurantId;
                                    return (
                                        <div
                                            key={res.RestaurantId}
                                            onClick={() => handleSelectRestaurant(res.RestaurantId)}
                                            className={`px-3.5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between font-medium ${
                                                isSelected
                                                    ? "bg-[#FFF4F0] text-[#FF5722] font-semibold"
                                                    : "hover:bg-slate-100/70 text-slate-700 hover:text-slate-900"
                                            }`}
                                        >
                                            <span className="truncate mr-2">{res.RestaurantName}</span>
                                            {isSelected && <Check className="w-4 h-4 text-[#FF5722] flex-shrink-0" />}
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>

                {/* Filter thời gian */}
                <div className="flex items-center bg-white border border-slate-200/80 rounded-2xl px-4 py-2.5 shadow-xs text-sm font-medium text-slate-700 cursor-pointer hover:border-slate-300 transition-colors">
                    <span className="text-slate-500 mr-2">Thời gian:</span>
                    <span className="font-semibold text-slate-800 mr-2">Hôm nay</span>
                    <Calendar className="w-4 h-4 text-slate-500" />
                </div>
            </div>

            {/* Thông báo lỗi nếu có */}
            {err && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 text-sm flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{err}</span>
                </div>
            )}

            {/* Bố cục chính 2 cột (Bảng đơn hàng bên trái & Chi tiết đơn hàng bên phải) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Bảng đơn hàng bên trái */}
                <div className="lg:col-span-7 xl:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center text-slate-400 space-y-3">
                            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                            <p className="text-sm font-medium">Đang tải dữ liệu đơn hàng...</p>
                        </div>
                    ) : dataOrder.length === 0 ? (
                        <div className="p-12 text-center text-slate-400 space-y-2">
                            <ShoppingBag className="w-12 h-12 mx-auto text-slate-300" />
                            <p className="text-base font-semibold text-slate-600">Chưa có đơn hàng nào</p>
                            <p className="text-xs text-slate-400">Vui lòng chọn trạng thái khác để kiểm tra.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto max-h-[580px] overflow-y-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-xs border-b border-slate-100">
                                    <tr className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        <th className="py-4 px-6">Đơn hàng</th>
                                        <th className="py-4 px-6">Khách hàng</th>
                                        <th className="py-4 px-6">Nhà hàng</th>
                                        <th className="py-4 px-6">Shipper</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {dataOrder.map((order: infoOrder) => {
                                        const isSelected = selectedOrder?.OrderId === order.OrderId;
                                        return (
                                            <tr
                                                key={order.OrderId}
                                                onClick={() => setSelectedOrderId(order.OrderId)}
                                                className={`cursor-pointer transition-colors ${
                                                    isSelected
                                                        ? "bg-[#FFF4F0] text-slate-900 font-medium"
                                                        : "hover:bg-slate-50 text-slate-700"
                                                }`}
                                            >
                                                <td className="py-4 px-6 whitespace-nowrap">
                                                    <span className={`font-bold ${isSelected ? "text-[#FF5722]" : "text-slate-900"}`}>
                                                        #FG-{order.OrderId}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 whitespace-nowrap font-medium text-slate-900">
                                                    {order.CustomerName || "N/A"}
                                                </td>
                                                <td className="py-4 px-6 whitespace-nowrap text-slate-600">
                                                    {order.RestaurantName || "N/A"}
                                                </td>
                                                <td className="py-4 px-6 whitespace-nowrap">
                                                    <span className={order.ShipperName && order.ShipperName !== "Chưa có tài xế" ? "text-slate-700 font-medium" : "text-slate-400"}>
                                                        {order.ShipperName || "Chưa nhận"}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Khung chi tiết đơn hàng bên phải */}
                <div className="lg:col-span-5 xl:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6 sticky top-6">
                    {selectedOrder ? (
                        <>
                            {/* Tiêu đề khung chi tiết */}
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    Chi tiết đơn hàng #FG-{selectedOrder.OrderId}
                                </h2>
                                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 flex-wrap">
                                    <span className="font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                                        {selectedOrder.OrderStatus || "Đang xử lý"}
                                    </span>
                                    <span>•</span>
                                    <span>
                                        Cập nhật: {selectedOrder.OrderDate ? new Date(selectedOrder.OrderDate).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' }) : "N/A"}
                                    </span>
                                </p>
                            </div>

                            {/* Tiến trình thời gian đơn hàng (Timeline) */}
                            <div className="space-y-4 pt-1">
                                {/* Bước 1: Shipper */}
                                <div className="flex items-start gap-3 relative">
                                    <div className="flex flex-col items-center">
                                        <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex-shrink-0 mt-1"></div>
                                        <div className="w-0.5 h-10 bg-emerald-300 my-1"></div>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900">
                                            {selectedOrder.ShipperName && selectedOrder.ShipperName !== "Chưa có tài xế"
                                                ? `Tài xế ${selectedOrder.ShipperName} đang giao`
                                                : "Chưa có tài xế tiếp nhận"}
                                        </h4>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            SĐT: {selectedOrder.ShipperPhone || "N/A"}
                                        </p>
                                    </div>
                                </div>

                                {/* Bước 2: Nhà hàng */}
                                <div className="flex items-start gap-3 relative">
                                    <div className="flex flex-col items-center">
                                        <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex-shrink-0 mt-1"></div>
                                        <div className="w-0.5 h-10 bg-emerald-300 my-1"></div>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900">
                                            Cửa hàng {selectedOrder.RestaurantName}
                                        </h4>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            Món: {selectedOrder.ItemsSummary || "Không có chi tiết món"}
                                        </p>
                                    </div>
                                </div>

                                {/* Bước 3: Khách hàng */}
                                <div className="flex items-start gap-3">
                                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex-shrink-0 mt-1"></div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900">
                                            Khách hàng {selectedOrder.CustomerName}
                                        </h4>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            SĐT: {selectedOrder.CustomerPhone || "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-slate-100 my-3" />

                            {/* Chi tiết chi phí */}
                            <div className="space-y-2.5 bg-slate-50/80 p-4 rounded-xl text-sm">
                                <div className="flex justify-between text-slate-600">
                                    <span>Tạm tính:</span>
                                    <span className="font-medium text-slate-800">{selectedOrder.SubTotal || "0"}đ</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span>Giảm giá:</span>
                                    <span className="font-medium text-emerald-600">-{selectedOrder.DiscountAmount || "0"}đ</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span>Phí giao hàng:</span>
                                    <span className="font-medium text-slate-800">{selectedOrder.DeliveryFee || "0"}đ</span>
                                </div>
                                <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                                    <span>Tổng thanh toán:</span>
                                    <span className="text-[#FF5722]">{selectedOrder.OrderTotal || "0"}đ</span>
                                </div>
                            </div>

                            {/* Thông tin ngày tháng */}
                            <div className="text-xs text-slate-500 space-y-1 pt-1">
                                <p><strong>Ngày đặt:</strong> {selectedOrder.OrderDate ? new Date(selectedOrder.OrderDate).toLocaleString("vi-VN") : "N/A"}</p>
                                <p><strong>Hoàn thành:</strong> {selectedOrder.CompletedAt ? new Date(selectedOrder.CompletedAt).toLocaleString("vi-VN") : "Chưa hoàn thành"}</p>
                            </div>
                        </>
                    ) : (
                        <div className="p-8 text-center text-slate-400">
                            <p className="text-sm">Vui lòng chọn một đơn hàng từ danh sách để xem chi tiết.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}