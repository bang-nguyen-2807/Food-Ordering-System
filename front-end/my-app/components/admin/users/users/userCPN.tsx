"use client";

import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Mail, Phone, MapPin, Edit3, UserX, Trash2 } from "lucide-react";
import { infoUsers } from "@/features/admin/users/UserSlice";

interface UserCPNProps {
  searchTerm?: string;
  onEdit?: (user: infoUsers) => void;
  onDelete?: (user: infoUsers) => void;
}

export default function UserCPN({ searchTerm = "", onEdit, onDelete }: UserCPNProps) {
  const { dataUsers } = useSelector((state: RootState) => state.adminUserAndPartness);

  const userList = Array.isArray(dataUsers) ? dataUsers : [];

  const filteredUsers = userList.filter((user) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      user.FullName?.toLowerCase().includes(term) ||
      user.UserName?.toLowerCase().includes(term) ||
      user.Email?.toLowerCase().includes(term) ||
      user.NumberPhone?.includes(term) ||
      user.Addresses?.toLowerCase().includes(term) ||
      user.AddressesName?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
      {/* Header Bar */}
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Danh Sách Người Dùng</h2>
          <p className="text-xs text-gray-500">
            Hiển thị {filteredUsers.length} trên tổng số {userList.length} tài khoản người dùng
          </p>
        </div>
      </div>

      {/* Table Content */}
      {filteredUsers.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <UserX className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-gray-800">Không tìm thấy người dùng</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            {searchTerm ? `Không có kết quả nào khớp với từ khóa "${searchTerm}".` : "Hiện chưa có tài khoản người dùng nào trong hệ thống."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase font-bold tracking-wider border-b border-gray-100">
                <th className="py-4 px-6">ID & Khách hàng</th>
                <th className="py-4 px-6">Username</th>
                <th className="py-4 px-6">Liên hệ</th>
                <th className="py-4 px-6">Địa chỉ mặc định</th>
                <th className="py-4 px-6">Trạng thái</th>
                <th className="py-4 px-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredUsers.map((item) => (
                <tr key={item.UserId} className="hover:bg-orange-50/30 transition-colors group">
                  {/* Avatar & Name */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 text-white font-bold flex items-center justify-center shadow-xs">
                        {item.FullName ? item.FullName.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                          {item.FullName || "Chưa cập nhật"}
                        </div>
                        <div className="text-xs text-gray-400">ID: #{item.UserId}</div>
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

                  {/* Address */}
                  <td className="py-4 px-6 max-w-xs">
                    <div className="flex items-start gap-1.5 text-xs text-gray-700">
                      <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                      <div>
                        {item.AddressesName && (
                          <span className="font-semibold text-gray-900 block">
                            {item.AddressesName}
                          </span>
                        )}
                        <span className="text-gray-500 line-clamp-2">
                          {item.Addresses || "Chưa có địa chỉ"}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200/60 rounded-full text-xs font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Hoạt động
                    </span>
                  </td>

                  {/* Actions: Nút Chỉnh sửa & Nút Xóa */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit && onEdit(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 font-semibold text-xs rounded-xl border border-orange-200/60 transition-all cursor-pointer active:scale-95"
                        title="Chỉnh sửa thông tin người dùng"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Sửa</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete && onDelete(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-xs rounded-xl border border-red-200/60 transition-all cursor-pointer active:scale-95"
                        title="Xóa tài khoản người dùng"
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