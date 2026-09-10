"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import type { AppDispatch } from "@/store/store";
import {
  fetchTotalOrder,
  getAvailableDeliveries,
  fetchUpdateShipperLocation,
} from "@/features/shipper/dashboard/dashboardSlice";
import LoadingSpinner from "@/components/spinner/loading";
import ErrorSpinner from "@/components/spinner/error";
import {
  MapPin,
  RefreshCw,
  CheckCircle2,
  Wallet,
  Clock,
  Star,
  Navigation,
  Phone,
  Store,
  User,
  ArrowRight,
  ShieldCheck,
  Edit3,
} from "lucide-react";
import { fetchAddressFromOSM } from "@/features/util/location";
import ShipperLocation from "@/components/location/shipper/shiperLocation";
export default function DashboardCPN() {
  const dispatch = useDispatch<AppDispatch>();
  const { infoDashboardOrderShipper, infoTotal, loading, err } = useSelector(
    (state: RootState) => state.dashboardShipper
  );
  const [longitude, setLongitude] = useState<string>("");
  const [latitude, setLatitude] = useState<string>("");
  const [radiusMeter, setRadiusMeter] = useState<string>("5000");
  const { user } = useSelector((state: RootState) => state.login);
  const [nameLocation, setNameLocation] = useState<string>("");
  const UserId = String(user?.UserId || ""); // lấy userId
  const apiKey = process.env.NEXT_PUBLIC_API_KEY as string;

  useEffect(() => {
    if (UserId) {
      dispatch(fetchTotalOrder(String(UserId)));
      dispatch(getAvailableDeliveries({ UserId, radiusMeter }));
    }
  }, [UserId, dispatch, radiusMeter]);

  const getPosition = () => {
    // get longitude and latitude
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setLongitude(longitude.toString());
          setLatitude(latitude.toString());
          if (UserId) {
            dispatch(
              fetchUpdateShipperLocation({
                UserId,
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
    const fetchAddress = async () => {
      console.log("--> Check dữ liệu đầu vào:", {
        latitude,
        longitude,
        apiKey,
      });

      if (!latitude || !longitude) {
        console.log("--> Thiếu tọa độ latitude/longitude");
        return;
      }

      try {
        const address = await ShipperLocation(latitude, longitude, apiKey);
        console.log("--> Địa chỉ nhận về từ server:", address);
        if (address) {
          setNameLocation(address);
        }
      } catch (err) {
        console.error("--> Lỗi khi gọi ShipperLocation:", err);
      }
    };

    fetchAddress();
  }, [latitude, longitude, apiKey]);

  useEffect(() => {
    getPosition();
  }, [UserId, dispatch, longitude, latitude]);

  if (loading) {
    return <LoadingSpinner message="Đang tải thông tin" />;
  }
  if (err) {
    return <ErrorSpinner message={err} />;
  }

  const totalOrdersCount =
    infoTotal && infoTotal[0]?.TotalOrderToday
      ? infoTotal[0].TotalOrderToday
      : 0;
  const estimatedRevenue =
    infoTotal && infoTotal[0]?.EstimatedRevenueToday
      ? Number(infoTotal[0].EstimatedRevenueToday).toLocaleString("vi-VN")
      : "0";

  return (
    <div className="min-h-screen bg-gray-50/60 p-4 md:p-8 space-y-8 select-none">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Bảng Điều Khiển
          </h1>
          <p className="text-sm text-gray-500 font-medium mt-1">
            Nhận các đơn hàng thức ăn nóng hổi xung quanh bạn và tối ưu lộ trình
            của bạn.
          </p>
        </div>
        {/* Trạng thái Trực Tuyến */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 border border-emerald-200/80 px-4 py-2 rounded-full text-xs font-bold shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Trực Tuyến
          </span>
        </div>
      </div>

      {/* 2. Banner Vị Trí Hiện Tại Của Bạn (GPS Status) */}
      <div className="bg-white rounded-3xl p-4 md:p-5 border border-orange-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-orange-50/50 via-white to-amber-50/30">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/20">
            <MapPin className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                Khu vực hoạt động hiện tại
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-200/60 px-2 py-0.5 rounded-full font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                GPS Trực tiếp
              </span>
            </div>

            {/* Tên Vị Trí & Tọa Độ */}
            <div className="mt-1">
              <h3 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight leading-snug">
                {nameLocation ? (
                  nameLocation
                ) : latitude && longitude ? (
                  <span className="text-gray-600">
                    Đang nhận diện địa chỉ khu vực...
                  </span>
                ) : (
                  <span className="text-gray-400 font-medium">
                    Đang định vị tọa độ GPS của bạn...
                  </span>
                )}
              </h3>

              {latitude && longitude && (
                <p className="text-xs font-medium text-gray-500 mt-0.5 flex items-center gap-2">
                  <span>
                    Tọa độ: {Number(latitude).toFixed(4)},{" "}
                    {Number(longitude).toFixed(4)}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span>Bán kính tìm đơn: {Number(radiusMeter) / 1000}km</span>
                </p>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={getPosition}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:border-orange-300 hover:bg-orange-50/50 text-gray-700 hover:text-orange-600 rounded-2xl text-xs font-bold transition shadow-xs cursor-pointer active:scale-95 shrink-0"
        >
          <RefreshCw className="w-4 h-4 text-orange-500" />
          <span>Cập nhật vị trí GPS</span>
        </button>
      </div>

      {/* 3. Thống Kê 4 Ô (Stats Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Đơn đã giao hôm nay */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs flex flex-col justify-between hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">
              Đơn đã giao hôm nay
            </span>
            <div className="w-9 h-9 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">
              <Edit3 className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl md:text-3xl font-black text-gray-900">
              {totalOrdersCount} đơn
            </div>
            <div className="text-xs font-semibold text-emerald-600 mt-1 flex items-center gap-1">
              <span>+2</span>
              <span className="text-gray-400 font-medium">
                Hoàn thành xuất sắc
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Doanh thu tạm tính */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs flex flex-col justify-between hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">
              Doanh thu tạm tính
            </span>
            <div className="w-9 h-9 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">
              <Wallet className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl md:text-3xl font-black text-gray-900">
              {estimatedRevenue}đ
            </div>
            <div className="text-xs font-semibold text-emerald-600 mt-1 flex items-center gap-1">
              <span>+15%</span>
              <span className="text-gray-400 font-medium">
                Gồm ship & thưởng
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Chờ lấy hàng */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs flex flex-col justify-between hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">
              Chờ lấy hàng
            </span>
            <div className="w-9 h-9 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">
              <Clock className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl md:text-3xl font-black text-gray-900">
              2 đơn
            </div>
            <div className="text-xs text-gray-400 font-medium mt-1">
              Xem danh sách đang giao
            </div>
          </div>
        </div>

        {/* Card 4: Đánh giá hiệu suất */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs flex flex-col justify-between hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">
              Đánh giá hiệu suất
            </span>
            <div className="w-9 h-9 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">
              <Star className="w-4.5 h-4.5 fill-orange-500 text-orange-500" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl md:text-3xl font-black text-gray-900">
              4.9 / 5
            </div>
            <div className="text-xs text-gray-400 font-medium mt-1">
              Dựa trên 120 bình chọn
            </div>
          </div>
        </div>
      </div>

      {/* 4. Danh Sách Đơn Hàng Có Sẵn Xung Quanh Bạn */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-extrabold text-gray-900 tracking-tight">
            Đơn hàng có sẵn xung quanh bạn (
            {infoDashboardOrderShipper?.length || 0})
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
            <span>Tự động cập nhật sau 10s</span>
            <RefreshCw className="w-3.5 h-3.5 text-orange-500 animate-spin" />
          </div>
        </div>

        {/* Grid Đơn Hàng */}
        {!infoDashboardOrderShipper ||
        infoDashboardOrderShipper.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-xs text-center flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">
              <MapPin className="w-7 h-7 text-orange-500" />
            </div>
            <h3 className="text-base font-bold text-gray-800">
              Không có đơn hàng nào xung quanh bạn
            </h3>
            <p className="text-xs text-gray-400 font-medium max-w-md">
              Hiện tại chưa có đơn hàng cần giao trong bán kính của bạn. Hãy bật
              GPS và giữ ứng dụng online để nhận đơn mới nhé!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {infoDashboardOrderShipper.map((item, index) => {
              const distanceKm = item.DistanceMeter
                ? (Number(item.DistanceMeter) / 1000).toFixed(1)
                : "0.0";
              const earnings = item.TotalPrice
                ? Number(item.TotalPrice).toLocaleString("vi-VN")
                : "0";

              return (
                <div
                  key={item.DeliveriesId || index}
                  className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs hover:shadow-md transition flex flex-col justify-between gap-6"
                >
                  {/* Header Đơn Hàng: Mã đơn & Giờ giao */}
                  <div className="flex items-center justify-between">
                    <span className="text-base font-extrabold text-orange-600">
                      FG-{item.OrderId}
                    </span>
                    <span className="bg-orange-50 text-orange-600 text-xs font-bold px-3 py-1 rounded-full border border-orange-100">
                      Đơn mới
                    </span>
                  </div>

                  {/* Lộ trình Điểm Đi & Điểm Đến */}
                  <div className="space-y-4">
                    {/* Điểm C: Nhà Hàng */}
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                        C
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 leading-snug">
                          {item.RestaurantName}
                        </h4>
                        <p className="text-xs text-gray-400 font-medium mt-0.5 leading-relaxed">
                          {item.RestaurantAddress}
                        </p>
                      </div>
                    </div>

                    {/* Điểm K: Khách Hàng */}
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                        K
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 leading-snug">
                          Khách hàng{" "}
                          {item.ReceiverPhone ? `(${item.ReceiverPhone})` : ""}
                        </h4>
                        <p className="text-xs text-gray-400 font-medium mt-0.5 leading-relaxed">
                          {item.DeliveryAddress}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer Đơn Hàng: Khoảng cách + Thu nhập + Nút Nhận Đơn */}
                  <div className="pt-4 border-t border-gray-100 space-y-4">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-gray-500 font-semibold">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>Khoảng cách: {distanceKm} km</span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-bold text-gray-400 block uppercase">
                          Thu nhập của bạn
                        </span>
                        <span className="text-base font-black text-emerald-600">
                          {earnings}đ
                        </span>
                      </div>
                    </div>

                    <button className="w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.99] text-white font-bold py-3.5 rounded-2xl transition shadow-md shadow-orange-500/20 cursor-pointer text-sm">
                      Nhận Đơn Hàng Này
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
