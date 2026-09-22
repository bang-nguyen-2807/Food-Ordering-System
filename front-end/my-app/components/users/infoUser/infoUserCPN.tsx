"use client"
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchAddAddressUser, getInfoUser, getAddressUser, deleteAddressUser, updateInfoUser , changePassword } from "@/features/users/infoUser/infoUserSlice";
import { useEffect, useState, useRef } from "react";
import LoadingSpinner from "@/components/spinner/loading";
import ErrorSpinner from "@/components/spinner/error";
import Modal from "@/components/modal/modal";

import Link from "next/link";
import { User, MapPin, Edit3, Plus, Trash2, Home, Building, Phone, Mail, Lock, Key, ArrowLeft } from "lucide-react";

export default function InfoUserCPN() {
    const dispatch = useDispatch<AppDispatch>();
    const { err, loading, addresses, infoUser } = useSelector((state: RootState) => state.infoUser);
    const { user } = useSelector((state: RootState) => state.login);
    const UserId = user?.UserId;

    // -- Smooth Scroll Refs & Active Tab --
    const infoSectionRef = useRef<HTMLDivElement>(null);
    const addressSectionRef = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState<"info" | "address">("info");

    const scrollToInfo = () => {
        setActiveTab("info");
        infoSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const scrollToAddress = () => {
        setActiveTab("address");
        addressSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    // -- Modal Add Address --
    const [isOpenModalAddAddress , setIsOpenModalAddAddress] = useState<boolean>(false); // state manage close or open modal
    const [AddressName, setAddressName] = useState<string>("");
    const [Addresses, setAddresses] = useState<string>("");
    // -- Modal Add Address --

    // -- Modal edit Info User
    const [isOpenModalEditUser , setIsOpenModalEditUser] = useState<boolean>(false); // state manage close or open modal
    // state save value in input for modal
    const [editFullName , setEditFullName] = useState<string>("");
    const [editNumberPhone , setEditNumberPhone] = useState<string>("");
    const [editEmail , setEditEmail] = useState<string>("");
    // -- Modal edit Info User

    // -- Modal change password
    const [isOpenModalChangePassword , setIsOpenModalChangePassword] = useState<boolean>(false);
    const [oldPassword , setOldPassword] = useState<string>("");
    const [newPassword , setNewPassword] = useState<string>("");
    const [confirmPassword , setConfirmPassword] = useState<string>("");
    const [errorPassword , setErrorPassword] = useState<string>(""); // state to save notification error password
    // -- Modal change password

    // fetch data user
    useEffect(() => {
        if (UserId) {
            dispatch(getAddressUser({ UserId: String(UserId) })).unwrap()
            dispatch(getInfoUser({ UserId: String(UserId) })).unwrap()
        }
    }, [UserId]);
    // Open modal add address
    const handleOpenModalAddAddress = () => {
        setIsOpenModalAddAddress(true);
    }
    // function ADD ADDRESS user after click button Add Address
    const handleAddAddress = async () => {
        if (!AddressName.trim() || !Addresses.trim()) {
            alert("Vui lòng nhập đầy đủ Tên địa chỉ và Địa chỉ chi tiết!");
            return;
        }
        if (!UserId) {
            alert("Không tìm thấy thông tin người dùng!");
            return;
        }
        try {
            await dispatch(fetchAddAddressUser({
                UserId: String(UserId),
                AddressName: AddressName.trim(),
                Addresses: Addresses.trim()
            })).unwrap();
            alert("Thêm địa chỉ thành công!");
            if (UserId) {
                dispatch(getAddressUser({ UserId: String(UserId) }));
                setIsOpenModalAddAddress(false); // close modal
            }
            // Reset input
            setAddressName("");
            setAddresses("");
        } catch (error) {
            console.error("Lỗi khi thêm địa chỉ:", error);
        }
    };
    // Hàm Xóa Địa Chỉ
    const handleDeleteAddress = async (userAddressId: number) => {
        if (!confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) return;
        try {
            await dispatch(deleteAddressUser({ UserAddressId: String(userAddressId) })).unwrap();
            alert("Xóa địa chỉ thành công!");
            // Re-fetch lấy lại danh sách mới
            if (UserId) {
                dispatch(getAddressUser({ UserId: String(UserId) }));
            }
        } catch (error) {
            console.error("Lỗi khi xóa địa chỉ:", error);
        }
    };
    // function open modal 
    const handleOpenModalEditInfoUser = () => {
        const currentUser = infoUser[0];
        if (currentUser) {
            setEditFullName(currentUser.FullName || "");
            setEditNumberPhone(currentUser.NumberPhone || "");
            setEditEmail(currentUser.Email || "");
        }
        setIsOpenModalEditUser(true);
    }
    // function save info user after click button Lưu
    const handleSaveInfoUser = async()=>{
        if(!editFullName.trim() || !editNumberPhone.trim() || !editEmail.trim()){// . trim để xóa khoảng trắng đầu đuôi
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }
        try{
            await dispatch(updateInfoUser({FullName : editFullName , NumberPhone : editNumberPhone , Email : editEmail , UserId : String(UserId)})).unwrap();
            setIsOpenModalEditUser(false); // đóng modal
            if(UserId){
                dispatch(getInfoUser({UserId : String(UserId)}));
            }   
        }catch(error){
            console.error("Lỗi khi update thông tin người dùng:", error);
        }
    }
    // function open modal changePassword
    const handleOpenModalChangePassword = () => {
        setIsOpenModalChangePassword(true);
    }
    // function change password after click button đổi mật khẩu
    const handleChangePassword = async()=>{
        setErrorPassword("");
        if(!oldPassword.trim() || !newPassword.trim() || !confirmPassword.trim()){// . trim để xóa khoảng trắng đầu đuôi
            setErrorPassword("Vui lòng nhập đầy đủ thông tin mật khẩu")
            return;
        }
        if(newPassword !== confirmPassword){
            setErrorPassword("Mật khẩu mới không khớp!");
            return;
        }
        // if(newPassword.length < 6){
        //     setErrorPassword("Mật khẩu mới phải có ít nhất 6 ký tự");
        //     return;
        // }
        // if(newPassword === oldPassword){
        //     setErrorPassword("Mật khẩu mới phải khác mật khẩu cũ");
        //     return;
        // }
        try{
            await dispatch(changePassword({UserId : String(UserId) , oldPassword : oldPassword , newPassword : newPassword})).unwrap();
            setErrorPassword("Đổi mật khẩu thành công!");
            setIsOpenModalChangePassword(false); // đóng modal
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        }catch(error : any){
            const err = typeof error === "string" ? error : (error.message || "Đổi mật khẩu thất bại!");
            setErrorPassword(err);
        }
    }
    const [isMounted, setIsMounted] = useState<boolean>(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (loading) {
        return <LoadingSpinner />
    }
    if (err) {
        return <ErrorSpinner message={err} />
    }

    const mainInfo = infoUser[0];
    const userInitial = isMounted
        ? (mainInfo?.FullName ? mainInfo.FullName.charAt(0).toUpperCase() : (user?.UserName?.charAt(0).toUpperCase() || "U"))
        : "U";
    const displayName = isMounted ? (mainInfo?.FullName || user?.UserName || "Người dùng") : "Người dùng";
    const displayEmail = isMounted ? (mainInfo?.Email || user?.Email || "Chưa cập nhật email") : "Chưa cập nhật email";

    const displayFullName = isMounted ? (mainInfo?.FullName || "Chưa cập nhật") : "Chưa cập nhật";
    const displayPhone = isMounted ? (mainInfo?.NumberPhone || "Chưa cập nhật") : "Chưa cập nhật";
    const displayEmailFull = isMounted ? (mainInfo?.Email || "Chưa cập nhật") : "Chưa cập nhật";

    return (
        <div className="min-h-screen bg-[#F8F9FA] py-8 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto flex flex-col gap-5">
                {/* ---------- TOP BACK BUTTON TO HOME ---------- */}
                <div className="flex items-center justify-between">
                    <Link
                        href="/users/home"
                        className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white hover:bg-orange-500 text-gray-700 hover:text-white font-semibold text-sm border border-gray-100/80 shadow-2xs hover:shadow-md hover:shadow-orange-500/20 active:scale-95 transition-all duration-200 cursor-pointer group"
                    >
                        <ArrowLeft className="w-4 h-4 text-orange-500 group-hover:text-white group-hover:-translate-x-1 transition-all duration-200" />
                        <span>Quay về trang chủ</span>
                    </Link>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* ---------- LEFT SIDEBAR CARD ---------- */}
                    <div className="w-full lg:w-72 bg-white rounded-3xl p-6 shadow-xs border border-gray-100/80 flex flex-col gap-6 self-start sticky top-6">
                        {/* User Profile Summary */}
                        <div className="text-center">
                            <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden bg-gradient-to-tr from-amber-100 to-orange-100 border-4 border-white shadow-md flex items-center justify-center">
                                <span className="text-3xl font-extrabold text-orange-500">
                                    {userInitial}
                                </span>
                            </div>
                            <h2 className="font-bold text-gray-900 text-lg mt-3.5 tracking-tight">
                                {displayName}
                            </h2>
                            <p className="text-xs text-gray-400 font-medium mt-0.5 truncate">
                                {displayEmail}
                            </p>
                            <div className="mt-3">
                                <span className="inline-flex items-center px-3 py-1 bg-amber-50 text-amber-600 text-[11px] font-semibold rounded-full border border-amber-200/60 shadow-2xs">
                                    Thành viên Vàng
                                </span>
                            </div>
                        </div>

                        <div className="h-px bg-gray-100 my-1" />

                        {/* Navigation Items */}
                        <nav className="flex flex-col gap-1.5">
                            <Link
                                href="/users/home"
                                className="flex items-center gap-3.5 p-3.5 rounded-2xl font-bold text-sm text-gray-500 hover:bg-orange-50/80 hover:text-orange-600 transition-all text-left w-full cursor-pointer group"
                            >
                                <Home className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                                <span>Trang chủ</span>
                            </Link>

                            <button
                                onClick={scrollToInfo}
                                className={`flex items-center gap-3.5 p-3.5 rounded-2xl font-bold text-sm transition-all text-left w-full cursor-pointer ${
                                    activeTab === "info"
                                        ? "bg-orange-50/80 text-orange-600 shadow-2xs"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                            >
                                <User className={`w-5 h-5 ${activeTab === "info" ? "text-orange-500" : "text-gray-400"}`} />
                                <span>Thông tin tài khoản</span>
                            </button>

                            <button
                                onClick={scrollToAddress}
                                className={`flex items-center gap-3.5 p-3.5 rounded-2xl font-bold text-sm transition-all text-left w-full cursor-pointer ${
                                    activeTab === "address"
                                        ? "bg-orange-50/80 text-orange-600 shadow-2xs"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                            >
                                <MapPin className={`w-5 h-5 ${activeTab === "address" ? "text-orange-500" : "text-gray-400"}`} />
                                <span>Địa chỉ đã lưu</span>
                            </button>
                        </nav>
                    </div>

                {/* ---------- RIGHT CONTENT AREA ---------- */}
                <div className="flex-1 flex flex-col gap-6">

                    {/* ----- CARD 1: THÔNG TIN CÁ NHÂN ----- */}
                    <div ref={infoSectionRef} className="scroll-mt-6 bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-gray-100/80">
                        <div className="flex items-center justify-between gap-4 mb-6">
                            <h3 className="text-xl font-bold text-gray-900 tracking-tight">Thông tin cá nhân</h3>
                            <button
                                onClick={handleOpenModalEditInfoUser}
                                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200/80 rounded-xl transition cursor-pointer flex items-center gap-2"
                            >
                                <Edit3 className="w-4 h-4 text-gray-500" />
                                <span>Chỉnh sửa</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <p className="text-xs text-gray-400 font-medium mb-1">Họ và tên</p>
                                <p className="text-sm sm:text-base font-bold text-gray-900">
                                    {displayFullName}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-400 font-medium mb-1">Số điện thoại</p>
                                <p className="text-sm sm:text-base font-bold text-gray-900">
                                    {displayPhone}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-400 font-medium mb-1">Email</p>
                                <p className="text-sm sm:text-base font-bold text-gray-900 break-all">
                                    {displayEmailFull}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-400 font-medium mb-1">Mật khẩu</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm sm:text-base font-bold text-gray-900">••••••••</span>
                                    <button
                                        onClick={handleOpenModalChangePassword}
                                        className="text-xs font-semibold text-orange-500 hover:text-orange-600 hover:underline flex items-center gap-1 cursor-pointer transition ml-1"
                                    >
                                        <Lock className="w-3.5 h-3.5" />
                                        <span>Đổi mật khẩu</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ----- CARD 2: ĐỊA CHỈ ĐÃ LƯU ----- */}
                    <div ref={addressSectionRef} className="scroll-mt-6 bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-gray-100/80">
                        <div className="flex items-center justify-between gap-4 mb-6">
                            <h3 className="text-xl font-bold text-gray-900 tracking-tight">Địa chỉ đã lưu</h3>
                            <button
                                onClick={handleOpenModalAddAddress}
                                className="px-5 py-2.5 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 active:bg-orange-700 rounded-xl shadow-xs hover:shadow transition cursor-pointer flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4 stroke-[3]" />
                                <span>Thêm địa chỉ mới</span>
                            </button>
                        </div>

                        {addresses.length === 0 ? (
                            <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-2xl">
                                <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                <p className="text-sm text-gray-400 font-medium">Bạn chưa lưu địa chỉ nào</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3.5">
                                {addresses.map((address, idx) => (
                                    <div
                                        key={address.UserAddressId}
                                        className="p-4 sm:p-5 rounded-2xl border border-gray-100 hover:border-orange-200 bg-white hover:bg-orange-50/20 transition-all flex items-center justify-between gap-4 group"
                                    >
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className="w-11 h-11 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                                                {idx === 0 ? <Home className="w-5 h-5" /> : <Building className="w-5 h-5" />}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-bold text-gray-900 text-sm sm:text-base truncate">
                                                    {address.AddressName}
                                                    {idx === 0 && <span className="text-xs text-gray-400 font-normal ml-1.5">(Địa chỉ mặc định)</span>}
                                                </h4>
                                                <p className="text-xs sm:text-sm text-gray-500 mt-0.5 truncate">
                                                    {address.Addresses}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleDeleteAddress(address.UserAddressId)}
                                            className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition cursor-pointer flex-shrink-0"
                                            title="Xóa địa chỉ"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* ---------- MODAL UPDATE INFORMATIONS USER ---------- */}
            <Modal
                isOpen={isOpenModalEditUser}
                onClose={() => setIsOpenModalEditUser(false)}
                title="Cập nhật thông tin cá nhân"
                description="Chỉnh sửa thông tin liên hệ của tài khoản"
                maxWidth="md"
            >
                <div className="flex flex-col gap-4 mt-2">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                            Họ và tên
                        </label>
                        <div className="relative">
                            <input
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
                                type="text"
                                placeholder="Nhập họ và tên"
                                value={editFullName}
                                onChange={(e) => setEditFullName(e.target.value)}
                            />
                            <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                            Số điện thoại
                        </label>
                        <div className="relative">
                            <input
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
                                type="text"
                                placeholder="Nhập số điện thoại"
                                value={editNumberPhone}
                                onChange={(e) => setEditNumberPhone(e.target.value)}
                            />
                            <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                            Email
                        </label>
                        <div className="relative">
                            <input
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
                                type="email"
                                placeholder="Nhập email"
                                value={editEmail}
                                onChange={(e) => setEditEmail(e.target.value)}
                            />
                            <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                        <button
                            onClick={() => setIsOpenModalEditUser(false)}
                            className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold text-sm transition cursor-pointer"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleSaveInfoUser}
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold text-sm shadow-md shadow-orange-500/20 active:scale-98 transition cursor-pointer"
                        >
                            Lưu thay đổi
                        </button>
                    </div>
                </div>
            </Modal>

            {/* ---------- MODAL ADD ADDRESS ---------- */}
            <Modal
                isOpen={isOpenModalAddAddress}
                onClose={() => setIsOpenModalAddAddress(false)}
                title="Thêm địa chỉ mới"
                description="Nhập tên gợi nhớ và địa chỉ giao hàng chi tiết"
                maxWidth="md"
            >
                <div className="flex flex-col gap-4 mt-2">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                            Tên địa chỉ (Gợi nhớ)
                        </label>
                        <div className="relative">
                            <input
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
                                type="text"
                                placeholder="VD: Nhà riêng, Văn phòng..."
                                value={AddressName}
                                onChange={(e) => setAddressName(e.target.value)}
                            />
                            <Home className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                            Địa chỉ chi tiết
                        </label>
                        <div className="relative">
                            <input
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
                                type="text"
                                placeholder="VD: Số 12 Ngõ 345, Phường Bách Khoa, Quận Hai Bà Trưng, Hà Nội"
                                value={Addresses}
                                onChange={(e) => setAddresses(e.target.value)}
                            />
                            <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                        <button
                            onClick={() => setIsOpenModalAddAddress(false)}
                            className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold text-sm transition cursor-pointer"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleAddAddress}
                            className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm shadow-md shadow-orange-500/20 active:scale-98 transition cursor-pointer"
                        >
                            Thêm địa chỉ
                        </button>
                    </div>
                </div>
            </Modal>
            {/* ---------- MODAL CHANGE PASSWORD ---------- */}
            <Modal
                isOpen={isOpenModalChangePassword}
                onClose={() => setIsOpenModalChangePassword(false)}
                title="Đổi mật khẩu"
                description="Cập nhật mật khẩu mới cho tài khoản của bạn"
                maxWidth="md"
            >
                <div className="flex flex-col gap-4 mt-2">
                    {/* message lỗi */}
                    {errorPassword && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-xl">
                            ⚠️ {errorPassword}
                        </div>
                    )}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                            Mật khẩu cũ
                        </label>
                        <div className="relative">
                            <input
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
                                type="password"
                                placeholder="Nhập mật khẩu cũ"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                            />
                            <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                            Mật khẩu mới
                        </label>
                        <div className="relative">
                            <input
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
                                type="password"
                                placeholder="Nhập mật khẩu mới"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                            Xác nhận mật khẩu mới
                        </label>
                        <div className="relative">
                            <input
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
                                type="password"
                                placeholder="Nhập lại mật khẩu mới"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                        <button
                            onClick={() => setIsOpenModalChangePassword(false)}
                            className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold text-sm transition cursor-pointer"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleChangePassword}
                            className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm shadow-md shadow-orange-500/20 active:scale-98 transition cursor-pointer"
                        >
                            Đổi mật khẩu
                        </button>
                    </div>
                </div>
            </Modal>
            </div>
        </div>
    );
}