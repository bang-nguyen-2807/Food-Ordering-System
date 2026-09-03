"use client"
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchManagerMenu,
    fetchCategoriesRestaurant,
    fetchAddMenuItem,
    fetchAddCategoriesRestaurant,
    fetchUpdateMenuItem,
    fetchDeleteMenuItem,
    fetchDeleteCategoriesRestaurant,
    infoMenuItem
} from "@/features/restaurant/managerMenu/managerMenuSlice";
import { useEffect, useState } from "react";
import ErrorSpinner from "@/components/spinner/error";
import LoadingSpinner from "@/components/spinner/loading";
import {
    Plus,
    Pencil,
    Trash2,
    Bell,
    FolderPlus,
    X,
    Search,
    Utensils
} from "lucide-react";

export default function ManagerMenuCPN() {
    const dispatch = useDispatch<AppDispatch>();
    const { dataManagerMenu, categoriesList, loading, error } = useSelector(
        (state: RootState) => state.restaurantManagerMenu
    );
    const { user } = useSelector((state: RootState) => state.login);
    const UserId = String(user?.UserId || "");

    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");

    // Modal states
    const [isAddItemModalOpen, setIsAddItemModalOpen] = useState<boolean>(false);
    const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState<boolean>(false);
    const [isEditItemModalOpen, setIsEditItemModalOpen] = useState<boolean>(false);

    // Form state for Adding Menu Item
    const [itemForm, setItemForm] = useState({
        NameMenuItems: "",
        Description: "",
        Price: "",
        ImageUrl: "",
        is_available: true,
        CategoriesRestaurantId: ""
    });

    // Form state for Editing Menu Item
    const [editItemForm, setEditItemForm] = useState({
        MenuItemId: 0,
        NameMenuItems: "",
        Description: "",
        Price: "",
        ImageUrl: "",
        is_available: true
    });

    // Form state for Adding Category
    const [categoryForm, setCategoryForm] = useState({
        CategoriesRestaurantName: "",
        CategorieRestaurantsCode: "",
        Descriptions: "",
        ImageUrl: ""
    });

    // Load initial data
    useEffect(() => {
        if (UserId) {
            dispatch(fetchManagerMenu({ UserId, CategoriesRestaurantId: selectedCategory }));
            dispatch(fetchCategoriesRestaurant(UserId));
        }
    }, [UserId, selectedCategory, dispatch]);

    const handleRefreshData = () => {
        if (UserId) {
            dispatch(fetchManagerMenu({ UserId, CategoriesRestaurantId: selectedCategory }));
            dispatch(fetchCategoriesRestaurant(UserId));
        }
    };

    // Handle Toggle Availability Status directly on Table
    const handleToggleAvailability = async (item: infoMenuItem) => {
        await dispatch(
            fetchUpdateMenuItem({
                MenuItemId: item.MenuItemId,
                NameMenuItems: item.NameItems,
                Description: item.Description || "",
                Price: item.Amount,
                ImageUrl: item.ImageItems,
                is_available: !item.OpenOrClose
            })
        );
        handleRefreshData();
    };

    // Handle Submit Add Menu Item
    const handleAddMenuItemSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!itemForm.NameMenuItems || !itemForm.Price || !itemForm.CategoriesRestaurantId) {
            alert("Vui lòng điền đầy đủ tên món ăn, giá tiền và chọn danh mục!");
            return;
        }

        await dispatch(
            fetchAddMenuItem({
                UserId: Number(UserId),
                CategoriesRestaurantId: Number(itemForm.CategoriesRestaurantId),
                NameMenuItems: itemForm.NameMenuItems,
                Description: itemForm.Description,
                Price: Number(itemForm.Price),
                ImageUrl: itemForm.ImageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
                is_available: itemForm.is_available
            })
        );

        setIsAddItemModalOpen(false);
        setItemForm({
            NameMenuItems: "",
            Description: "",
            Price: "",
            ImageUrl: "",
            is_available: true,
            CategoriesRestaurantId: ""
        });
        handleRefreshData();
    };

    // Handle Open Edit Modal
    const handleOpenEditModal = (item: infoMenuItem) => {
        setEditItemForm({
            MenuItemId: item.MenuItemId,
            NameMenuItems: item.NameItems,
            Description: item.Description || "",
            Price: String(item.Amount),
            ImageUrl: item.ImageItems || "",
            is_available: item.OpenOrClose
        });
        setIsEditItemModalOpen(true);
    };

    // Handle Submit Edit Menu Item
    const handleEditMenuItemSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editItemForm.NameMenuItems || !editItemForm.Price) {
            alert("Vui lòng điền tên món ăn và giá tiền!");
            return;
        }

        await dispatch(
            fetchUpdateMenuItem({
                MenuItemId: editItemForm.MenuItemId,
                NameMenuItems: editItemForm.NameMenuItems,
                Description: editItemForm.Description,
                Price: Number(editItemForm.Price),
                ImageUrl: editItemForm.ImageUrl,
                is_available: editItemForm.is_available
            })
        );

        setIsEditItemModalOpen(false);
        handleRefreshData();
    };

    // Handle Submit Add Category
    const handleAddCategorySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!categoryForm.CategoriesRestaurantName || !categoryForm.CategorieRestaurantsCode) {
            alert("Vui lòng nhập tên danh mục và mã danh mục!");
            return;
        }

        await dispatch(
            fetchAddCategoriesRestaurant({
                UserId: Number(UserId),
                CategoriesRestaurantName: categoryForm.CategoriesRestaurantName,
                CategorieRestaurantsCode: categoryForm.CategorieRestaurantsCode,
                Descriptions: categoryForm.Descriptions,
                ImageUrl: categoryForm.ImageUrl
            })
        );

        setIsAddCategoryModalOpen(false);
        setCategoryForm({
            CategoriesRestaurantName: "",
            CategorieRestaurantsCode: "",
            Descriptions: "",
            ImageUrl: ""
        });
        handleRefreshData();
    };

    // Handle Delete Item
    const handleDeleteItem = async (menuItemId: number, nameItems: string) => {
        if (confirm(`Bạn có chắc chắn muốn xóa món "${nameItems}" khỏi thực đơn không?`)) {
            await dispatch(fetchDeleteMenuItem(menuItemId));
            handleRefreshData();
        }
    };

    // Handle Delete Category
    const handleDeleteCategory = async (categoryId: number, cateName: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm(`Bạn có chắc chắn muốn xóa danh mục "${cateName}"? Các món ăn trong danh mục này cũng sẽ bị xóa!`)) {
            await dispatch(fetchDeleteCategoriesRestaurant(categoryId));
            if (selectedCategory === String(categoryId)) {
                setSelectedCategory("");
            }
            handleRefreshData();
        }
    };

    // Filter items by search term
    const filteredMenuItems = dataManagerMenu.filter((item) =>
        item.NameItems.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate category item counts
    const getCategoryCount = (cateName: string) => {
        if (!cateName) return dataManagerMenu.length;
        return dataManagerMenu.filter((item) => item.CateName === cateName).length;
    };

    if (loading && dataManagerMenu.length === 0) {
        return <LoadingSpinner message="Đang tải thực đơn nhà hàng..." />;
    }

    if (error && dataManagerMenu.length === 0) {
        return <ErrorSpinner message={error} />;
    }

    return (
        <div className="p-6 space-y-6 bg-slate-50/50 min-h-screen font-sans">
            {/* Top Bar Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                        Quản lý thực đơn
                    </h1>
                    <p className="text-sm text-gray-500 font-normal mt-1">
                        Cập nhật giá bán, trạng thái hiển thị của món ăn trong thực đơn của bạn.
                    </p>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-auto">
                    {/* Status Badge */}
                    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200/60 rounded-full text-xs font-semibold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Đang mở cửa
                    </span>

                    {/* Bell Notification */}
                    <button className="w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 transition shadow-sm">
                        <Bell className="w-4 h-4" />
                    </button>

                    {/* Add Item Button */}
                    <button
                        onClick={() => setIsAddItemModalOpen(true)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF5722] hover:bg-[#E64A19] text-white rounded-xl text-sm font-semibold transition shadow-sm"
                    >
                        <Plus className="w-4 h-4 stroke-[3]" />
                        Thêm món mới
                    </button>
                </div>
            </div>

            {/* Search Input Bar */}
            <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-2xl border border-gray-100 shadow-sm">
                <div className="relative w-full max-w-xs">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm tên món ăn..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF5722] transition"
                    />
                </div>
                <div className="text-xs text-gray-400 font-medium">
                    Tổng số: <span className="font-bold text-gray-700">{filteredMenuItems.length} món</span>
                </div>
            </div>

            {/* Main Content Layout: Left Sidebar Categories + Right Table */}
            <div className="flex flex-col lg:flex-row gap-6 items-start">
                {/* Left Sidebar Panel: Danh mục */}
                <div className="w-full lg:w-72 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4 flex-shrink-0">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                        <h2 className="text-base font-bold text-gray-900">Danh mục</h2>
                        <button
                            onClick={() => setIsAddCategoryModalOpen(true)}
                            className="p-1.5 text-gray-400 hover:text-[#FF5722] hover:bg-orange-50 rounded-lg transition"
                            title="Thêm danh mục mới"
                        >
                            <FolderPlus className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="space-y-1">
                        {/* Tất cả món */}
                        <button
                            onClick={() => setSelectedCategory("")}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition ${
                                selectedCategory === ""
                                    ? "bg-[#FFF2EE] text-[#FF5722] font-bold"
                                    : "text-gray-600 font-medium hover:bg-gray-50"
                            }`}
                        >
                            <span>Tất cả món</span>
                            <span
                                className={`text-xs px-2 py-0.5 rounded-full ${
                                    selectedCategory === ""
                                        ? "text-[#FF5722] font-semibold"
                                        : "text-gray-400 font-normal"
                                }`}
                            >
                                ({dataManagerMenu.length})
                            </span>
                        </button>

                        {/* Dynamic Categories List */}
                        {categoriesList.map((cat) => {
                            const isSelected = selectedCategory === String(cat.CategoriesRestaurantId);
                            const count = getCategoryCount(cat.CategoriesRestaurantName);
                            return (
                                <div
                                    key={cat.CategoriesRestaurantId}
                                    onClick={() => setSelectedCategory(String(cat.CategoriesRestaurantId))}
                                    className={`group flex items-center justify-between px-4 py-3 rounded-xl text-sm cursor-pointer transition ${
                                        isSelected
                                            ? "bg-[#FFF2EE] text-[#FF5722] font-bold"
                                            : "text-gray-600 font-medium hover:bg-gray-50"
                                    }`}
                                >
                                    <span className="truncate pr-2">{cat.CategoriesRestaurantName}</span>
                                    <div className="flex items-center gap-1.5 flex-shrink-0">
                                        <span
                                            className={`text-xs ${
                                                isSelected ? "text-[#FF5722]" : "text-gray-400"
                                            }`}
                                        >
                                            ({count})
                                        </span>
                                        <button
                                            onClick={(e) =>
                                                handleDeleteCategory(cat.CategoriesRestaurantId, cat.CategoriesRestaurantName, e)
                                            }
                                            className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 transition"
                                            title="Xóa danh mục"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Main Table */}
                <div className="flex-1 w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <th className="py-4 px-6">Hình ảnh & Tên món</th>
                                    <th className="py-4 px-4">Danh mục</th>
                                    <th className="py-4 px-4">Đơn giá</th>
                                    <th className="py-4 px-4">Mở bán</th>
                                    <th className="py-4 px-6 text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredMenuItems.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-16 text-center text-gray-400">
                                            <Utensils className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                                            <p className="text-sm font-medium text-gray-600">Không tìm thấy món ăn nào</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Hãy nhấn nút "+ Thêm món mới" để cập nhật thực đơn.
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredMenuItems.map((item, idx) => (
                                        <tr key={item.MenuItemId || idx} className="hover:bg-gray-50/60 transition group">
                                            {/* Column 1: Image & Title */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-4">
                                                    <img
                                                        src={
                                                            item.ImageItems ||
                                                            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
                                                        }
                                                        alt={item.NameItems}
                                                        className="w-14 h-14 rounded-2xl object-cover flex-shrink-0 border border-gray-100 shadow-sm"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src =
                                                                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";
                                                        }}
                                                    />
                                                    <div className="space-y-0.5 max-w-xs">
                                                        <h4 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">
                                                            {item.NameItems}
                                                        </h4>
                                                        <p className="text-xs text-gray-400 line-clamp-1 font-normal">
                                                            {item.Description || "Món ăn ngon đậm đà hương vị..."}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Column 2: Category */}
                                            <td className="py-4 px-4 text-sm text-gray-600 font-medium">
                                                {item.CateName || "Chưa phân loại"}
                                            </td>

                                            {/* Column 3: Price */}
                                            <td className="py-4 px-4 text-sm font-extrabold text-[#FF5722]">
                                                {Number(item.Amount || 0).toLocaleString("vi-VN")}đ
                                            </td>

                                            {/* Column 4: Toggle Status */}
                                            <td className="py-4 px-4">
                                                <button
                                                    onClick={() => handleToggleAvailability(item)}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                                                        item.OpenOrClose ? "bg-[#FF5722]" : "bg-gray-200"
                                                    }`}
                                                >
                                                    <span
                                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                            item.OpenOrClose ? "translate-x-6" : "translate-x-1"
                                                        }`}
                                                    />
                                                </button>
                                            </td>

                                            {/* Column 5: Action Buttons */}
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {/* Edit Button */}
                                                    <button
                                                        onClick={() => handleOpenEditModal(item)}
                                                        className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition"
                                                        title="Sửa thông tin món"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    {/* Delete Button */}
                                                    <button
                                                        onClick={() => handleDeleteItem(item.MenuItemId, item.NameItems)}
                                                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                                                        title="Xóa món ăn"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal 1: Thêm món ăn mới */}
            {isAddItemModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Plus className="w-5 h-5 text-[#FF5722]" />
                                Thêm món ăn mới
                            </h2>
                            <button
                                onClick={() => setIsAddItemModalOpen(false)}
                                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleAddMenuItemSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Danh mục loại món <span className="text-red-500">*</span>
                                </label>
                                <select
                                    required
                                    value={itemForm.CategoriesRestaurantId}
                                    onChange={(e) => setItemForm({ ...itemForm, CategoriesRestaurantId: e.target.value })}
                                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF5722]"
                                >
                                    <option value="">-- Chọn danh mục món ăn --</option>
                                    {categoriesList.map((cat) => (
                                        <option key={cat.CategoriesRestaurantId} value={cat.CategoriesRestaurantId}>
                                            {cat.CategoriesRestaurantName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Tên món ăn <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="VD: Phở Đặc Biệt"
                                    value={itemForm.NameMenuItems}
                                    onChange={(e) => setItemForm({ ...itemForm, NameMenuItems: e.target.value })}
                                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF5722]"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Giá tiền (VNĐ) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        placeholder="VD: 65000"
                                        value={itemForm.Price}
                                        onChange={(e) => setItemForm({ ...itemForm, Price: e.target.value })}
                                        className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF5722]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Trạng thái mở bán</label>
                                    <select
                                        value={itemForm.is_available ? "true" : "false"}
                                        onChange={(e) => setItemForm({ ...itemForm, is_available: e.target.value === "true" })}
                                        className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF5722]"
                                    >
                                        <option value="true">Mở bán</option>
                                        <option value="false">Tạm ngưng</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">URL Hình ảnh</label>
                                <input
                                    type="text"
                                    placeholder="https://example.com/photo.jpg"
                                    value={itemForm.ImageUrl}
                                    onChange={(e) => setItemForm({ ...itemForm, ImageUrl: e.target.value })}
                                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF5722]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Mô tả món ăn</label>
                                <textarea
                                    rows={3}
                                    placeholder="Mô tả ngắn gọn về thành phần món ăn..."
                                    value={itemForm.Description}
                                    onChange={(e) => setItemForm({ ...itemForm, Description: e.target.value })}
                                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF5722] resize-none"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsAddItemModalOpen(false)}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200 transition"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-[#FF5722] hover:bg-[#E64A19] text-white rounded-xl text-xs font-semibold transition shadow-sm"
                                >
                                    Thêm mới
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal 2: Sửa thông tin món ăn */}
            {isEditItemModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Pencil className="w-5 h-5 text-[#FF5722]" />
                                Sửa thông tin món ăn
                            </h2>
                            <button
                                onClick={() => setIsEditItemModalOpen(false)}
                                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleEditMenuItemSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Tên món ăn <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={editItemForm.NameMenuItems}
                                    onChange={(e) =>
                                        setEditItemForm({ ...editItemForm, NameMenuItems: e.target.value })
                                    }
                                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF5722]"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Giá tiền (VNĐ) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        value={editItemForm.Price}
                                        onChange={(e) =>
                                            setEditItemForm({ ...editItemForm, Price: e.target.value })
                                        }
                                        className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF5722]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Trạng thái mở bán</label>
                                    <select
                                        value={editItemForm.is_available ? "true" : "false"}
                                        onChange={(e) =>
                                            setEditItemForm({ ...editItemForm, is_available: e.target.value === "true" })
                                        }
                                        className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF5722]"
                                    >
                                        <option value="true">Mở bán</option>
                                        <option value="false">Tạm ngưng</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">URL Hình ảnh</label>
                                <input
                                    type="text"
                                    value={editItemForm.ImageUrl}
                                    onChange={(e) =>
                                        setEditItemForm({ ...editItemForm, ImageUrl: e.target.value })
                                    }
                                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF5722]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Mô tả món ăn</label>
                                <textarea
                                    rows={3}
                                    value={editItemForm.Description}
                                    onChange={(e) =>
                                        setEditItemForm({ ...editItemForm, Description: e.target.value })
                                    }
                                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF5722] resize-none"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsEditItemModalOpen(false)}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200 transition"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-[#FF5722] hover:bg-[#E64A19] text-white rounded-xl text-xs font-semibold transition shadow-sm"
                                >
                                    Lưu thay đổi
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal 3: Thêm danh mục mới */}
            {isAddCategoryModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <FolderPlus className="w-5 h-5 text-[#FF5722]" />
                                Thêm danh mục món ăn
                            </h2>
                            <button
                                onClick={() => setIsAddCategoryModalOpen(false)}
                                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleAddCategorySubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Tên danh mục <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="VD: Đồ uống / Món nướng"
                                    value={categoryForm.CategoriesRestaurantName}
                                    onChange={(e) =>
                                        setCategoryForm({ ...categoryForm, CategoriesRestaurantName: e.target.value })
                                    }
                                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF5722]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Mã danh mục <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="VD: DO_UONG"
                                    value={categoryForm.CategorieRestaurantsCode}
                                    onChange={(e) =>
                                        setCategoryForm({ ...categoryForm, CategorieRestaurantsCode: e.target.value })
                                    }
                                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF5722]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Mô tả</label>
                                <input
                                    type="text"
                                    placeholder="VD: Các loại thức uống giải khát"
                                    value={categoryForm.Descriptions}
                                    onChange={(e) =>
                                        setCategoryForm({ ...categoryForm, Descriptions: e.target.value })
                                    }
                                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF5722]"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsAddCategoryModalOpen(false)}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200 transition"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-[#FF5722] hover:bg-[#E64A19] text-white rounded-xl text-xs font-semibold transition shadow-sm"
                                >
                                    Thêm danh mục
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
