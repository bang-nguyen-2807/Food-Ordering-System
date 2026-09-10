import ErrorSpinner from "@/components/spinner/error";
import LoadingSpinner from "@/components/spinner/loading";
import { fetchDashboard, fetchWeeklyRevenue, fetchOrderJustPlaced, fetchUpdateLocationRestaurant } from "@/features/restaurant/dashboard/dashboardSlice";
import { AppDispatch, RootState } from "@/store/store"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { ShoppingBag, DollarSign, Clock, CheckCircle2, Bell, Utensils, XCircle, AlertCircle, MapPin } from "lucide-react";
import RestaurantLocation from "@/components/location/restaurant/restaurantLocation";
export default function DashboardCPN() {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.login);
    const { dataTotal, dataWeeklyRevenue, dataOrderJustPlaced, loading, err } = useSelector((state: RootState) => state.restaurantDashboard);
    const UserId = user?.UserId || "";
    const [longitude, setLongitude] = useState<string>("");
    const [latitude, setLatitude] = useState<string>("");
    const [nameLocation, setNameLocation] = useState<string>("");
    const apiKey = process.env.NEXT_PUBLIC_API_KEY as string;
    useEffect(() => {
        if (UserId !== "") {
            dispatch(fetchDashboard(String(UserId))); // fetch info total
            dispatch(fetchWeeklyRevenue(String(UserId))); // fetch info weekly revenue
            dispatch(fetchOrderJustPlaced(String(UserId))); // fetch info order just placed
        }
    }, [UserId, dispatch])
    const getPosition = () => {
        // get longitude and latitude
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { longitude, latitude } = position.coords;
                    setLongitude(longitude.toString());
                    setLatitude(latitude.toString());
                    if (UserId) {
                        dispatch(
                            fetchUpdateLocationRestaurant({
                                UserId: String(UserId),
                                longitude: longitude.toString(),
                                latitude: latitude.toString(),
                            })
                        );
                    }
                },
                (error) => {
                    console.error("Error getting location:", error.message);
                }
            );
        }
    };
    useEffect(() => {
        getPosition();
    }, [UserId, dispatch, longitude, latitude])
    // get name in currently location 
    const fetchAddress = async()=>{
        if (!latitude || !longitude) {
        console.log("--> Thiếu tọa độ latitude/longitude");
        return;
      }
      try{
        const address = await RestaurantLocation(latitude, longitude, apiKey);
        setNameLocation(address);
      }
      catch(error){
        console.log("Error getting address:", error);
      }
    }
    useEffect(() => {
        fetchAddress();
    }, [latitude, longitude])
    if (loading) {
        return <LoadingSpinner message="Loading Dashboard ..." />
    }
    if (err) {
        return <ErrorSpinner message={err as string} />
    }

    // Tính toán chiều cao tương đối cho biểu đồ doanh thu
    const maxRevenue = dataWeeklyRevenue.length > 0
        ? Math.max(...dataWeeklyRevenue.map((i) => Number(i.Revenue) || 0), 1)
        : 1;

    return (
        <div className="p-6 space-y-8 animate-in fade-in duration-200 bg-gray-50/50 min-h-screen">
            {/* 1. Header Trang */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-xs">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                        Tổng quan hoạt động nhà hàng
                    </h1>
                    <p className="text-sm text-gray-500 font-medium mt-1">
                        Chào mừng trở lại! Dưới đây là hiệu suất kinh doanh nhà hàng hôm nay.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3.5 self-start xl:self-auto">
                    {/* Badge Vị trí Nhà hàng (UX/UI Mới) */}
                    <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-orange-50/80 to-amber-50/50 border border-orange-200/70 rounded-2xl shadow-2xs transition-all max-w-xs sm:max-w-md group hover:border-orange-300">
                        <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                            <MapPin className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
                                    Vị trí nhà hàng
                                </span>
                                <span className="inline-flex items-center gap-1 text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded-full font-bold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    GPS
                                </span>
                            </div>
                            <p className="text-xs font-extrabold text-gray-800 truncate mt-0.5" title={nameLocation || "Đang xác định vị trí..."}>
                                {nameLocation ? (
                                    nameLocation
                                ) : latitude && longitude ? (
                                    <span className="text-gray-500 font-medium italic animate-pulse">
                                        Đang nhận diện địa chỉ khu vực...
                                    </span>
                                ) : (
                                    <span className="text-gray-400 font-normal italic animate-pulse">
                                        Đang định vị GPS...
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>

                    <span className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-50 text-emerald-600 border border-emerald-200/60 rounded-2xl text-xs font-extrabold shadow-2xs">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Đang mở cửa
                    </span>

                    <button className="p-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-2xl border border-gray-200 shadow-2xs transition-all cursor-pointer relative">
                        <Bell className="w-4.5 h-4.5 text-gray-600" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full"></span>
                    </button>
                </div>
            </div>

            {/* 2. Các Thẻ Thống Kê KPI Tổng Quan (Tất cả 7 Thẻ chung 1 Hàng) */}
            {dataTotal.map((item, index) => (
                <div key={index} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {/* Thẻ 1: Đơn hàng hôm nay */}
                    <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[11px] font-bold text-gray-400 truncate">Tổng số đơn</span>
                            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                                <ShoppingBag className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl xl:text-2xl font-extrabold text-gray-900 tracking-tight">
                                {item.TotalOrders}
                            </h3>
                            <p className="text-[10px] font-semibold text-gray-400 mt-1 truncate">Đơn hôm nay</p>
                        </div>
                    </div>

                    {/* Thẻ 2: Doanh thu ước tính */}
                    <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[11px] font-bold text-gray-400 truncate">Doanh thu</span>
                            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                                <DollarSign className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl xl:text-2xl font-extrabold text-gray-900 tracking-tight truncate" title={`${Number(item.TotalMoney || 0).toLocaleString("vi-VN")}đ`}>
                                {Number(item.TotalMoney || 0).toLocaleString("vi-VN")}đ
                            </h3>
                            <p className="text-[10px] font-semibold text-emerald-600 mt-1 truncate">Tổng hôm nay</p>
                        </div>
                    </div>

                    {/* Thẻ 3: Tổng số món */}
                    <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[11px] font-bold text-gray-400 truncate">Tổng số món</span>
                            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
                                <Utensils className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl xl:text-2xl font-extrabold text-gray-900 tracking-tight">
                                {item.TotalItems}
                            </h3>
                            <p className="text-[10px] font-semibold text-purple-600 mt-1 truncate">Món bán ra</p>
                        </div>
                    </div>

                    {/* Thẻ 4: Đơn đang xử lý */}
                    <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[11px] font-bold text-gray-400 truncate">Đang xử lý</span>
                            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                                <Clock className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl xl:text-2xl font-extrabold text-gray-900 tracking-tight">
                                {item.ProcessingOrders ?? 0}
                            </h3>
                            <p className="text-[10px] font-semibold text-amber-600 mt-1 truncate">Đang chế biến</p>
                        </div>
                    </div>

                    {/* Thẻ 5: Đơn đang chờ */}
                    <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[11px] font-bold text-gray-400 truncate">Đơn đang chờ</span>
                            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center shrink-0">
                                <AlertCircle className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl xl:text-2xl font-extrabold text-gray-900 tracking-tight">
                                {item.PendingOrders ?? 0}
                            </h3>
                            <p className="text-[10px] font-semibold text-sky-600 mt-1 truncate">Chờ xác nhận</p>
                        </div>
                    </div>

                    {/* Thẻ 6: Đơn đã hoàn thành */}
                    <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[11px] font-bold text-gray-400 truncate">Hoàn thành</span>
                            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl xl:text-2xl font-extrabold text-gray-900 tracking-tight">
                                {item.CompletedOrders ?? 0}
                            </h3>
                            <p className="text-[10px] font-semibold text-blue-600 mt-1 truncate">Thành công</p>
                        </div>
                    </div>

                    {/* Thẻ 7: Đơn đã hủy */}
                    <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[11px] font-bold text-gray-400 truncate">Đơn đã hủy</span>
                            <div className="w-8 h-8 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                                <XCircle className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl xl:text-2xl font-extrabold text-gray-900 tracking-tight">
                                {item.CancelledOrders ?? 0}
                            </h3>
                            <p className="text-[10px] font-semibold text-red-500 mt-1 truncate">Đã hủy bỏ</p>
                        </div>
                    </div>
                </div>
            ))}

            {/* 3. Doanh thu tuần này & Đơn hàng mới nhất */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Biểu đồ doanh thu tuần này (3 cột) */}
                <div className="lg:col-span-3 bg-white p-7 rounded-3xl border border-gray-100 shadow-xs space-y-6 flex flex-col justify-between min-h-[480px]">
                    <div className="flex items-center justify-between">
                        <h1 className="text-lg font-bold text-gray-900">Doanh thu tuần này</h1>
                        <span className="text-xs font-semibold text-gray-400">Đơn vị: VNĐ</span>
                    </div>

                    <div className="h-[340px] flex items-end justify-between gap-3 pt-10 px-4 border-b border-gray-100">
                        {dataWeeklyRevenue.map((item) => {
                            const revValue = Number(item.Revenue) || 0;
                            const heightPercent = maxRevenue > 0 ? Math.max((revValue / maxRevenue) * 100, 8) : 8;
                            const isHighest = revValue > 0 && revValue === maxRevenue;

                            return (
                                <div key={item.DayIndex} className="flex-1 flex flex-col items-center h-full justify-end group">
                                    <span className="text-[11px] font-bold text-gray-500 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {revValue.toLocaleString("vi-VN")}đ
                                    </span>
                                    <div
                                        style={{ height: `${heightPercent}%` }}
                                        className={`w-full max-w-[42px] rounded-2xl transition-all shadow-xs ${isHighest
                                                ? "bg-gradient-to-t from-orange-500 to-amber-500"
                                                : "bg-gray-100 hover:bg-gray-200"
                                            }`}
                                    ></div>
                                    <span className="text-xs font-semibold text-gray-400 mt-3">{item.DayName}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Danh sách đơn hàng mới nhất (2 cột) */}
                <div className="lg:col-span-2 bg-white p-7 rounded-3xl border border-gray-100 shadow-xs space-y-5 flex flex-col justify-between min-h-[480px]">
                    <div className="flex items-center justify-between">
                        <h1 className="text-lg font-bold text-gray-900">Đơn hàng mới nhất</h1>
                        <button className="text-xs font-bold text-orange-500 hover:underline cursor-pointer">
                            Xem tất cả
                        </button>
                    </div>

                    <div className="space-y-3.5 flex-1 flex flex-col justify-around">
                        {dataOrderJustPlaced.map((item) => {
                            let statusClass = "bg-gray-100 text-gray-600";
                            if (item.statusOrder === "COMPLETED") statusClass = "bg-emerald-50 text-emerald-600";
                            else if (item.statusOrder === "PREPARING" || item.statusOrder === "READY_FOR_PICKUP") statusClass = "bg-amber-50 text-amber-600";
                            else if (item.statusOrder === "DELIVERING") statusClass = "bg-orange-50 text-orange-600";
                            else if (item.statusOrder === "PENDING" || item.statusOrder === "CONFIRMED") statusClass = "bg-blue-50 text-blue-600";
                            else if (item.statusOrder === "CANCELLED") statusClass = "bg-red-50 text-red-600";

                            return (
                                <div key={item.OrderId} className="p-4.5 rounded-2xl bg-gray-50/60 border border-gray-100 space-y-2.5 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                                            <span className="text-gray-900">#FG-{item.OrderId}</span>
                                            <span className="text-gray-300">•</span>
                                            <span className="text-gray-500 font-semibold">{item.customerName || item.accountName}</span>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${statusClass}`}>
                                            {item.statusOrder}
                                        </span>
                                    </div>

                                    <p className="text-xs text-gray-500 font-medium truncate">{item.itemNames}</p>

                                    <div className="flex items-center justify-between pt-1 text-xs">
                                        <span className="text-gray-400 text-[11px]">
                                            {item.timeCreateItems ? new Date(item.timeCreateItems).toLocaleDateString("vi-VN") : "N/A"}
                                        </span>
                                        <span className="font-extrabold text-gray-900">
                                            {Number(item.sumSubItems || 0).toLocaleString("vi-VN")}đ
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}