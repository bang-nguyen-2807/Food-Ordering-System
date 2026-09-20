'use client'
import { AppDispatch, RootState } from "@/store/store"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { fetchInfoRestaurant, fetchListCategoriesRestaurant } from "@/features/users/infoRestaurant/infoRestaurantSlice"
import { addItemsToCart, deleteItemsFromCart, createOrderAndBill, getItemsToCart } from "@/features/users/cartUser/cartUserSlice"
import LoadingSpinner from "@/components/spinner/loading"
import ErrorSpinner from "@/components/spinner/error"
import { useRouter } from "next/navigation"
export default function InfoRestaurant({ restaurantId }: { restaurantId: string }) {
    const dispatch = useDispatch<AppDispatch>();
    const { dataRestaurant, dataCategories, loading, err } = useSelector((state: RootState) => state.infoRestaurant);
    const { items } = useSelector((state: RootState) => state.cartUser);
    const { user } = useSelector((state: RootState) => state.login);
    const UserId = user?.UserId.toString(); // lấy userId
    const [activeCategory, setActiveCategory] = useState<string>("all");
    const router = useRouter();
    useEffect(() => {
        dispatch(fetchInfoRestaurant({ RestaurantId: restaurantId }))
        dispatch(fetchListCategoriesRestaurant({ RestaurantId: restaurantId }))
        if (UserId) {
            dispatch(getItemsToCart({ RestaurantId: restaurantId, UserId: UserId }))
        }
    }, [restaurantId, UserId])
    // handle add items to cart
    const handleAddToCart = async (MenuItemId: string, Quantity: number) => {
        if (!UserId) {
            alert("vui lòng đăng nhập để thực hiện chức năng này!")
            return
        }
        try {
            await dispatch(addItemsToCart({
                RestaurantId: restaurantId,
                UserId: UserId,
                MenuItemId: MenuItemId,
                Quantity: Quantity
            })).unwrap()
            dispatch(getItemsToCart({ RestaurantId: restaurantId, UserId: UserId })) // làm mới lại danh sách trong giỏ hàng ngay lập tức
        } catch (err) {
            console.log(err)
        }
    }
    // handle delete items from cart
    const handleDeleteFromCart = async(MenuItemsId : string)=>{
        if(!UserId){
            alert("vui lòng đăng nhập để thực hiện chức năng này")
            return
        }
        try{
            await dispatch(deleteItemsFromCart({RestaurantId: restaurantId , UserId : UserId , MenuItemId : MenuItemsId})).unwrap() // .unwrap là để thay thế cho việc .fulfilled.match(result)
            dispatch(getItemsToCart({RestaurantId : restaurantId , UserId : UserId})) // làm mới lại danh sách trong giỏ hàng ngay lập tức
        }catch(err){
            console.log(err)
        }
    }
    
    if (loading) {
        return <LoadingSpinner message="Đang tải thông tin nhà hàng..." />
    }
    if (err) {
        return <ErrorSpinner message={err} />
    }

    // Tính tổng tiền tạm tính cho sidebar giỏ hàng
    const totalAmount = items.reduce((sum, item) => sum + (Number(item.TotalPrice) || 0), 0);
    const deliveryFee = items.length > 0 ? 15000 : 0;
    const grandTotal = totalAmount + deliveryFee;

    return (
        <div className="min-h-screen bg-[#f8f9fa] font-sans pb-16">
            
            {/* HERO HEADER NHÀ HÀNG (GIỐNG HỆT ẢNH MẪU) */}
            <div className="relative bg-gray-900 text-white min-h-[220px] flex items-end pb-8 px-6 sm:px-12 mb-8 bg-cover bg-center" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.85)), url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200')" }}>
                <div className="max-w-7xl mx-auto w-full space-y-3">
                    <button onClick={() => {router.push('/users/home')}} className="group inline-flex items-center gap-2 text-white hover:text-orange-400 font-bold text-sm sm:text-base tracking-wide transition-colors cursor-pointer drop-shadow-md py-1">
                        <span className="text-lg font-black transition-transform group-hover:-translate-x-1">‹</span>
                        <span className="underline-offset-4 group-hover:underline">Quay lại danh sách</span>
                    </button>
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight">{dataRestaurant[0]?.RestaurantName || "Chi tiết Nhà Hàng"}</h1>
                    <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-300 font-medium">
                        <span className="flex items-center gap-1 text-amber-400 font-bold">⭐ 4.8 <span className="text-gray-400 font-normal">(500+ đánh giá)</span></span>
                    </div>
                </div>
            </div>

            {/* CONTAINER CHÍNH */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* CỘT BÊN TRÁI: THỰC ĐƠN NHÀ HÀNG */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Danh mục món ăn dạng Pill Tab (GIỐNG HỆT ẢNH MẪU) */}
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                        <div className="flex-shrink-0">
                            <button
                                onClick={() => {
                                    setActiveCategory("all");
                                    dispatch(fetchInfoRestaurant({ RestaurantId: restaurantId }));
                                }}
                                className={`px-6 py-2.5 rounded-lg text-sm transition-all border active:scale-95 ${activeCategory === "all" ? "bg-[#ff5722] text-white font-bold border-[#ff5722] shadow-sm" : "bg-white text-gray-700 font-semibold border-gray-200 hover:bg-gray-50"}`}
                            >
                                Tất cả
                            </button>
                        </div>
                        {dataCategories.map((item) => (
                            <div key={item.CategoriesRestaurantId} className="flex-shrink-0">
                                <button
                                    onClick={() => {
                                        setActiveCategory(item.CategoriesRestaurantId.toString());
                                        dispatch(fetchInfoRestaurant({ RestaurantId: restaurantId, CategoriesRestaurantId: item.CategoriesRestaurantId.toString() }));
                                    }}
                                    className={`px-6 py-2.5 rounded-lg text-sm transition-all border active:scale-95 ${activeCategory === item.CategoriesRestaurantId.toString() ? "bg-[#ff5722] text-white font-bold border-[#ff5722] shadow-sm" : "bg-white text-gray-700 font-semibold border-gray-200 hover:bg-gray-50"}`}
                                >
                                    {item.CategoriesRestaurantName}
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Danh sách món ăn (GIỐNG HỆT ẢNH MẪU) */}
                    <div className="space-y-4">
                        {dataRestaurant.map((item) => {
                            const cartItem = items.find((cart) => cart.MenuItemId === item.MenuItemId);// Tìm món ăn này trong giỏ hàng (`items`) xem đã có chưa
                            const quantity = cartItem ? cartItem.Quantity : 0; // lấy số lượng hiện tại . ch có thì bằng 0
                            return (
                                <div key={item.MenuItemId} className="bg-white rounded-lg p-6 border border-gray-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-5 w-full sm:w-auto">
                                        <img src={item.ImageUrl} alt={item.NameMenuItems} className="w-28 h-28 sm:w-32 sm:h-32 rounded-lg object-cover flex-shrink-0 bg-gray-50 border border-gray-100" />
                                        <div className="space-y-1.5">
                                            <h3 className="text-lg font-bold text-gray-900">{item.NameMenuItems}</h3>
                                            <p className="text-xs text-gray-400 leading-relaxed max-w-md line-clamp-2">Bánh phở tươi ngon, nước dùng ninh xương bò hầm 24 tiếng chuẩn vị Hà Nội kèm thịt bò bắp gầu nam thái mỏng.</p>
                                            <p className="text-[#ff5722] font-bold text-lg pt-1">{Number(item.Price).toLocaleString('vi-VN')}đ</p>
                                        </div>
                                    </div>

                                    {/* bộ nút tăng giảm số lượng */}
                                    <div className="w-full sm:w-auto flex justify-end flex-shrink-0">
                                        {quantity === 0 ? (
                                            <button
                                                onClick={() => handleAddToCart(String(item.MenuItemId), 1)}
                                                className="w-11 h-11 rounded-full bg-[#ff5722] hover:bg-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-500/20 active:scale-95 transition-all"
                                                title="Thêm vào giỏ"
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                                            </button>
                                        ) : (
                                            <div className="flex items-center gap-3 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-200">
                                                <button
                                                    onClick={() => handleAddToCart(String(item.MenuItemId), -1)}
                                                    className="w-7 h-7 rounded-full bg-white text-[#ff5722] font-bold shadow-sm hover:bg-[#ff5722] hover:text-white flex items-center justify-center transition active:scale-95 text-sm"
                                                >
                                                    -
                                                </button>
                                                <span className="w-6 text-center font-bold text-[#ff5722] text-sm">{quantity}</span>
                                                <button
                                                    onClick={() => handleAddToCart(String(item.MenuItemId), 1)}
                                                    className="w-7 h-7 rounded-full bg-[#ff5722] text-white font-bold shadow-sm hover:bg-orange-600 flex items-center justify-center transition active:scale-95 text-sm"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* CỘT BÊN PHẢI: GIỎ HÀNG CỦA BẠN (SIDEBAR GIỐNG HỆT ẢNH MẪU 100%) */}
                <div className="lg:col-span-4 sticky top-20 self-start">
                    <div className="bg-white rounded-lg p-6 border border-gray-200/80 shadow-sm space-y-6">
                        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">Giỏ hàng của bạn</h2>

                        {/* Danh sách món trong giỏ */}
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                            {items.length === 0 ? (
                                <p className="text-center py-8 text-gray-400 text-sm font-medium">Giỏ hàng của bạn đang trống</p>
                            ) : (
                                items.map((item) => {
                                    console.log(item.MenuItemId + item.NameMenuItems)
                                    return (
                                        <div key={item.MenuItemId} className="flex items-center justify-between gap-3 text-sm">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-gray-900 truncate">{item.NameMenuItems}</p>
                                                <p className="text-xs text-gray-400 line-through">{Number(item.UnitPrice).toLocaleString('vi-VN')}đ</p>
                                            </div>
                                            <span className="font-semibold text-gray-700 px-2">x {item.Quantity}</span>
                                            <span className="font-bold text-gray-900">{Number(item.TotalPrice).toLocaleString('vi-VN')}đ</span>
                                            <button onClick={() => (handleDeleteFromCart(String(item.MenuItemId)))} className="w-6 h-6 rounded-full bg-[#ff5722] hover:bg-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-500/20 active:scale-95 transition-all" >xóa</button>
                                        </div>)
                                })
                            )}
                        </div>

                        {/* Phần tính tiền (Subtotal, Delivery fee, Total Amount) */}
                        {items.length > 0 && (
                            <div className="pt-5 border-t border-gray-100 space-y-3">
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Tạm tính (Subtotal):</span>
                                    <span className="font-bold text-gray-900">{totalAmount.toLocaleString('vi-VN')}đ</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Phí giao hàng (Delivery fee):</span>
                                    <span className="font-bold text-gray-900">{deliveryFee.toLocaleString('vi-VN')}đ</span>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                    <span className="font-bold text-gray-900 text-sm sm:text-base">Tổng tiền (Total Amount):</span>
                                    <span className="text-2xl font-extrabold text-[#ff5722]">{grandTotal.toLocaleString('vi-VN')}đ</span>
                                </div>
                                <button onClick={()=>{router.push(`/users/bill/${restaurantId}`)}} className="w-full mt-4 bg-[#ff5722] hover:bg-orange-600 text-white font-bold py-3.5 rounded-lg shadow-md shadow-orange-500/20 transition-all text-center text-sm tracking-wide active:scale-98">
                                    Đến trang thanh toán
                                </button>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}

