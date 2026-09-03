"use client"
import { AppDispatch , RootState } from "@/store/store";
import { useDispatch , useSelector } from "react-redux";
import { fetchManagerOrder, fetchUpdateOrderStatus } from "@/features/restaurant/managerOrder/managerOrderSlice";
import { useEffect , useState } from "react";
import ErrorSpinner from "@/components/spinner/error";
import LoadingSpinner from "@/components/spinner/loading";
import { User, MapPin, Bell, Tag } from "lucide-react";

const ORDER_STATUS_TABS = [
  { label: "Tất cả", value: "" },
  { label: "Chờ xác nhận", value: "PENDING" },
  { label: "Đã nhận đơn", value: "CONFIRMED" },
  { label: "Đang chế biến", value: "PREPARING" },
  { label: "Chờ lấy hàng", value: "READY_FOR_PICKUP" },
  { label: "Đang giao", value: "DELIVERING" },
  { label: "Đã hoàn thành", value: "COMPLETED" },
  { label: "Đã hủy", value: "CANCELLED" },
];

export default function ManagerOrderCPN(){
    const dispatch = useDispatch<AppDispatch>();
    const {dataManagerOrder , loading , error} = useSelector((state : RootState) => state.restaurantManagerOrder);
    const {user} = useSelector((state : RootState)=> state.login);
    const UserId = String(user?.UserId || "");
    const [OrderStatus , setOrderStatus] = useState("");

    useEffect(()=>{
        if (UserId) {
            dispatch(fetchManagerOrder({UserId , OrderStatus}));
        }
    },[UserId , OrderStatus , dispatch]);

    if(loading){
        return <LoadingSpinner message="Đang tải danh sách đơn hàng..."/>
    }
    if(error){
        return <ErrorSpinner message={error}/>
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PENDING":
                return "bg-blue-50 text-blue-600 border-blue-100";
            case "CONFIRMED":
                return "bg-indigo-50 text-indigo-600 border-indigo-100";
            case "PREPARING":
                return "bg-amber-50 text-amber-600 border-amber-100";
            case "READY_FOR_PICKUP":
                return "bg-purple-50 text-purple-600 border-purple-100";
            case "DELIVERING":
                return "bg-sky-50 text-sky-600 border-sky-100";
            case "COMPLETED":
                return "bg-emerald-50 text-emerald-600 border-emerald-100";
            case "CANCELLED":
                return "bg-red-50 text-red-600 border-red-100";
            default:
                return "bg-gray-100 text-gray-600 border-gray-200";
        }
    };

    const getStatusLabel = (status: string) => {
        const found = ORDER_STATUS_TABS.find((t) => t.value === status);
        return found ? found.label : status;
    };

    const getNextStatusAction = (StatusOrder: string) => {
        switch (StatusOrder) {
            case "PENDING":
                return { NextStatus: "CONFIRMED", Label: "Nhận đơn" };
            case "CONFIRMED":
                return { NextStatus: "PREPARING", Label: "Chế biến món" };
            case "PREPARING":
                return { NextStatus: "READY_FOR_PICKUP", Label: "Món đã xong" };
            default:
                return null;
        }
    };

    const handleUpdateOrderStatus = async (OrderId: number, NextStatus: string) => {
        await dispatch(fetchUpdateOrderStatus({ OrderId, OrderStatus: NextStatus }));
        dispatch(fetchManagerOrder({ UserId, OrderStatus }));
    };

    return(
        <div className="p-6 space-y-8 animate-in fade-in duration-200 bg-gray-50/50 min-h-screen">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                        Quản lý đơn hàng
                    </h1>
                    <p className="text-sm text-gray-500 font-medium mt-1">
                        Xác nhận và chuẩn bị các món ăn nóng hổi cho thực khách.
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

            <div className="flex items-center gap-2.5 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-gray-200">
                {ORDER_STATUS_TABS.map((tab) => {
                    const isActive = OrderStatus === tab.value;
                    return (
                        <button
                            key={tab.value}
                            onClick={() => setOrderStatus(tab.value)}
                            className={`px-4 py-2 text-xs sm:text-sm font-extrabold rounded-full whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                                isActive
                                    ? "bg-orange-500 text-white shadow-sm shadow-orange-500/20"
                                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                            }`}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {dataManagerOrder.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs">
                    <p className="text-gray-400 font-semibold text-sm">Không có đơn hàng nào ở trạng thái này.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {dataManagerOrder.map((item, index) => {
                        return (
                            <div 
                                key={index} 
                                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5"
                            >
                                <div className="flex items-start justify-between border-b border-gray-100 pb-4">
                                    <div>
                                        <div className="flex items-center gap-2.5">
                                            <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">
                                                #FG-{item.OrderId}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${getStatusBadge(item.StatusOrder)}`}>
                                                {getStatusLabel(item.StatusOrder)}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-400 font-medium mt-1">
                                            Thời gian đặt: {item.TimeBuy ? new Date(item.TimeBuy).toLocaleString("vi-VN") : "N/A"}
                                        </p>
                                    </div>

                                    <button className="text-xs font-extrabold text-orange-500 hover:underline cursor-pointer">
                                        Chi tiết
                                    </button>
                                </div>

                                <div className="space-y-2 text-xs font-medium text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-gray-400 shrink-0" />
                                        <span className="font-bold text-gray-800">{item.CustomerName}</span>
                                        <span className="text-gray-400">(@{item.Username})</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                                        <span className="text-gray-600 leading-relaxed">{item.PlaceShip}</span>
                                    </div>
                                </div>

                                <div className="space-y-2 bg-gray-50/70 p-4 rounded-2xl border border-gray-100">
                                    <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider block">
                                        MÓN ĐÃ CHỌN
                                    </span>
                                    <p className="text-xs font-semibold text-gray-800 leading-relaxed">
                                        {item.OrderItemsDetail}
                                    </p>
                                    <div className="flex items-center justify-between pt-1 border-t border-gray-200/60 text-xs">
                                        <span className="text-gray-500 font-medium">Tổng tiền món ăn:</span>
                                        <span className="font-bold text-gray-900">
                                            {Number(item.TotalItemsPrice || 0).toLocaleString("vi-VN")}đ
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-orange-50/60 border border-orange-100 rounded-2xl p-3.5 flex items-center justify-between text-xs">
                                    <span className="font-bold text-orange-700 flex items-center gap-1.5">
                                        <Tag className="w-3.5 h-3.5 text-orange-500" />
                                        Mã giảm giá:
                                    </span>
                                    <span className="font-extrabold text-orange-600">
                                        {item.CodeSaleDiscount && Number(item.CodeSaleDiscount) > 0 
                                            ? `-${Number(item.CodeSaleDiscount).toLocaleString("vi-VN")}đ` 
                                            : "Không áp dụng"}
                                    </span>
                                </div>

                                <div className="border-t border-gray-100 pt-4 space-y-2 text-xs">
                                    <div className="flex items-center justify-between text-gray-500 font-medium">
                                        <span>Phí giao hàng:</span>
                                        <span className="font-bold text-gray-700">
                                            {Number(item.ShipFee || 0).toLocaleString("vi-VN")}đ
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between pt-1">
                                        <span className="text-sm font-bold text-gray-900">Tổng thanh toán</span>
                                        <span className="text-lg font-black text-orange-500">
                                            {Number(item.FinalOrderPrice || 0).toLocaleString("vi-VN")}đ
                                        </span>
                                    </div>
                                </div>

                                {(() => {
                                    const actionInfo = getNextStatusAction(item.StatusOrder);
                                    if (!actionInfo) {
                                        return (
                                            <div className="pt-2 text-center text-xs font-extrabold text-gray-500 bg-gray-100 py-3 rounded-2xl">
                                                {item.StatusOrder === "COMPLETED" && "✓ Đơn hàng đã hoàn thành"}
                                                {item.StatusOrder === "CANCELLED" && "✕ Đơn hàng đã bị hủy"}
                                                {item.StatusOrder === "READY_FOR_PICKUP" && "⏳ Đang chờ tài xế đến lấy món"}
                                                {item.StatusOrder === "DELIVERING" && "🛵 Tài xế đang giao hàng"}
                                            </div>
                                        );
                                    }
                                    return (
                                        <div className="flex items-center gap-3 pt-2">
                                            <button 
                                                onClick={() => handleUpdateOrderStatus(item.OrderId, "CANCELLED")}
                                                className="flex-1 py-3 px-4 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-2xl text-xs font-extrabold transition-all cursor-pointer"
                                            >
                                                Từ chối
                                            </button>
                                            <button 
                                                onClick={() => handleUpdateOrderStatus(item.OrderId, actionInfo.NextStatus)}
                                                className="flex-1 py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-2xl text-xs font-extrabold transition-all shadow-xs cursor-pointer"
                                            >
                                                {actionInfo.Label}
                                            </button>
                                        </div>
                                    );
                                })()}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}