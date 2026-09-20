"use client";

import { useEffect, useState } from "react";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { getListCatagories, getListRestaurant } from "@/features/users/home/HomeSlice";
import LoadingSpinner from "@/components/spinner/loading";
import ErrorSpinner from "@/components/spinner/error";
import { Star, Clock, MapPin, ChevronDown, Flame, Utensils, Coffee, Pizza, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HomeCPN() {
  const dispatch = useDispatch<AppDispatch>();
  const { infoRestaurant, infoCatagories, loading, err } = useSelector(
    (state: RootState) => state.homeUser
  );
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<string>("105.8542");
  const [latitude, setLatitude] = useState<string>("21.0285");
  const router = useRouter();
  // lấy vị trí hiện tại của user
  const getPosition = ()=>{
    if(navigator.geolocation){
        navigator.geolocation.watchPosition(
            (position)=>{
                const { longitude, latitude } = position.coords;
                setLongitude(longitude.toString());
                setLatitude(latitude.toString());
            },
            (error)=>{
                console.error("Error getting location:", error.message);
            }
        )
    }
  }
  useEffect(()=>{
    getPosition()
  },[latitude,longitude])
  useEffect(() => {
    dispatch(getListRestaurant({lat : latitude, lng : longitude}));
    dispatch(getListCatagories());
  }, [dispatch , latitude , longitude]);
  if (loading) {
    return <LoadingSpinner message="Đang tải thông tin nhà hàng..." />;
  }

  if (err) {
    return <ErrorSpinner message={err} />;
  }

  // Placeholder images for fallback if ImageUrl is missing
  const defaultImages = [
    "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80", // Phở/Bún
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80", // Burger
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80", // Cơm tấm
    "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80", // Trà sữa
    "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80", // Bánh mì
    "https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=800&q=80", // Mỳ
  ];

  return (
    <div className="min-h-screen bg-gray-50/60 pb-16">
      {/* 1. HERO BANNER SECTION */}
      <section className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-stone-900 text-white overflow-hidden py-14 px-4 sm:px-8">
        {/* Background Overlay Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/60 to-transparent" />

        <div className="relative max-w-7xl mx-auto space-y-6">
          <div className="max-w-2xl space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
              Thèm gì là có, giao ngay cực nhanh!
            </h1>
            <p className="text-gray-300 text-base sm:text-lg font-medium">
              Hơn 1000+ món ngon chuẩn vị từ các nhà hàng nổi tiếng xung quanh bạn.
            </p>
          </div>

          {/* Category Quick Filter Pills */}
          <div className="flex flex-wrap gap-2.5 pt-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-sm cursor-pointer ${
                selectedCategory === null
                  ? "bg-orange-500 text-white shadow-orange-500/30 shadow-md"
                  : "bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10"
              }`}
            >
              <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
              <span>Bán chạy</span>
            </button>

            {infoCatagories.map((cat, idx) => {
              const isActive = selectedCategory === cat.CategoriesId;
              return (
                <button
                  key={cat.CategoriesId || idx}
                  onClick={() => setSelectedCategory(cat.CategoriesId)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-sm cursor-pointer ${
                    isActive
                      ? "bg-orange-500 text-white shadow-orange-500/30 shadow-md"
                      : "bg-white/90 hover:bg-white text-gray-800 backdrop-blur-md border border-white/20"
                  }`}
                >
                  <Utensils className="w-4 h-4 text-orange-500" />
                  <span>{cat.CategoriesName}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT AREA (Full Width, No Search Filter Sidebar) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 mt-10 space-y-6">
        {/* Section Header & Sort Dropdown */}
        <div className="flex items-center justify-between border-b border-gray-200/80 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Nhà hàng nổi bật gần đây
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Hiển thị {infoRestaurant.length} nhà hàng phục vụ nhanh nhất
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
            <span>Sắp xếp:</span>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-xl font-semibold text-gray-800 hover:border-orange-500 transition-colors shadow-xs cursor-pointer">
              <span>Gần nhất</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Restaurant Cards Grid (3 Columns on Desktop) */}
        {infoRestaurant.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs max-w-lg mx-auto space-y-3">
            <ShoppingBag className="w-12 h-12 text-orange-400 mx-auto" />
            <h3 className="text-lg font-bold text-gray-800">Chưa có nhà hàng nào</h3>
            <p className="text-sm text-gray-500">
              Vui lòng quay lại sau hoặc kiểm tra kết nối hệ thống.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {infoRestaurant.map((item, index) => {
              const fallbackImg = defaultImages[index % defaultImages.length];
              const displayImage = item.ImageUrl && item.ImageUrl.trim() !== "" ? item.ImageUrl : fallbackImg;
              // Mock ratings & delivery time for demonstration aesthetics
              const rating = (4.5 + (index % 5) * 0.1).toFixed(1);

              return (
                <div
                  key={item.RestaurantId || index}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
                  onClick={()=>{router.push(`/users/infoRestaurant/${item.RestaurantId}`)}}
                >
                  {/* Card Image Wrapper */}
                  <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                    <img
                      src={displayImage}
                      alt={item.RestaurantName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = fallbackImg;
                      }}
                    />
                    {/* Floating Rating Badge */}
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-gray-800 flex items-center gap-1 shadow-md">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{rating}</span>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg group-hover:text-orange-600 transition-colors line-clamp-1">
                        {item.RestaurantName}
                      </h3>

                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="line-clamp-1">{item.Addresses || "Chi nhánh Hoàn Kiếm, Hà Nội"}</span>
                      </div>
                    </div>

                    {/* Footer Info (Time & Min Order) */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
                      <div className="flex items-center gap-1 text-gray-700">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span>
                          {item.MinTime && item.MaxTime
                            ? `${item.MinTime}-${item.MaxTime} phút`
                            : "15-25 phút"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
