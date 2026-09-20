'use client'
import { createOrderAndBill, getItemsToCart, getAddressUser } from "@/features/users/cartUser/cartUserSlice"
import { AppDispatch, RootState } from "@/store/store"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import LoadingSpinner from "@/components/spinner/loading"
import ErrorSpinner from "@/components/spinner/error"
import { useRouter } from "next/navigation"

export default function Bill({ restaurantId }: { restaurantId: string }) {
    const router = useRouter();
    const { items , addresses , loading, err } = useSelector((state: RootState) => state.cartUser);
    const { user } = useSelector((state: RootState) => state.login);
    const UserId = user?.UserId.toString(); 
    const dispatch = useDispatch<AppDispatch>();

    const deliveryFee = items.length > 0 ? 15000 : 0;
    const [paymentMethod, setPaymentMethod] = useState<string>("CASH");
    const [codeSaleId, setCodeSaleId] = useState<string>("");
    const [deliveryAddress, setDeliveryAddress] = useState<string>("");
    
    // STATE LƯU DỮ LIỆU HÓA ĐƠN TRẢ VỀ TỪ API
    const [billData, setBillData] = useState<any>(null);

    useEffect(() => {
        if (UserId) {
            dispatch(getItemsToCart({ RestaurantId: restaurantId, UserId: UserId }))
            dispatch(getAddressUser({ UserId: UserId }))
        }
    }, [restaurantId, UserId])

    const handleCheckout = async () => {
        if (!UserId) {
            alert("Vui lòng đăng nhập!");
            return;
        }
        if (!deliveryAddress.trim()) {
            alert("Vui lòng nhập địa chỉ nhận hàng!");
            return;
        }
        try {
            // Gọi API tạo Đơn & Bill, truyền DeliveryAddress tự nhập
            const result: any = await dispatch(createOrderAndBill({ 
                RestaurantId: restaurantId, 
                UserId: UserId, 
                UserAddressId: null, 
                DeliveryAddress: deliveryAddress,
                PaymentMethod: paymentMethod, 
                CodeSaleId: codeSaleId === "" ? null : codeSaleId, 
                DeliveryFee: deliveryFee.toString()
            })).unwrap();

            console.log("Dữ liệu Bill trả về:", result);

            if (result && Array.isArray(result) && result.length > 0) {
                setBillData(result[0]); // Lưu thông tin hóa đơn vào state để hiển thị
            } else if (result) {
                setBillData(result);
            }
        } catch (err: any) {
            console.error("Lỗi đặt hàng:", err);
            alert(err || "Không thể tạo đơn hàng! Vui lòng kiểm tra lại địa chỉ nhận hàng.");
        }
    }

    if (loading) {
        return <LoadingSpinner message="Đang xử lý..." />
    }
    if (err) {
        return <ErrorSpinner message={err} />
    }

    // Parse danh sách món ăn từ chuỗi JSON ItemsList
    const itemsList = billData && billData.ItemsList 
        ? (typeof billData.ItemsList === 'string' ? JSON.parse(billData.ItemsList) : billData.ItemsList)
        : [];

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md my-6">
            {/* THANH ĐIỀU HƯỚNG QUAY LẠI TRÊN CÙNG */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
                <button 
                    onClick={() => router.push(`/users/infoRestaurant/${restaurantId}`)}
                    className="text-xs font-bold text-gray-600 hover:text-[#ff5722] flex items-center gap-1 transition cursor-pointer"
                >
                    ‹ Quay lại Nhà hàng
                </button>
                <button 
                    onClick={() => router.push('/users/home')}
                    className="text-xs font-bold text-gray-600 hover:text-[#ff5722] flex items-center gap-1 transition cursor-pointer"
                >
                    🏠 Trang chủ
                </button>
            </div>

            {!billData ? (
                /* GIAO DIỆN CHỌN VÀ ĐẶT HÀNG */
                <div className="space-y-4">
                    <h2 className="text-xl font-bold border-b pb-2">Xác nhận đặt hàng</h2>

                    <div>
                        <label className="block text-sm font-semibold mb-1">Địa chỉ nhận hàng (*):</label>
                        <select 
                            value={deliveryAddress} 
                            onChange={(e) => setDeliveryAddress(e.target.value)} 
                            className="w-full border p-2.5 rounded-lg focus:outline-orange-500 text-sm"
                        >
                            <option value="">Chọn địa chỉ giao hàng</option>
                            {addresses.map((address: any) => (
                                <option key={address.UserAddressId} value={address.Addresses}>
                                    {address.AddressName ? `${address.AddressName}: ${address.Addresses}` : address.Addresses}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1">Phương thức thanh toán:</label>
                        <select 
                            value={paymentMethod} 
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full border p-2.5 rounded-lg text-sm"
                        >
                            <option value="CASH">Thanh toán khi nhận hàng (COD)</option>
                            <option value="BANKING">Thanh toán Chuyển khoản (Banking)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1">Mã giảm giá:</label>
                        <input 
                            value={codeSaleId} 
                            onChange={(e) => setCodeSaleId(e.target.value)} 
                            placeholder="Nhập mã giảm giá (nếu có)"
                            className="w-full border p-2.5 rounded-lg text-sm"
                        />
                    </div>

                    <button 
                        onClick={handleCheckout} 
                        className="w-full bg-[#ff5722] hover:bg-orange-600 text-white font-bold py-3 rounded-lg shadow transition cursor-pointer text-sm"
                    >
                        XÁC NHẬN ĐẶT HÀNG
                    </button>
                </div>
            ) : (
                /* GIAO DIỆN HIỂN THỊ HÓA ĐƠN SAU KHU ĐẶT HÀNG THÀNH CÔNG */
                <div className="space-y-4">
                    <div className="text-center border-b pb-4">
                        <h2 className="text-2xl font-black text-green-600">ĐẶT HÀNG THÀNH CÔNG! 🎉</h2>
                        <p className="text-gray-500 text-sm">Hóa đơn điện tử của bạn</p>
                    </div>

                    <div className="space-y-1 text-sm bg-gray-50 p-4 rounded-lg">
                        <p><strong>Mã Hóa Đơn:</strong> {billData.BillCode}</p>
                        <p><strong>Mã Đơn Hàng:</strong> #{billData.OrderId}</p>
                        <p><strong>Trạng Thái Đơn:</strong> <span className="font-bold text-orange-500">{billData.OrderStatus}</span></p>
                        <p><strong>Hình Thức Thanh Toán:</strong> {billData.PaymentMethod}</p>
                        <p><strong>SĐT Nhận:</strong> {billData.ReceiverPhone}</p>
                        <p><strong>Địa Chỉ Giao:</strong> {billData.DeliveryAddress}</p>
                    </div>

                    {/* DANH SÁCH MÓN ĂN */}
                    <div className="border-t pt-3">
                        <h3 className="font-bold mb-2 text-sm">Danh sách món ăn:</h3>
                        <div className="space-y-2">
                            {itemsList.map((item: any, idx: number) => (
                                <div key={idx} className="flex justify-between text-sm border-b border-dashed pb-1">
                                    <span>{item.ItemName} x <strong>{item.Quantity}</strong></span>
                                    <span className="font-semibold">{Number(item.TotalPrice).toLocaleString('vi-VN')}đ</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* TỔNG TIỀN */}
                    <div className="border-t pt-3 space-y-1 text-sm font-medium">
                        <div className="flex justify-between text-gray-600">
                            <span>Tạm tính:</span>
                            <span>{Number(billData.SubTotal).toLocaleString('vi-VN')}đ</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Phí giao hàng:</span>
                            <span>{Number(billData.DeliveryFee).toLocaleString('vi-VN')}đ</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-[#ff5722] pt-2 border-t">
                            <span>Tổng thanh toán:</span>
                            <span>{Number(billData.TotalPrice).toLocaleString('vi-VN')}đ</span>
                        </div>
                    </div>

                    {/* CỤM NÚT ĐIỀU HƯỚNG VÀ IN BILL */}
                    <div className="space-y-2.5 pt-2">
                        <button 
                            onClick={() => window.print()}
                            className="w-full bg-gray-800 hover:bg-black text-white font-bold py-2.5 rounded-lg transition cursor-pointer text-sm"
                        >
                            🖨️ In Hóa Đơn
                        </button>
                        
                        <div className="grid grid-cols-2 gap-3 pt-1">
                            <button 
                                onClick={() => router.push(`/users/infoRestaurant/${restaurantId}`)}
                                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 rounded-lg text-sm transition cursor-pointer text-center"
                            >
                                🏪 Tiếp tục mua sắm
                            </button>
                            <button 
                                onClick={() => router.push('/users/home')}
                                className="w-full bg-orange-50 hover:bg-orange-100 text-[#ff5722] font-bold py-2.5 rounded-lg text-sm transition cursor-pointer text-center"
                            >
                                🏠 Về Trang Chủ
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}