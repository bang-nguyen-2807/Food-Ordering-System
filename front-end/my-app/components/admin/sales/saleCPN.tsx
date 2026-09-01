"use client";

import LoadingSpinner from "@/components/spinner/loading";
import ErrorSpinner from "@/components/spinner/error";
import { fetchInfoSale, infoSaleCode ,fetchAddSale , fetchDeleteSale , postAddSale  } from "@/features/admin/sales/SalesSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect , useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, ChevronDown, Plus, Ticket, AlertCircle, Sparkles, Trash2 } from "lucide-react";

export default function SaleCPN() {
    const dispatch = useDispatch<AppDispatch>();
    const { dataSale, loading, err } = useSelector((state: RootState) => state.adminSale);
    const [isDiscountOpen, setIsDiscountOpen] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);

    const discountOptions = [
        { value: "PERCENTAGE", label: "Phần trăm (%)", badge: "%" },
        { value: "FIXED_AMOUNT", label: "Số tiền cố định (VNĐ)", badge: "₫" },
        { value: "FREESHIP", label: "Miễn phí vận chuyển", badge: "🚚" },
    ];

    const [formData, setFormData] = useState<postAddSale>({
        CodeSale: "",
        Description: "",
        DiscountType: "PERCENTAGE", // Mặc định PERCENTAGE hoặc FIXED_AMOUNT
        Amount: "",
        MinOrderAmount: "",
        MaxAmount: "",
        StartDate: new Date().toISOString().split('T')[0], // Kết quả ra dạng "2026-09-01",
        EndDate: "",
        UsageLimit: 0,
    });
    const selectedDiscount = discountOptions.find(opt => opt.value === formData.DiscountType) || discountOptions[0];
    useEffect(() => {
        dispatch(fetchInfoSale());
    }, [dispatch]);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData((prev : any) => ({
            ...prev,
            // Xử lý riêng nếu ô input có type="number" thì ép sang số
            [name]: type === "number" ? Number(value) : value,
        }));
    };

    // 3. Hàm xử lý gửi form tới RTK
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Dữ liệu gửi lên RTK:", formData);
        // Gọi action dispatch fetchAddSale
        const result = await dispatch(fetchAddSale(formData));
        if (fetchAddSale.fulfilled.match(result)) {
            alert("Thêm mã giảm giá thành công!");
            setFormData({
                CodeSale: "",
                Description: "",
                DiscountType: "PERCENTAGE",
                Amount: "",
                MinOrderAmount: "",
                MaxAmount: "",
                StartDate: new Date().toISOString().split('T')[0],
                EndDate: "",
                UsageLimit: 0,
            });
        } else {
            alert("Thêm thất bại: " + result.payload);
        }
    };
    // hàm xử lí xóa
    const handleDelete = async (id : number)=>{
        // cửa sổ xem người dùng cs chắc chắn xóa ko
        const isConfirm = window.confirm("Bạn có chắc muốn xóa mã giảm giá này không");
        if(!isConfirm)return ;
        const result = await dispatch(fetchDeleteSale(id)); // gọi hàm dispatch vs ID cần xóa
        // kiểm tra kết quả trả về từ RTK
        if(fetchDeleteSale.fulfilled.match(result)){
            alert("Xóa mã giảm giá thành công!")
        }else{
            alert("Xóa mã giảm giá thất bại: " + result.payload)
        }
    }

    if (loading) {
        return <LoadingSpinner message="Đang tải dữ liệu Code Sale..." />;
    }

    if (err) {
        return (
            <ErrorSpinner 
                message="Lỗi khi tải dữ liệu Code Sale" 
                onRetry={() => dispatch(fetchInfoSale())}
            />
        );
    }

    return (
        <div className="w-full min-h-screen bg-[#F8FAFC] p-4 md:p-8 text-slate-800 font-sans">
            {/* Header Section */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                    Quản lý mã giảm giá
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                    Cấu hình, theo dõi hiệu năng sử dụng của các chương trình khuyến mãi trên toàn quốc.
                </p>
            </div>

            {/* Section 1: Form Tạo chương trình khuyến mãi mới */}
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-xs mb-8">
                <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center justify-between">
                    <span>Tạo chương trình khuyến mãi mới</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    {/* Mã Code */}
                    <div className="md:col-span-3">
                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                            Mã Code
                        </label>
                        <input
                            type="text"
                            name="CodeSale"
                            value={formData.CodeSale}
                            onChange={handleChange}
                            placeholder="Ví dụ: FOODGOPRO30"
                            required
                            className="w-full bg-slate-50/70 border border-slate-200/90 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-medium"
                        />
                    </div>

                    {/* Loại giảm giá */}
                    <div className="md:col-span-3 relative">
                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                            Loại giảm giá
                        </label>
                        <button
                            type="button"
                            onClick={() => setIsDiscountOpen(!isDiscountOpen)}
                            className="w-full bg-slate-50/70 border border-slate-200/90 hover:border-orange-400 rounded-xl px-3.5 py-2 text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all flex items-center justify-between cursor-pointer"
                        >
                            <span className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-md bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center">
                                    {selectedDiscount.badge}
                                </span>
                                <span className="text-slate-800 font-medium">{selectedDiscount.label}</span>
                            </span>
                            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isDiscountOpen ? "rotate-180 text-orange-500" : ""}`} />
                        </button>

                        {/* Custom Floating Options Dropdown Menu */}
                        {isDiscountOpen && (
                            <>
                                <div className="fixed inset-0 z-20" onClick={() => setIsDiscountOpen(false)} />
                                <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
                                    {discountOptions.map((option) => {
                                        const isSelected = option.value === formData.DiscountType;
                                        return (
                                            <div
                                                key={option.value}
                                                onClick={() => {
                                                    setFormData(prev => ({ ...prev, DiscountType: option.value }));
                                                    setIsDiscountOpen(false);
                                                }}
                                                className={`px-3.5 py-2.5 text-sm font-medium flex items-center justify-between cursor-pointer transition-colors ${
                                                    isSelected
                                                        ? "bg-orange-50 text-orange-600 font-semibold"
                                                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                                                }`}
                                            >
                                                <span className="flex items-center gap-2.5">
                                                    <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center transition-colors ${
                                                        isSelected ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-500"
                                                    }`}>
                                                        {option.badge}
                                                    </span>
                                                    <span>{option.label}</span>
                                                </span>
                                                {isSelected && (
                                                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Giá trị giảm */}
                    <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                            Giá trị giảm
                        </label>
                        <input
                            type="text"
                            name="Amount"
                            value={formData.Amount}
                            onChange={handleChange}
                            placeholder="30%"
                            className="w-full bg-slate-50/70 border border-slate-200/90 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-medium"
                        />
                    </div>

                    {/* Thời gian áp dụng */}
                    <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                            Hạn sử dụng
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                name="EndDate"
                                value={formData.EndDate}
                                onChange={handleChange}
                                onClick={(e) => (e.target as any).showPicker?.()}
                                className="w-full bg-slate-50/70 border border-slate-200/90 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-medium pr-9 cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:left-0 [&::-webkit-calendar-picker-indicator]:top-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                            />
                            <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>

                    {/* Nút Tạo mã ngay */}
                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-[#FF5722] to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 text-sm tracking-wide"
                        >
                            <Sparkles className="w-4 h-4 text-amber-200" />
                            <span>Tạo mã ngay</span>
                        </button>
                    </div>
                </div>

                {/* Nút bật/tắt Cấu hình nâng cao */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="text-xs font-semibold text-slate-500 hover:text-orange-600 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showAdvanced ? "rotate-180 text-orange-500" : ""}`} />
                        <span>{showAdvanced ? "Ẩn cấu hình bổ sung" : "+ Tùy chọn nâng cao (Mô tả, Đơn tối thiểu, Lượt dùng...)"}</span>
                    </button>
                </div>

                {/* Hàng bổ sung thông tin chi tiết (Collapsible) */}
                {showAdvanced && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end mt-3 pt-3 border-t border-slate-100 animate-in fade-in slide-in-from-top-1 duration-200">
                        <div className="md:col-span-4">
                            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                                Mô tả chương trình
                            </label>
                            <input
                                type="text"
                                name="Description"
                                value={formData.Description}
                                onChange={handleChange}
                                placeholder="Giảm giá cho khách hàng mới"
                                className="w-full bg-slate-50/70 border border-slate-200/90 rounded-xl px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-medium"
                            />
                        </div>
                        <div className="md:col-span-3">
                            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                                Đơn tối thiểu (VNĐ)
                            </label>
                            <input
                                type="text"
                                name="MinOrderAmount"
                                value={formData.MinOrderAmount}
                                onChange={handleChange}
                                placeholder="50000"
                                className="w-full bg-slate-50/70 border border-slate-200/90 rounded-xl px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-medium"
                            />
                        </div>
                        <div className="md:col-span-3">
                            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                                Giảm tối đa (VNĐ)
                            </label>
                            <input
                                type="text"
                                name="MaxAmount"
                                value={formData.MaxAmount}
                                onChange={handleChange}
                                placeholder="100000"
                                className="w-full bg-slate-50/70 border border-slate-200/90 rounded-xl px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-medium"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                                Lượt dùng tối đa
                            </label>
                            <input
                                type="number"
                                name="UsageLimit"
                                value={formData.UsageLimit}
                                onChange={handleChange}
                                placeholder="1000"
                                className="w-full bg-slate-50/70 border border-slate-200/90 rounded-xl px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-medium"
                            />
                        </div>
                    </div>
                )}
            </form>

            {/* Section 2: Bảng danh sách mã khuyến mãi */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                {dataSale.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 space-y-2">
                        <Ticket className="w-12 h-12 mx-auto text-slate-300" />
                        <p className="text-base font-semibold text-slate-600">Chưa có mã khuyến mãi nào</p>
                        <p className="text-xs text-slate-400">Vui lòng tạo mã khuyến mãi mới ở biểu mẫu phía trên.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/60">
                                    <th className="py-4 px-6 min-w-[160px]">Mã khuyến mãi</th>
                                    <th className="py-4 px-6 min-w-[180px]">Mô tả chương trình</th>
                                    <th className="py-4 px-6 min-w-[150px]">Mức giảm giá</th>
                                    <th className="py-4 px-6 min-w-[140px]">Đơn tối thiểu</th>
                                    <th className="py-4 px-6 min-w-[140px]">Đã sử dụng</th>
                                    <th className="py-4 px-6 min-w-[130px]">Hạn sử dụng</th>
                                    <th className="py-4 px-6 min-w-[120px] text-right">Trạng thái</th>
                                    <th className="py-4 px-6 min-w-[100px] text-right">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {dataSale.map((item: infoSaleCode, index: number) => {
                                    const amountVal = Number(item.Amount);
                                    const formattedAmount = !isNaN(amountVal)
                                        ? (amountVal <= 100 ? `Giảm ${amountVal}%` : `Giảm ${amountVal.toLocaleString("vi-VN")}đ`)
                                        : item.Amount;

                                    const minVal = Number(item.MinOrderAmount);
                                    const formattedMin = !isNaN(minVal) && minVal > 0
                                        ? `${minVal.toLocaleString("vi-VN")}đ`
                                        : "0đ";

                                    const formattedDate = item.EndDate
                                        ? new Date(item.EndDate).toLocaleDateString("vi-VN")
                                        : "N/A";

                                    return (
                                        <tr
                                            key={index}
                                            className="hover:bg-slate-50/80 transition-colors"
                                        >
                                            {/* Mã khuyến mãi */}
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                <span className="font-bold text-[#FF5722] text-base tracking-wide">
                                                    {item.CodeSale}
                                                </span>
                                            </td>

                                            {/* Mô tả chương trình */}
                                            <td className="py-4 px-6">
                                                <span className="text-xs text-slate-600 font-medium leading-relaxed max-w-[200px] block">
                                                    {item.Description || "Mã ưu đãi chương trình khuyến mãi"}
                                                </span>
                                            </td>

                                            {/* Mức giảm giá */}
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                <span className="font-bold text-slate-900 text-sm">
                                                    {formattedAmount}
                                                </span>
                                            </td>

                                            {/* Đơn tối thiểu */}
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                <span className="text-slate-600 text-sm font-medium">
                                                    {formattedMin}
                                                </span>
                                            </td>

                                            {/* Đã sử dụng */}
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                <span className="text-slate-700 text-sm font-medium">
                                                    {item.UsageRatio || `${item.TotalUsed} / ${item.UsageLimitText}`}
                                                </span>
                                            </td>

                                            {/* Hạn sử dụng */}
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                <span className="text-slate-600 text-sm font-medium">
                                                    {formattedDate}
                                                </span>
                                            </td>

                                            {/* Trạng thái */}
                                            <td className="py-4 px-6 whitespace-nowrap text-right">
                                                {((item.IsActive as any) == 1 || (item.IsActive as any) === true) && (!item.EndDate || new Date(item.EndDate) >= new Date()) ? (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                                                        Đang chạy
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-200/60">
                                                        Hết hạn
                                                    </span>
                                                )}
                                            </td>

                                            {/* Nút Xóa */}
                                            <td className="py-4 px-6 whitespace-nowrap text-right">
                                                <button
                                                    onClick={() => handleDelete((item as any).AdminCodeId)}
                                                    className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                                    title="Xóa mã này"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}