"use client";

import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Truck, Mail, Phone, Edit3, Trash2, BadgeCheck, Shield, UserX } from "lucide-react";
import { infoShipper } from "@/features/admin/users/UserSlice";

interface ShipperCPNProps {
  searchTerm?: string;
  onEdit?: (shipper: infoShipper) => void;
  onDelete?: (shipper: infoShipper) => void;
}

export default function ShipperCPN({ searchTerm = "", onEdit, onDelete }: ShipperCPNProps) {
  const { dataShipper } = useSelector((state: RootState) => state.adminUserAndPartness);

  const shipperList = Array.isArray(dataShipper) ? dataShipper : [];

  const filteredShippers = shipperList.filter((shipper) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      shipper.FullName?.toLowerCase().includes(term) ||
      shipper.UserName?.toLowerCase().includes(term) ||
      shipper.Email?.toLowerCase().includes(term) ||
      shipper.NumberPhone?.includes(term)
    );
  });

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
      {/* Header Bar */}
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Danh Sách Tài Xế Giao Hàng (Shipper)</h2>
          <p className="text-xs text-gray-500">
            Hiển thị {filteredShippers.length} trên tổng số {shipperList.length} tài xế trong hệ thống
          </p>
        </div>
      </div>

      {/* Table Content */}
      {filteredShippers.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <Truck className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-gray-800">Không tìm thấy tài xế</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            {searchTerm ? `Không có kết quả nào khớp với từ khóa "${searchTerm}".` : "Hiện chưa có tài xế giao hàng nào trong hệ thống."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase font-bold tracking-wider border-b border-gray-100">
                <th className="py-4 px-6">ID & Tài Xế</th>
                <th className="py-4 px-6">Username</th>
                <th className="py-4 px-6">Liên Hệ</th>
                <th className="py-4 px-6">Vai Trò</th>
                <th className="py-4 px-6">Trạng Thái</th>
                <th className="py-4 px-6 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredShippers.map((item) => (
                <tr key={item.ShipperId || item.UserId} className="hover:bg-orange-50/30 transition-colors group">
                  {/* Avatar & Name */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 font-bold flex items-center justify-center shrink-0 shadow-xs">
                        <Truck className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                          {item.FullName || "Chưa cập nhật"}
                        </div>
                        <div className="text-xs text-gray-400">
                          {item.ShipperId ? `Shipper ID: #${item.ShipperId}` : `User ID: #${item.UserId}`}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Username */}
                  <td className="py-4 px-6 font-semibold text-gray-700">
                    <span className="px-2.5 py-1 bg-gray-100 rounded-lg text-xs font-mono text-gray-600">
                      @{item.UserName}
                    </span>
                  </td>

                  {/* Contact */}
                  <td className="py-4 px-6 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{item.Email || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{item.NumberPhone || "N/A"}</span>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200/60 rounded-xl text-xs font-semibold">
                      <Shield className="w-3 h-3 text-amber-500" />
                      Tài xế giao hàng
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200/60 rounded-full text-xs font-bold">
                      <BadgeCheck className="w-3.5 h-3.5 text-emerald-500" />
                      Sẵn sàng nhận đơn
                    </span>
                  </td>

                  {/* Actions: Nút Chỉnh sửa & Nút Xóa */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit && onEdit(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 font-semibold text-xs rounded-xl border border-orange-200/60 transition-all cursor-pointer active:scale-95"
                        title="Chỉnh sửa thông tin tài xế"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Sửa</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete && onDelete(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-xs rounded-xl border border-red-200/60 transition-all cursor-pointer active:scale-95"
                        title="Xóa tài xế"
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