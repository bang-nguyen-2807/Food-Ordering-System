import React from "react";
import Link from "next/link";
import {
  Utensils,
  LogIn,
  UserPlus,
  ArrowRight,
  ShieldCheck,
  Zap,
  ChefHat,
  Clock,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-orange-950 to-amber-950 p-8 md:p-12 text-white shadow-2xl shadow-orange-950/20">
        {/* Background Glow & Decorative Elements */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/30 backdrop-blur-md text-orange-300 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
            <span>Hệ Thống Đặt Đồ Ăn Thông Minh • FoodGo</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Chào mừng bạn đến với <br />
            <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
              FoodGo System
            </span>
          </h1>

          <p className="text-gray-300 text-base sm:text-lg font-normal leading-relaxed">
            Giải pháp toàn diện giúp khách hàng trải nghiệm thực đơn đa dạng và giúp nhà quản trị vận hành đơn hàng một cách nhanh chóng, hiệu quả nhất.
          </p>

          {/* Quick Badges */}
          <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium text-gray-300">
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Giao diện hiện đại</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Bảo mật tối ưu</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Xử lý thời gian thực</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Authentication Navigation Cards Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <Utensils className="w-6 h-6 text-orange-500" />
              Cổng Truy Cập Hệ Thống
            </h2>
            <p className="text-sm text-gray-500">
              Lựa chọn phương thức để bắt đầu trải nghiệm ứng dụng
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Login Card */}
          <div className="group relative bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xl shadow-orange-500/5 hover:shadow-2xl hover:shadow-orange-500/15 hover:border-orange-200 transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-bl-full group-hover:scale-110 transition-transform duration-300 pointer-events-none"></div>

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/25 group-hover:scale-105 transition-transform">
                  <LogIn className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 bg-orange-50 text-orange-600 text-xs font-bold rounded-full border border-orange-100">
                  Đã có tài khoản
                </span>
              </div>

              <h3 className="text-2xl font-extrabold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                Đăng Nhập
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Truy cập ngay vào tài khoản của bạn để quản lý đơn hàng, thực đơn và thực hiện các chức năng quản trị hệ thống.
              </p>

              <ul className="space-y-2.5 mb-8 text-xs sm:text-sm text-gray-600 font-medium">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4.5 h-4.5 text-orange-500 shrink-0" />
                  <span>Truy cập Dashboard quản lý tổng quan</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4.5 h-4.5 text-orange-500 shrink-0" />
                  <span>Theo dõi lịch sử đơn hàng & doanh thu</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4.5 h-4.5 text-orange-500 shrink-0" />
                  <span>Phân quyền chi tiết Admin & Nhân viên</span>
                </li>
              </ul>
            </div>

            <Link
              href="/authentication/login"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-base shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 flex items-center justify-center gap-2 transition-all group-hover:gap-3 cursor-pointer"
            >
              <span>Đăng Nhập Ngay</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Create Account Card */}
          <div className="group relative bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xl shadow-amber-500/5 hover:shadow-2xl hover:shadow-amber-500/15 hover:border-amber-200 transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-full group-hover:scale-110 transition-transform duration-300 pointer-events-none"></div>

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform">
                  <UserPlus className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-100">
                  Thành viên mới
                </span>
              </div>

              <h3 className="text-2xl font-extrabold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                Tạo Tài Khoản
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Tạo tài khoản mới hoàn toàn miễn phí chỉ trong 1 phút để bắt đầu sử dụng đầy đủ các tính năng của FoodGo.
              </p>

              <ul className="space-y-2.5 mb-8 text-xs sm:text-sm text-gray-600 font-medium">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4.5 h-4.5 text-amber-500 shrink-0" />
                  <span>Đăng ký nhanh chóng với vài bước đơn giản</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4.5 h-4.5 text-amber-500 shrink-0" />
                  <span>Trải nghiệm đầy đủ tính năng đặt món</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4.5 h-4.5 text-amber-500 shrink-0" />
                  <span>Hỗ trợ kết nối nhà hàng & khách hàng</span>
                </li>
              </ul>
            </div>

            <Link
              href="/authentication/createAccount"
              className="w-full py-4 px-6 rounded-2xl bg-white hover:bg-amber-50 text-amber-600 border-2 border-amber-500 hover:border-amber-600 font-bold text-base shadow-sm hover:shadow-md flex items-center justify-center gap-2 transition-all group-hover:gap-3 cursor-pointer"
            >
              <span>Tạo Tài Khoản Mới</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="pt-4 space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
          Tính Năng Nổi Bật
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-gray-900 text-base mb-1">Đặt Món Tốc Độ</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Tối ưu hóa thao tác đặt hàng chỉ trong vài thao tác chạm đơn giản.
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
              <ChefHat className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-gray-900 text-base mb-1">Thực Đơn Phong Phú</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Quản lý danh mục món ăn linh hoạt, hình ảnh chân thực hấp dẫn.
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-gray-900 text-base mb-1">An Toàn Dữ Liệu</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Mã hóa thông tin người dùng và phân quyền hệ thống bảo mật cao.
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-gray-900 text-base mb-1">Cập Nhật Realtime</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Đồng bộ trạng thái đơn hàng và thông báo tức thì cho người dùng.
            </p>
          </div>
        </div>
      </section>

      {/* Footer System Status Banner */}
      <section className="bg-gray-900 text-gray-400 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping shrink-0"></div>
          <span>Hệ thống FoodGo đang hoạt động ổn định (99.9% Uptime)</span>
        </div>
        <div className="flex items-center gap-6 font-medium">
          <span>Phiên bản v2.4.0</span>
          <span>•</span>
          <span>FoodGo Ordering System</span>
        </div>
      </section>
    </div>
  );
}
