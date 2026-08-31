"use client";

import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Store, UserCheck, MapPin, Shield, Edit3, Trash2, BadgeCheck } from "lucide-react";
import { infoRestaurant } from "@/features/admin/users/UserSlice";

interface RestaurantCPNProps {
  searchTerm?: string;
  onEdit?: (restaurant: infoRestaurant) => void;
  onDelete?: (restaurant: infoRestaurant) => void;
}

export default function RestaurantCPN({ searchTerm = "", onEdit, onDelete }: RestaurantCPNProps) {
  const { dataRestaurant } = useSelector((state: RootState) => state.adminUserAndPartness);

  const restaurantList = Array.isArray(dataRestaurant) ? dataRestaurant : [];

  const filteredRestaurants = restaurantList.filter((res) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      res.RestaurantName?.toLowerCase().includes(term) ||
      res.FullName?.toLowerCase().includes(term) ||
      res.Addresses?.toLowerCase().includes(term) ||
      res.RestaurantRole?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
      {/* Header Bar */}
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Danh Sách Nhà Hàng Đối Tác</h2>
          <p className="text-xs text-gray-500">
            Hiển thị {filteredRestaurants.length} trên tổng số {restaurantList.length} đối tác nhà hàng
          </p>
        </div>
      </div>

      {/* Table Content */}
      {filteredRestaurants.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <Store className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-gray-800">Không tìm thấy nhà hàng</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            {searchTerm ? `Không có kết quả nào khớp với từ khóa "${searchTerm}".` : "Hiện chưa có nhà hàng đối tác nào trong hệ thống."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase font-bold tracking-wider border-b border-gray-100">
                <th className="py-4 px-6">ID & Tên Nhà Hàng</th>
                <th className="py-4 px-6">Chủ Nhà Hàng</th>
                <th className="py-4 px-6">Địa Chỉ</th>
                <th className="py-4 px-6">Vai Trò / Phân Loại</th>
                <th className="py-4 px-6">Trạng Thái</th>
                <th className="py-4 px-6 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredRestaurants.map((items) => (
                <tr key={items.RestaurantId} className="hover:bg-orange-50/30 transition-colors group">
                  {/* Restaurant ID & Name */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 font-bold flex items-center justify-center shrink-0">
                        <Store className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                          {items.RestaurantName}
                        </div>
                        <div className="text-xs text-gray-400">ID: #{items.RestaurantId}</div>
                      </div>
                    </div>
                  </td>

                  {/* Owner Name */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1.5 text-gray-800 font-medium">
                      <UserCheck className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>{items.FullName || "Chưa cập nhật"}</span>
                    </div>
                  </td>

                  {/* Address */}
                  <td className="py-4 px-6 max-w-xs">
                    <div className="flex items-start gap-1.5 text-xs text-gray-600">
                      <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{items.Addresses || "Chưa cập nhật địa chỉ"}</span>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200/60 rounded-xl text-xs font-semibold">
                      <Shield className="w-3 h-3 text-amber-500" />
                      {items.RestaurantRole || "Đối tác kinh doanh"}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200/60 rounded-full text-xs font-bold">
                      <BadgeCheck className="w-3.5 h-3.5 text-emerald-500" />
                      Chính thức
                    </span>
                  </td>

                  {/* Actions: Nút Sửa & Nút Xóa */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit && onEdit(items)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 font-semibold text-xs rounded-xl border border-orange-200/60 transition-all cursor-pointer active:scale-95"
                        title="Chỉnh sửa thông tin nhà hàng"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Sửa</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete && onDelete(items)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-xs rounded-xl border border-red-200/60 transition-all cursor-pointer active:scale-95"
                        title="Xóa nhà hàng đối tác"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Xóa</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}