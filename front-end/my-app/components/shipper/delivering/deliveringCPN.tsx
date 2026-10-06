'use client'
// viết modal cho cái trạng thái đơn 
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/store/store"
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { fetchUpdateShipperLocation } from "@/features/shipper/dashboard/dashboardSlice";// use update location shipper in database
import { Truck, MapPin, Navigation } from "lucide-react";
import { getDeliveriesOrderDetail, updateNextStatusOrder, getInfoRoute, getLocationRestaurant, getOrderStatus } from "@/features/shipper/delivering/deliveringSlice";
import LoadingSpinner from "@/components/spinner/loading";
import ErrorSpinner from "@/components/spinner/error";

const MapLeaflet = dynamic(
    () => import("@/components/map/mapLeaflet"),
    {
        ssr: false,
    }
);
// Tạo Map tên nút bấm theo từng nấc trạng thái
const STATUS_ACTION_MAP: Record<string, string> = {
    ACCEPTED: "Xác nhận: Đã tới quán",
    ARRIVED_AT_STORE: "Xác nhận: Đã lấy món ăn",
    PICKED_UP: "Xác nhận: Đã tới nhà khách",
    ARRIVED_AT_BUYER: "Xác nhận: Đã giao hàng thành công",
};
export default function DeliveringCPN({ OrderId }: { OrderId: string }) {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const orderId = OrderId;

    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const { user } = useSelector((state: RootState) => state.login);// get UserId in RTK
    const { DeliveriesOrderDetail, InfoRoute, LocationRestaurant, StatusOrder, loading, error } = useSelector((state: RootState) => state.delivering)
    const UserId = String(user?.UserId || "");
    // get detail data delivery order 
    useEffect(() => {
        dispatch(getDeliveriesOrderDetail({ UserId: UserId, OrderId: String(orderId) })) // chi tiết đơn hàng
        dispatch(getInfoRoute({ UserId: UserId, OrderId: String(orderId) })) // thông tin tuyến đường
        dispatch(getLocationRestaurant({ OrderId: String(orderId) })) // vị trí nhà hàng
        dispatch(getOrderStatus({ UserId: UserId, OrderId: String(orderId) })) // trạng thái đơn hàng
    }, [UserId, orderId])

    // Update status deliveries for shipper
    const handleNextStatus = async () => {
        await dispatch(updateNextStatusOrder({ UserId: UserId, OrderId: String(orderId) }));
        dispatch(getOrderStatus({ UserId, OrderId })); 
        dispatch(getDeliveriesOrderDetail({ UserId, OrderId })); // load lại đơn hàng sau khi update
        dispatch(getLocationRestaurant({ OrderId }));  
    }
    //  return to dashboard page when shipper complete order
    useEffect(() => {
        if (DeliveriesOrderDetail.length > 0 && DeliveriesOrderDetail[0].DeliveryStatus === 'DELIVERED') {
            if (typeof window !== "undefined") {
                localStorage.removeItem("activeOrderId");
            }
            const timer = setTimeout(() => {
                router.push('/shipper/dashboard');
            }, 3000); // 3 giây sau tự về dashboard
            return () => clearTimeout(timer);
        }
    }, [DeliveriesOrderDetail, router]);
    useEffect(() => { // lấy vị trí của shipper
        let watchId: number;
        if (navigator.geolocation) {
            watchId = navigator.geolocation.watchPosition(
                (position) => {
                    setLongitude(position.coords.longitude);
                    setLatitude(position.coords.latitude);
                },
                (error) => {
                    console.warn("Cảnh báo Geolocation:", error.message);
                },
                {
                    enableHighAccuracy: true, // Ưu tiên dùng GPS chính xác cao
                    timeout: 10000,
                    maximumAge: 5000, // Dùng dữ liệu cũ trong 5 giây để tiết kiệm pin
                }
            );
            if (UserId && latitude !== null && longitude !== null) {
                dispatch(
                    fetchUpdateShipperLocation({
                        UserId,
                        longitude: longitude.toString(),
                        latitude: latitude.toString(),
                    })
                );
            }
        } else {
            alert("Trình duyệt của bạn không hỗ trợ lấy vị trí");
        }

        return () => {
            if (watchId !== undefined) navigator.geolocation.clearWatch(watchId);
        };
    }, [UserId]);
    // get location restaurant 
    if (loading) {
        return <LoadingSpinner />
    }
    if (error) {
        return <ErrorSpinner message={error} />
    }
    console.log("StatusOrder hiện tại:", StatusOrder[0]);
console.log("LocationRestaurant hiện tại:", LocationRestaurant);
    return (
        <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
            {/* Header Trang Đơn Hàng */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                        Đơn Hàng Đang Giao
                    </h1>
                    <p className="text-sm text-gray-500 font-medium mt-1">
                        Tiến hành nhận thực phẩm nóng hổi từ nhà hàng và giao tới điểm đến an toàn.
                    </p>
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200 text-xs font-bold self-start md:self-auto">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                    1 Đơn Đang Thực Hiện
                </div>
            </div>

            {/* Main Grid Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Cột Bên Trái: Bản Đồ & Lộ Trình (lg:col-span-7) */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Bản đồ Lộ trình GPS */}
                    <div className="bg-white rounded-3xl p-3 border border-gray-100 shadow-xs relative overflow-hidden">
                        <div className="flex items-center justify-between mb-3 px-3 pt-1">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-orange-500" />
                                <span className="text-sm font-bold text-gray-800">Bản đồ lộ trình</span>
                            </div>
                            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                                GPS: {latitude !== null && longitude !== null ? `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` : "Đang định vị..."}
                            </span>
                        </div>
                        <div className="w-full h-[400px] md:h-[460px] rounded-2xl overflow-hidden border border-gray-100 relative">
                            {
                                latitude === null || longitude === null ? (
                                    <div className="flex items-center justify-center h-full bg-gray-50 text-gray-400 text-sm font-medium animate-pulse">
                                        🛰️ Đang xác định vị trí GPS của bạn...
                                    </div>
                                ) : (
                                    // Trường hợp 1: Trạng thái là ACCEPTED (Hướng tới Nhà Hàng)
                                    StatusOrder.length > 0 && StatusOrder[0].StatusOrder === 'ACCEPTED' ? (
                                        LocationRestaurant && LocationRestaurant.length > 0 ? (
                                            <MapLeaflet
                                                latShip={latitude}
                                                lngShip={longitude}
                                                latRes={LocationRestaurant[0].laRes}
                                                lngRes={LocationRestaurant[0].lngRes}
                                                zoom={15}
                                                width="100%"
                                                height="100%"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full bg-gray-50 text-gray-400 text-sm font-medium">
                                                Đang tải vị trí nhà hàng...
                                            </div>
                                        )
                                    ) :
                                        // Trường hợp 2: Trạng thái từ ARRIVED_AT_STORE trở đi (Hướng tới Khách Hàng)
                                        ['ARRIVED_AT_STORE', 'PICKED_UP', 'ARRIVED_AT_BUYER'].includes(StatusOrder[0]?.StatusOrder) ? (
                                            LocationRestaurant && LocationRestaurant.length > 0 ? (
                                                <MapLeaflet
                                                    latShip={latitude}
                                                    lngShip={longitude}
                                                    latRes={19.4397}
                                                    lngRes={111.7009}
                                                    zoom={15}
                                                    width="100%"
                                                    height="100%"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full bg-gray-50 text-gray-400 text-sm font-medium">
                                                    Đang tải vị trí điểm giao...
                                                </div>
                                            )
                                        ) : (
                                            // Trường hợp mặc định
                                            <div className="flex items-center justify-center h-full bg-gray-50 text-gray-400 text-sm font-medium">
                                                Đang tải dữ liệu lộ trình...
                                            </div>
                                        )
                                )
                            }
                        </div>
                    </div>

                    {/* Thông Tin Lộ Trình Chi Tiết */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">
                            Thông Tin Lộ Trình Chi Tiết
                        </h3>
                        {InfoRoute.length === 0 ? (
                            <div className="text-sm text-gray-400 font-medium py-4 text-center">
                                Chưa có thông tin lộ trình
                            </div>
                        ) : (
                            InfoRoute.map((item, index) => {
                                return (
                                    <div key={index} className="space-y-6 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-gray-100">
                                        {/* Điểm Lấy Hàng (Pickup) */}
                                        <div className="flex items-start gap-4 relative z-10">
                                            <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-extrabold text-sm flex items-center justify-center shrink-0 border-2 border-white shadow-xs">
                                                1
                                            </div>
                                            <div className="space-y-0.5">
                                                <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                                                    NƠI LẤY HÀNG (PICKUP)
                                                </span>
                                                <h4 className="text-base font-bold text-gray-900">
                                                    {item.RestaurantName}
                                                </h4>
                                                <p className="text-sm text-gray-500">
                                                    {item.RestaurantAddress}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Điểm Giao Hàng (Deliver) */}
                                        <div className="flex items-start gap-4 relative z-10">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-extrabold text-sm flex items-center justify-center shrink-0 border-2 border-white shadow-xs">
                                                2
                                            </div>
                                            <div className="space-y-0.5">
                                                <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                                                    NƠI GIAO HÀNG (DELIVER)
                                                </span>
                                                <h4 className="text-base font-bold text-gray-900">
                                                    {item.UserAddressName}
                                                </h4>
                                                <p className="text-sm text-gray-500">
                                                    {item.UserAddress}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Cột Bên Phải: Trạng Thái Đơn & Chi Tiết Khách (lg:col-span-5) */}
                <div className="lg:col-span-5 space-y-6">
                    {DeliveriesOrderDetail.length === 0 ? (
                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs text-center space-y-3">
                            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto">
                                <Truck className="w-6 h-6" />
                            </div>
                            <h3 className="text-base font-bold text-gray-900">Không có đơn hàng nào đang giao</h3>
                            <p className="text-xs text-gray-500 max-w-xs mx-auto">
                                Đơn hàng đã hoàn thành hoặc không tìm thấy. Vui lòng quay lại Bảng điều khiển để nhận đơn mới!
                            </p>
                            <Link
                                href="/shipper/dashboard"
                                className="inline-block mt-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-xs transition"
                            >
                                Về Bảng Điều Khiển
                            </Link>
                        </div>
                    ) : (
                        DeliveriesOrderDetail.map((item, index) => {
                            const buttonText = STATUS_ACTION_MAP[item.DeliveryStatus];
                            return (
                                <div key={index} className="space-y-6">
                                    {/* Card Trạng Thái Đơn Hàng */}
                                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-5">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-base font-bold text-gray-900">
                                                Trạng Thái Đơn #FG-{orderId}
                                            </h3>
                                            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full">
                                                {item.DeliveryStatus === 'ACCEPTED'
                                                    ? 'Đang Đến Quán'
                                                    : item.DeliveryStatus === 'ARRIVED_AT_STORE'
                                                        ? 'Đang Lấy Hàng'
                                                        : item.DeliveryStatus === 'PICKED_UP'
                                                            ? 'Đang Giao Hàng'
                                                            : item.DeliveryStatus === 'ARRIVED_AT_BUYER'
                                                                ? 'Đã Đến Nhà Khách'
                                                                : item.DeliveryStatus}
                                            </span>
                                        </div>

                                        {/* Step Progress Checklist */}
                                        <div className="space-y-2.5">
                                            <div className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-3 border transition-all ${['ARRIVED_AT_STORE', 'PICKED_UP', 'ARRIVED_AT_BUYER', 'DELIVERED'].includes(item.DeliveryStatus)
                                                    ? 'bg-orange-50/60 text-gray-900 border-orange-200'
                                                    : 'bg-gray-50/70 text-gray-400 border-gray-100'
                                                }`}>
                                                <span className={`w-2.5 h-2.5 rounded-full ${['ARRIVED_AT_STORE', 'PICKED_UP', 'ARRIVED_AT_BUYER', 'DELIVERED'].includes(item.DeliveryStatus)
                                                        ? 'bg-orange-500'
                                                        : 'bg-gray-300'
                                                    }`}></span>
                                                1. Đã nhận hàng từ nhà hàng
                                            </div>

                                            <div className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-3 border transition-all ${['PICKED_UP', 'ARRIVED_AT_BUYER', 'DELIVERED'].includes(item.DeliveryStatus)
                                                    ? 'bg-orange-50/60 text-gray-900 border-orange-200'
                                                    : 'bg-gray-50/70 text-gray-400 border-gray-100'
                                                }`}>
                                                <span className={`w-2.5 h-2.5 rounded-full ${['PICKED_UP', 'ARRIVED_AT_BUYER', 'DELIVERED'].includes(item.DeliveryStatus)
                                                        ? 'bg-orange-500'
                                                        : 'bg-gray-300'
                                                    }`}></span>
                                                2. Đang trên đường đi
                                            </div>

                                            <div className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-3 border transition-all ${['ARRIVED_AT_BUYER', 'DELIVERED'].includes(item.DeliveryStatus)
                                                    ? 'bg-orange-50/60 text-gray-900 border-orange-200'
                                                    : 'bg-gray-50/70 text-gray-400 border-gray-100'
                                                }`}>
                                                <span className={`w-2.5 h-2.5 rounded-full ${['ARRIVED_AT_BUYER', 'DELIVERED'].includes(item.DeliveryStatus)
                                                        ? 'bg-orange-500'
                                                        : 'bg-gray-300'
                                                    }`}></span>
                                                3. Đã giao hàng thành công
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <div>
                                            {buttonText ? (
                                                <button
                                                    onClick={handleNextStatus}
                                                    className="w-full py-3.5 px-4 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white rounded-2xl font-bold transition-all shadow-md shadow-orange-500/20 text-sm tracking-wide"
                                                >
                                                    {buttonText}
                                                </button>
                                            ) : (
                                                <div className="w-full py-3.5 px-4 bg-emerald-50 text-emerald-600 rounded-2xl font-bold text-center border border-emerald-200 text-sm">
                                                    🎉 Đơn hàng đã hoàn thành!
                                                </div>
                                            )}
                                        </div>

                                        {/* Support Actions */}
                                        <div className="grid grid-cols-2 gap-3 pt-1">
                                            <button className="py-2.5 px-3 rounded-2xl border border-red-200 text-red-500 font-bold text-xs hover:bg-red-50 transition-all text-center">
                                                Báo Sự Cố Giao Hàng
                                            </button>
                                            <button className="py-2.5 px-3 rounded-2xl border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-50 transition-all text-center">
                                                Gọi Tổng Đài
                                            </button>
                                        </div>
                                    </div>

                                    {/* Card Chi Tiết Khách Hàng */}
                                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-5">
                                        <h3 className="text-base font-bold text-gray-900">
                                            Chi Tiết Khách Hàng
                                        </h3>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="font-bold text-gray-900 text-base">
                                                    {item.CustomerName}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-0.5">
                                                    SĐT: {item.CustomerPhone}
                                                </div>
                                            </div>
                                            <a
                                                href={`tel:${item.CustomerPhone}`}
                                                className="px-3.5 py-1.5 rounded-full bg-red-50 text-red-500 border border-red-100 font-bold text-xs hover:bg-red-100 transition-all inline-block"
                                            >
                                                Gọi Khách Hàng
                                            </a>
                                        </div>

                                        <div className="border-t border-gray-100"></div>

                                        {/* Món ăn cần vận chuyển */}
                                        <div className="space-y-2">
                                            <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase block">
                                                MÓN ĂN CẦN VẬN CHUYỂN
                                            </span>
                                            <div className="text-sm font-semibold text-gray-800 whitespace-pre-line leading-relaxed bg-gray-50/60 p-3.5 rounded-2xl border border-gray-100">
                                                {item.ItemsSummary || "Chưa có món ăn"}
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-100"></div>

                                        {/* Tổng tiền cần thu khách */}
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-gray-900 text-sm">
                                                Tổng tiền cần thu khách
                                            </span>
                                            <span className="text-orange-600 font-extrabold text-lg">
                                                {Number(item.TotalMoneyToCollect || 0).toLocaleString('vi-VN')}đ
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}