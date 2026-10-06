"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Truck } from "lucide-react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { RootState, store, AppDispatch } from "@/store/store";
import { fetchActiveDeliveryOrder } from "@/features/shipper/navbar/navbarSlice";

function DeliveringIndexContent() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.login);
  const { infoActiveOrder } = useSelector((state: RootState) => state.navbarShipper);
  const UserId = String(user?.UserId || "");

  useEffect(() => {
    if (UserId) {
      dispatch(fetchActiveDeliveryOrder(UserId));
    }
  }, [UserId, dispatch]);

  useEffect(() => {
    if (infoActiveOrder) {
      if (infoActiveOrder.length > 0 && infoActiveOrder[0]?.OrderId) {
        const activeOrderId = String(infoActiveOrder[0].OrderId);
        if (typeof window !== "undefined") {
          localStorage.setItem("activeOrderId", activeOrderId);
        }
        router.replace(`/shipper/delivering/${activeOrderId}`);
      } else {
        // Hết đơn -> Xóa localStorage để không tự động chuyển hướng lại đơn cũ
        if (typeof window !== "undefined") {
          localStorage.removeItem("activeOrderId");
        }
      }
    }
  }, [infoActiveOrder, router]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center select-none w-full">
      <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mb-4">
        <Truck className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold text-gray-800">Chưa có đơn hàng đang giao</h2>
      <p className="text-sm text-gray-500 mt-1 max-w-md">
        Bạn hiện chưa nhận đơn hàng nào. Hãy quay lại Bảng điều khiển để nhận đơn mới!
      </p>
      <Link
        href="/shipper/dashboard"
        className="mt-5 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-2xl shadow-md transition"
      >
        Về Bảng Điều Khiển
      </Link>
    </div>
  );
}

export default function DeliveringIndexPage() {
  return (
    <Provider store={store}>
      <DeliveringIndexContent />
    </Provider>
  );
}
