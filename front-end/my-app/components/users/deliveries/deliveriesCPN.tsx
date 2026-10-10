"use client"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import { getAddressUserPlaceOrder, getLocationShipperDeliveries, getStatusDeliveries } from "@/features/users/deliveries/deliveriesSlice"
import { useEffect, useState } from "react"
import LoadingSpinner from "@/components/spinner/loading";
import ErrorSpinner from "@/components/spinner/error";
import { GeocodeAddress } from "@/components/map/geocodingUser"
import dynamic from "next/dynamic";
import Link from "next/link";
const MapLeaflet = dynamic(
    () => import("@/components/map/mapLeaflet"),
    {
        ssr: false,
    }
);
import { Check, Phone, MessageSquare, Truck, Star, ArrowLeft } from "lucide-react";

export default function DeliveriesCPN({ OrderId }: { OrderId: string }) {
    const orderId = OrderId
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.login)
    const { dataShipperAndOrder, AddressUsersPlaceOrder, statusDeliveries, loading, err } = useSelector((state: RootState) => state.deliveries)
    const UserId = String(user?.UserId || "")
    const [userLocation, setUserLocation] = useState<{ latUser: number; lngUser: number } | null>(null);
    // get data detail info order 
    useEffect(() => {
        dispatch(getLocationShipperDeliveries({ UserId: UserId, OrderId: String(orderId) })) // chi tiết đơn hàng
        dispatch(getAddressUserPlaceOrder({ UserId: UserId, OrderId: String(orderId) })) // địa chỉ người đặt hàng
        dispatch(getStatusDeliveries({ UserId: UserId, OrderId: String(orderId) })) // trạng thái đơn hàng
    }, [UserId, orderId])
    // lấy lat lng của người đặt hàng
    useEffect(() => {
        if (AddressUsersPlaceOrder.length > 0 && AddressUsersPlaceOrder[0]?.AddressUsersPlaceOrder) {
            const rawAddress = AddressUsersPlaceOrder[0]?.AddressUsersPlaceOrder;
            const addressToSearch = rawAddress.toLowerCase().includes('việt nam') || rawAddress.toLowerCase().includes('vietnam')
                ? rawAddress
                : `${rawAddress}, Việt Nam`;
            GeocodeAddress(addressToSearch).then((location) => {
                console.log("location user", location);
                if (location) {
                    setUserLocation({ latUser: location.lat, lngUser: location.lng }); // location trả data về lat , lng
                } else {
                    console.warn("[Geocode] Không tìm thấy tọa độ. Kiểm tra lại địa chỉ trong DB:", rawAddress);
                }
            })
        }
    }, [AddressUsersPlaceOrder])
    const currentStatus = statusDeliveries[0]?.DeliveryStatus || "ARRIVED_AT_BUYER"; // trạng thái đơn hàng mặc định là đã giao hàng
    if (loading) {
        return <LoadingSpinner />
    }
    if (err) {
        return <ErrorSpinner message={err} />
    }
    return (
        <div className="min-h-screen bg-slate-50/60 p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Nút Quay lại trang chủ */}
                <div className="flex items-center justify-between">
                    <Link 
                        href="/users/home" 
                        className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white hover:bg-orange-50/80 border border-gray-200/80 text-gray-700 hover:text-orange-600 text-xs font-semibold shadow-xs hover:shadow-sm hover:border-orange-200 transition-all duration-200 group active:scale-[0.98]"
                    >
                        <ArrowLeft className="w-4 h-4 text-gray-500 group-hover:text-orange-500 transition-all duration-200 group-hover:-translate-x-0.5" />
                        <span>Quay lại trang chủ</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Cột bên trái: Bản đồ & Trạng thái đơn hàng */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Thẻ chứa bản đồ Leaflet */}
                    <div className="relative w-full h-[380px] lg:h-[440px] rounded-3xl overflow-hidden bg-white shadow-sm border border-gray-100">
                        <MapLeaflet
                            latShip={Number(userLocation?.latUser)}
                            lngShip={Number(userLocation?.lngUser)}
                            latRes={Number(dataShipperAndOrder[0]?.LatShip)}
                            lngRes={Number(dataShipperAndOrder[0]?.LngShip)}
                            zoom={15}
                            width="100%"
                            height="100%"
                        />

                        {/* Overlay thẻ trạng thái tài xế đè lên bản đồ */}
                        <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-md p-3 px-4 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-3 max-w-xs">
                            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                                <Truck className="w-5 h-5 text-orange-500" />
                            </div>
                            <div>
                                <p className="font-bold text-xs text-gray-900">Tài xế đang giao hàng</p>
                                <p className="text-[11px] text-gray-500 mt-0.5">
                                    {AddressUsersPlaceOrder[0]?.AddressUsersPlaceOrder
                                        ? `Đang ở ${AddressUsersPlaceOrder[0]?.AddressUsersPlaceOrder}`
                                        : "Đang trên đường di chuyển"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Thẻ Trạng thái đơn hàng */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-lg font-bold text-gray-900">Trạng thái đơn hàng</h2>
                            <span className="bg-orange-50 text-orange-500 font-semibold text-xs px-4 py-2 rounded-full border border-orange-100">
                                Giao dự kiến: 12:15 (15 phút nữa)
                            </span>
                        </div>

                        {/* Hàng Icon & Gạch nối */}
                        <div className="flex items-center px-2 relative">
                            {/* 1. ĐƠN ĐÃ NHẬN */}
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                                ['ACCEPTED', 'ARRIVED_AT_STORE', 'PICKED_UP', 'ARRIVED_AT_BUYER', 'DELIVERED'].includes(currentStatus)
                                    ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                                    : 'bg-slate-100 text-slate-400'
                            }`}>
                                <Check className="w-5 h-5 stroke-[3]" />
                            </div>

                            {/* Gạch nối 1 -> 2 */}
                            <div className={`flex-1 h-1 mx-2 rounded-full ${
                                ['ARRIVED_AT_STORE', 'PICKED_UP', 'ARRIVED_AT_BUYER', 'DELIVERED'].includes(currentStatus)
                                    ? 'bg-orange-500'
                                    : 'bg-gray-200'
                            }`} />

                            {/* 2. ĐANG CHUẨN BỊ */}
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                                ['ARRIVED_AT_STORE', 'PICKED_UP', 'ARRIVED_AT_BUYER', 'DELIVERED'].includes(currentStatus)
                                    ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                                    : 'bg-slate-100 text-slate-400'
                            }`}>
                                <Check className="w-5 h-5 stroke-[3]" />
                            </div>

                            {/* Gạch nối 2 -> 3 */}
                            <div className={`flex-1 h-1 mx-2 rounded-full ${
                                ['PICKED_UP', 'ARRIVED_AT_BUYER', 'DELIVERED'].includes(currentStatus)
                                    ? 'bg-orange-500'
                                    : 'bg-gray-200'
                            }`} />

                            {/* 3. ĐÃ LẤY HÀNG */}
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                                ['PICKED_UP', 'ARRIVED_AT_BUYER', 'DELIVERED'].includes(currentStatus)
                                    ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                                    : 'bg-slate-100 text-slate-400'
                            }`}>
                                <Check className="w-5 h-5 stroke-[3]" />
                            </div>

                            {/* Gạch nối 3 -> 4 */}
                            <div className={`flex-1 h-1 mx-2 rounded-full ${
                                ['ARRIVED_AT_BUYER', 'DELIVERED'].includes(currentStatus)
                                    ? 'bg-orange-500'
                                    : 'bg-gray-200'
                            }`} />

                            {/* 4. ĐANG GIAO HÀNG */}
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                                ['ARRIVED_AT_BUYER', 'DELIVERED'].includes(currentStatus)
                                    ? currentStatus === 'ARRIVED_AT_BUYER'
                                        ? 'bg-orange-500 text-white ring-4 ring-orange-100 shadow-md shadow-orange-200'
                                        : 'bg-orange-500 text-white shadow-md shadow-orange-200'
                                    : 'bg-slate-100 text-slate-400'
                            }`}>
                                <Truck className="w-5 h-5" />
                            </div>

                            {/* Gạch nối 4 -> 5 */}
                            <div className={`flex-1 h-1 mx-2 rounded-full ${
                                currentStatus === 'DELIVERED'
                                    ? 'bg-orange-500'
                                    : 'bg-gray-200'
                            }`} />

                            {/* 5. ĐÃ NHẬN HÀNG */}
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                                currentStatus === 'DELIVERED'
                                    ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                                    : 'bg-slate-100 text-slate-400'
                            }`}>
                                <Check className="w-5 h-5 stroke-[3]" />
                            </div>
                        </div>

                        {/* Hàng Chữ bên dưới */}
                        <div className="flex justify-between text-center mt-4">
                            <div className="w-20">
                                <p className="font-bold text-xs text-gray-900">Đơn đã nhận</p>
                                <p className="text-[11px] text-gray-400 mt-1">11:45 AM</p>
                            </div>

                            <div className="w-20">
                                <p className="font-bold text-xs text-gray-900">Đang chuẩn bị</p>
                                <p className="text-[11px] text-gray-400 mt-1">11:52 AM</p>
                            </div>

                            <div className="w-20">
                                <p className="font-bold text-xs text-gray-900">Đã lấy hàng</p>
                                <p className="text-[11px] text-gray-400 mt-1">12:00 PM</p>
                            </div>

                            <div className="w-24">
                                <p className={`font-bold text-xs ${currentStatus === 'ARRIVED_AT_BUYER' ? 'text-orange-500' : 'text-gray-900'}`}>
                                    Đang giao hàng
                                </p>
                                <p className={`text-[11px] mt-1 ${currentStatus === 'ARRIVED_AT_BUYER' ? 'text-orange-500 font-medium' : 'text-gray-400'}`}>
                                    Đang di chuyển
                                </p>
                            </div>

                            <div className="w-24">
                                <p className={`font-bold text-xs ${currentStatus === 'DELIVERED' ? 'text-gray-900' : 'text-gray-400'}`}>
                                    Đã nhận hàng
                                </p>
                                <p className="text-[11px] text-gray-400 mt-1">--:--</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cột bên phải: Tài xế của bạn & Chi tiết đơn hàng */}
                <div className="lg:col-span-5 space-y-6">
                    {dataShipperAndOrder.map((item, index) => {
                        const itemsSubtotal = Array.isArray(item.Items)
                            ? item.Items.reduce((acc, i) => acc + (i.UnitPrice * i.Quantity), 0)
                            : 0;

                        return (
                            <div key={index} className="space-y-6">
                                {/* Thẻ thông tin Tài xế */}
                                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                                    <h3 className="text-base font-bold text-gray-900 mb-4">Tài xế của bạn</h3>
                                    
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                                            <img 
                                                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" 
                                                alt="Avatar tài xế" 
                                                className="w-full h-full object-cover" 
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-gray-900 text-sm truncate">{item.NameShipper || "Nguyễn Văn Hùng"}</h4>
                                            <p className="text-xs text-gray-500 mt-1">SĐT: {item.NumberPhoneShipper}</p>
                                        </div>
                                    </div>

                                    {/* Nút bấm liên hệ tài xế */}
                                    <div className="flex items-center gap-3 mt-5">
                                        <a 
                                            href={`tel:${item.NumberPhoneShipper}`}
                                            className="flex-1 bg-gray-50 hover:bg-gray-100 border border-gray-200/80 text-gray-800 py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                                        >
                                            <Phone className="w-4 h-4 text-gray-700" />
                                            Gọi điện
                                        </a>
                                        <button 
                                            type="button"
                                            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-sm shadow-orange-200"
                                        >
                                            <MessageSquare className="w-4 h-4 text-white" />
                                            Nhắn tin
                                        </button>
                                    </div>
                                </div>

                                {/* Thẻ Chi tiết đơn hàng */}
                                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                                    <div className="mb-4">
                                        <h3 className="text-base font-bold text-gray-900">Chi tiết đơn hàng</h3>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Mã đơn: #FG-{item.CodeOrder} • Đặt lúc {item.TimeCreateOrder ? new Date(item.TimeCreateOrder).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "11:45"}
                                        </p>
                                    </div>

                                    <div className="border-t border-gray-100 my-4" />

                                    {/* Danh sách các món ăn trong đơn */}
                                    <div className="space-y-4">
                                        {Array.isArray(item.Items) && item.Items.map((i, ind) => (
                                            <div key={ind} className="flex items-center justify-between text-xs">
                                                <div className="space-y-0.5">
                                                    <p className="font-bold text-gray-900 text-sm">{i.FoodName}</p>
                                                    <p className="text-gray-400">Đơn giá: {i.UnitPrice.toLocaleString()}đ</p>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <span className="text-gray-500 font-semibold">x {i.Quantity}</span>
                                                    <span className="font-bold text-gray-900 text-sm">{(i.UnitPrice * i.Quantity).toLocaleString()}đ</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t border-gray-100 my-4" />

                                    {/* Bảng tính tổng số tiền */}
                                    <div className="space-y-2 text-xs">
                                        <div className="flex justify-between text-gray-500">
                                            <span>Tạm tính (Subtotal)</span>
                                            <span className="font-semibold text-gray-900">{itemsSubtotal.toLocaleString()}đ</span>
                                        </div>
                                        <div className="flex justify-between text-gray-500">
                                            <span>Phí giao hàng (Delivery)</span>
                                            <span className="font-semibold text-gray-900">15.000đ</span>
                                        </div>
                                        <div className="flex justify-between text-gray-500">
                                            <span>Giảm giá (Discount)</span>
                                            <span className="font-semibold text-emerald-500">-20.000đ</span>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-100 my-4" />

                                    {/* Tổng thanh toán */}
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-gray-900 text-sm">Tổng thanh toán</span>
                                        <span className="font-bold text-xl text-orange-500">{item.TotalPrice.toLocaleString()}đ</span>
                                    </div>
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