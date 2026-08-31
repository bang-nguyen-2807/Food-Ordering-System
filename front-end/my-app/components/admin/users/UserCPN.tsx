"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import {
  fetchInfoUser,
  fetchInfoRestaurant,
  fetchInfoShipper,
  fetchAddUser,
  fetchUpdateUser,
  fetchDeleteUser,
  fetchAddRestaurant,
  fetchUpdateRestaurant,
  fetchDeleteRestaurant,
  fetchAddShipper,
  fetchUpdateShipper,
  fetchDeleteShipper,
  infoUsers,
  infoRestaurant,
  infoShipper,
} from "@/features/admin/users/UserSlice";
import ErrorSpinner from "@/components/spinner/error";
import LoadingSpinner from "@/components/spinner/loading";
import Modal from "@/components/modal/modal";
import UserSubCPN from "./users/userCPN";
import RestaurantCPN from "./restaurents/restaurantCPN";
import ShipperCPN from "./shipper/shipperCPN";
import {
  Users,
  Store,
  Truck,
  RefreshCw,
  ShieldCheck,
  Search,
  User,
  AtSign,
  Phone,
  Mail,
  Loader2,
  AlertCircle,
  UserPlus,
  Lock,
  Eye,
  EyeOff,
  Trash2,
} from "lucide-react";

export default function UserCPN() {
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState<"user" | "restaurant" | "shipper">("user");
  const [searchTerm, setSearchTerm] = useState("");

  // Quản lý Modal và Form Cập Nhật
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [dataUpdateUser, setDataUpdateUser] = useState({
    UserId: 0,
    FullName: "",
    UserName: "",
    NumberPhone: "",
    Email: "",
  });

  // Quản lý Modal và Form Thêm Người Dùng Mới
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmittingAdd, setIsSubmittingAdd] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [dataAddUser, setDataAddUser] = useState({
    FullName: "",
    UserName: "",
    Password: "",
    NumberPhone: "",
    Email: "",
  });

  // Quản lý Modal Xác Nhận Xóa Người Dùng
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmittingDelete, setIsSubmittingDelete] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<infoUsers | null>(null);

  // Quản lý Modal và Form Thêm Nhà Hàng Mới
  const [isAddResModalOpen, setIsAddResModalOpen] = useState(false);
  const [isSubmittingAddRes, setIsSubmittingAddRes] = useState(false);
  const [addResError, setAddResError] = useState<string | null>(null);
  const [dataAddRes, setDataAddRes] = useState({
    RestaurantName: "",
    UserId: 0,
    Addresses: "",
    RestaurantRole: "OWNER",
  });

  // Quản lý Modal và Form Chỉnh Sửa Nhà Hàng
  const [isEditResModalOpen, setIsEditResModalOpen] = useState(false);
  const [isSubmittingEditRes, setIsSubmittingEditRes] = useState(false);
  const [editResError, setEditResError] = useState<string | null>(null);
  const [dataUpdateRes, setDataUpdateRes] = useState({
    RestaurantId: 0,
    RestaurantName: "",
    UserId: 0,
    Addresses: "",
    RestaurantRole: "",
  });

  // Quản lý Modal Xác Nhận Xóa Nhà Hàng
  const [isDeleteResModalOpen, setIsDeleteResModalOpen] = useState(false);
  const [isSubmittingDeleteRes, setIsSubmittingDeleteRes] = useState(false);
  const [deleteResError, setDeleteResError] = useState<string | null>(null);
  const [restaurantToDelete, setRestaurantToDelete] = useState<infoRestaurant | null>(null);

  // Quản lý Modal và Form Thêm Shipper Mới
  const [isAddShipperModalOpen, setIsAddShipperModalOpen] = useState(false);
  const [isSubmittingAddShipper, setIsSubmittingAddShipper] = useState(false);
  const [addShipperError, setAddShipperError] = useState<string | null>(null);
  const [showShipperPassword, setShowShipperPassword] = useState(false);
  const [dataAddShipper, setDataAddShipper] = useState({
    FullName: "",
    UserName: "",
    Password: "",
    NumberPhone: "",
    Email: "",
    UserId: 0,
  });

  // Quản lý Modal và Form Chỉnh Sửa Shipper
  const [isEditShipperModalOpen, setIsEditShipperModalOpen] = useState(false);
  const [isSubmittingEditShipper, setIsSubmittingEditShipper] = useState(false);
  const [editShipperError, setEditShipperError] = useState<string | null>(null);
  const [dataUpdateShipper, setDataUpdateShipper] = useState({
    ShipperId: 0,
    UserId: 0,
    FullName: "",
    UserName: "",
    NumberPhone: "",
    Email: "",
  });

  // Quản lý Modal Xác Nhận Xóa Shipper
  const [isDeleteShipperModalOpen, setIsDeleteShipperModalOpen] = useState(false);
  const [isSubmittingDeleteShipper, setIsSubmittingDeleteShipper] = useState(false);
  const [deleteShipperError, setDeleteShipperError] = useState<string | null>(null);
  const [shipperToDelete, setShipperToDelete] = useState<infoShipper | null>(null);

  const { dataUsers, dataRestaurant, dataShipper, loading, err } = useSelector(
    (state: RootState) => state.adminUserAndPartness
  );

  useEffect(() => {
    if (activeTab === "user") {
      dispatch(fetchInfoUser());
    } else if (activeTab === "restaurant") {
      dispatch(fetchInfoRestaurant());
    } else {
      dispatch(fetchInfoShipper());
    }
  }, [dispatch, activeTab]);

  // Mở modal thêm người dùng mới
  const handleOpenAdd = () => {
    setDataAddUser({
      FullName: "",
      UserName: "",
      Password: "",
      NumberPhone: "",
      Email: "",
    });
    setAddError(null);
    setShowPassword(false);
    setIsAddModalOpen(true);
  };

  // Xử lý gửi request Thêm Người Dùng
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);

    if (
      !dataAddUser.FullName.trim() ||
      !dataAddUser.UserName.trim() ||
      !dataAddUser.Password.trim() ||
      !dataAddUser.NumberPhone.trim() ||
      !dataAddUser.Email.trim()
    ) {
      setAddError("Vui lòng điền đầy đủ tất cả các trường thông tin!");
      return;
    }

    setIsSubmittingAdd(true);
    const result = await dispatch(
      fetchAddUser({
        FullName: dataAddUser.FullName.trim(),
        UserName: dataAddUser.UserName.trim(),
        Password: dataAddUser.Password.trim(),
        NumberPhone: dataAddUser.NumberPhone.trim(),
        Email: dataAddUser.Email.trim(),
      })
    );
    setIsSubmittingAdd(false);

    if (fetchAddUser.fulfilled.match(result)) {
      setIsAddModalOpen(false);
    } else {
      setAddError((result.payload as string) || "Thêm người dùng thất bại!");
    }
  };

  // Mở modal và nạp dữ liệu người dùng được chọn để chỉnh sửa
  const handleOpenEdit = (user: infoUsers) => {
    setDataUpdateUser({
      UserId: user.UserId,
      FullName: user.FullName || "",
      UserName: user.UserName || "",
      NumberPhone: user.NumberPhone || "",
      Email: user.Email || "",
    });
    setUpdateError(null);
    setIsEditModalOpen(true);
  };

  // Xử lý gửi cập nhật người dùng
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateError(null);

    if (
      !dataUpdateUser.FullName.trim() ||
      !dataUpdateUser.UserName.trim() ||
      !dataUpdateUser.NumberPhone.trim() ||
      !dataUpdateUser.Email.trim()
    ) {
      setUpdateError("Vui lòng điền đầy đủ tất cả các trường thông tin!");
      return;
    }

    setIsSubmitting(true);
    const result = await dispatch(
      fetchUpdateUser({
        UserId: Number(dataUpdateUser.UserId),
        FullName: dataUpdateUser.FullName.trim(),
        UserName: dataUpdateUser.UserName.trim(),
        NumberPhone: dataUpdateUser.NumberPhone.trim(),
        Email: dataUpdateUser.Email.trim(),
      })
    );
    setIsSubmitting(false);

    if (fetchUpdateUser.fulfilled.match(result)) {
      setIsEditModalOpen(false);
      dispatch(fetchInfoUser()); // Tải lại danh sách mới
    } else {
      setUpdateError((result.payload as string) || "Cập nhật thông tin thất bại!");
    }
  };

  // Mở modal xác nhận xóa người dùng
  const handleOpenDelete = (user: infoUsers) => {
    setUserToDelete(user);
    setDeleteError(null);
    setIsDeleteModalOpen(true);
  };

  // Xử lý gửi request Xóa Người Dùng
  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setDeleteError(null);
    setIsSubmittingDelete(true);
    const result = await dispatch(
      fetchDeleteUser({ UserId: userToDelete.UserId })
    );
    setIsSubmittingDelete(false);

    if (fetchDeleteUser.fulfilled.match(result)) {
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } else {
      setDeleteError(
        (result.payload as string) || "Xóa người dùng thất bại!"
      );
    }
  };

  // --- RESTAURANT HANDLERS ---
  const handleOpenAddRestaurant = () => {
    setDataAddRes({
      RestaurantName: "",
      UserId: dataUsers.length > 0 ? dataUsers[0].UserId : 0,
      Addresses: "",
      RestaurantRole: "OWNER",
    });
    setAddResError(null);
    setIsAddResModalOpen(true);
  };

  const handleAddRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddResError(null);

    if (!dataAddRes.RestaurantName.trim() || !dataAddRes.Addresses.trim() || !dataAddRes.UserId) {
      setAddResError("Vui lòng nhập tên nhà hàng, địa chỉ và chọn chủ sở hữu!");
      return;
    }

    setIsSubmittingAddRes(true);
    const result = await dispatch(
      fetchAddRestaurant({
        RestaurantName: dataAddRes.RestaurantName.trim(),
        UserId: Number(dataAddRes.UserId),
        Addresses: dataAddRes.Addresses.trim(),
        RestaurantRole: dataAddRes.RestaurantRole.trim() || "Đối tác kinh doanh",
      })
    );
    setIsSubmittingAddRes(false);

    if (fetchAddRestaurant.fulfilled.match(result)) {
      setIsAddResModalOpen(false);
    } else {
      setAddResError((result.payload as string) || "Thêm nhà hàng thất bại!");
    }
  };

  const handleOpenEditRestaurant = (resItem: infoRestaurant) => {
    const matchedUser = dataUsers.find((u) => u.FullName === resItem.FullName);
    setDataUpdateRes({
      RestaurantId: resItem.RestaurantId,
      RestaurantName: resItem.RestaurantName || "",
      UserId: matchedUser ? matchedUser.UserId : (dataUsers[0]?.UserId || 0),
      Addresses: resItem.Addresses || "",
      RestaurantRole: resItem.RestaurantRole || "Đối tác kinh doanh",
    });
    setEditResError(null);
    setIsEditResModalOpen(true);
  };

  const handleUpdateRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditResError(null);

    if (!dataUpdateRes.RestaurantName.trim() || !dataUpdateRes.Addresses.trim() || !dataUpdateRes.UserId) {
      setEditResError("Vui lòng điền đầy đủ tất cả các trường!");
      return;
    }

    setIsSubmittingEditRes(true);
    const result = await dispatch(
      fetchUpdateRestaurant({
        RestaurantId: Number(dataUpdateRes.RestaurantId),
        RestaurantName: dataUpdateRes.RestaurantName.trim(),
        UserId: Number(dataUpdateRes.UserId),
        Addresses: dataUpdateRes.Addresses.trim(),
        RestaurantRole: dataUpdateRes.RestaurantRole.trim() || "Đối tác kinh doanh",
      })
    );
    setIsSubmittingEditRes(false);

    if (fetchUpdateRestaurant.fulfilled.match(result)) {
      setIsEditResModalOpen(false);
    } else {
      setEditResError((result.payload as string) || "Cập nhật nhà hàng thất bại!");
    }
  };

  const handleOpenDeleteRestaurant = (resItem: infoRestaurant) => {
    setRestaurantToDelete(resItem);
    setDeleteResError(null);
    setIsDeleteResModalOpen(true);
  };

  const handleDeleteRestaurant = async () => {
    if (!restaurantToDelete) return;

    setDeleteResError(null);
    setIsSubmittingDeleteRes(true);
    const result = await dispatch(
      fetchDeleteRestaurant({ RestaurantId: restaurantToDelete.RestaurantId })
    );
    setIsSubmittingDeleteRes(false);

    if (fetchDeleteRestaurant.fulfilled.match(result)) {
      setIsDeleteResModalOpen(false);
      setRestaurantToDelete(null);
    } else {
      setDeleteResError(
        (result.payload as string) || "Xóa nhà hàng thất bại!"
      );
    }
  };

  // --- SHIPPER HANDLERS ---
  const handleOpenAddShipper = () => {
    setDataAddShipper({
      FullName: "",
      UserName: "",
      Password: "",
      NumberPhone: "",
      Email: "",
      UserId: 0,
    });
    setAddShipperError(null);
    setShowShipperPassword(false);
    setIsAddShipperModalOpen(true);
  };

  const handleAddShipper = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddShipperError(null);

    if (
      !dataAddShipper.FullName.trim() ||
      !dataAddShipper.UserName.trim() ||
      !dataAddShipper.Password.trim() ||
      !dataAddShipper.NumberPhone.trim() ||
      !dataAddShipper.Email.trim()
    ) {
      setAddShipperError("Vui lòng điền đầy đủ tất cả các trường thông tin tài xế!");
      return;
    }

    setIsSubmittingAddShipper(true);
    const result = await dispatch(
      fetchAddShipper({
        FullName: dataAddShipper.FullName.trim(),
        UserName: dataAddShipper.UserName.trim(),
        Password: dataAddShipper.Password.trim(),
        NumberPhone: dataAddShipper.NumberPhone.trim(),
        Email: dataAddShipper.Email.trim(),
      })
    );
    setIsSubmittingAddShipper(false);

    if (fetchAddShipper.fulfilled.match(result)) {
      setIsAddShipperModalOpen(false);
    } else {
      setAddShipperError((result.payload as string) || "Thêm shipper thất bại!");
    }
  };

  const handleOpenEditShipper = (shipper: infoShipper) => {
    setDataUpdateShipper({
      ShipperId: shipper.ShipperId || 0,
      UserId: shipper.UserId,
      FullName: shipper.FullName || "",
      UserName: shipper.UserName || "",
      NumberPhone: shipper.NumberPhone || "",
      Email: shipper.Email || "",
    });
    setEditShipperError(null);
    setIsEditShipperModalOpen(true);
  };

  const handleUpdateShipper = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditShipperError(null);

    if (
      !dataUpdateShipper.FullName.trim() ||
      !dataUpdateShipper.UserName.trim() ||
      !dataUpdateShipper.NumberPhone.trim() ||
      !dataUpdateShipper.Email.trim()
    ) {
      setEditShipperError("Vui lòng điền đầy đủ tất cả các trường thông tin!");
      return;
    }

    setIsSubmittingEditShipper(true);
    const result = await dispatch(
      fetchUpdateShipper({
        ShipperId: Number(dataUpdateShipper.ShipperId),
        UserId: Number(dataUpdateShipper.UserId),
        FullName: dataUpdateShipper.FullName.trim(),
        UserName: dataUpdateShipper.UserName.trim(),
        NumberPhone: dataUpdateShipper.NumberPhone.trim(),
        Email: dataUpdateShipper.Email.trim(),
      })
    );
    setIsSubmittingEditShipper(false);

    if (fetchUpdateShipper.fulfilled.match(result)) {
      setIsEditShipperModalOpen(false);
    } else {
      setEditShipperError((result.payload as string) || "Cập nhật shipper thất bại!");
    }
  };

  const handleOpenDeleteShipper = (shipper: infoShipper) => {
    setShipperToDelete(shipper);
    setDeleteShipperError(null);
    setIsDeleteShipperModalOpen(true);
  };

  const handleDeleteShipper = async () => {
    if (!shipperToDelete || !shipperToDelete.ShipperId) return;

    setDeleteShipperError(null);
    setIsSubmittingDeleteShipper(true);
    const result = await dispatch(
      fetchDeleteShipper({ ShipperId: shipperToDelete.ShipperId })
    );
    setIsSubmittingDeleteShipper(false);

    if (fetchDeleteShipper.fulfilled.match(result)) {
      setIsDeleteShipperModalOpen(false);
      setShipperToDelete(null);
    } else {
      setDeleteShipperError(
        (result.payload as string) || "Xóa shipper thất bại!"
      );
    }
  };

  const handleRefresh = () => {
    if (activeTab === "user") {
      dispatch(fetchInfoUser());
    } else if (activeTab === "restaurant") {
      dispatch(fetchInfoRestaurant());
    } else {
      dispatch(fetchInfoShipper());
    }
  };

  const usersCount = Array.isArray(dataUsers) ? dataUsers.length : 0;
  const restaurantCount = Array.isArray(dataRestaurant) ? dataRestaurant.length : 0;
  const shipperCount = Array.isArray(dataShipper) ? dataShipper.length : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Container */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Quản Lý Người Dùng & Đối Tác
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-600 border border-orange-200/60 rounded-full text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Hệ thống FoodGo
            </span>
          </div>
          <p className="text-sm text-gray-500 font-medium mt-1">
            Quản lý chi tiết danh sách tài khoản khách hàng và đối tác nhà hàng trong hệ thống
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          {activeTab === "user" ? (
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-sm font-bold rounded-2xl shadow-lg shadow-orange-500/20 transition-all active:scale-95 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Thêm Người Dùng</span>
            </button>
          ) : activeTab === "restaurant" ? (
            <button
              onClick={handleOpenAddRestaurant}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-sm font-bold rounded-2xl shadow-lg shadow-orange-500/20 transition-all active:scale-95 cursor-pointer"
            >
              <Store className="w-4 h-4" />
              <span>Thêm Nhà Hàng</span>
            </button>
          ) : (
            <button
              onClick={handleOpenAddShipper}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-sm font-bold rounded-2xl shadow-lg shadow-orange-500/20 transition-all active:scale-95 cursor-pointer"
            >
              <Truck className="w-4 h-4" />
              <span>Thêm Shipper</span>
            </button>
          )}

          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-semibold rounded-2xl border border-gray-200 transition-all active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-gray-500" />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card Users */}
        <div
          onClick={() => setActiveTab("user")}
          className={`p-5 rounded-3xl cursor-pointer transition-all border ${
            activeTab === "user"
              ? "bg-gradient-to-br from-orange-500 to-amber-500 text-white border-orange-500 shadow-lg shadow-orange-500/20 scale-[1.01]"
              : "bg-white text-gray-800 border-gray-100 hover:border-orange-200 hover:shadow-md"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-xs font-bold uppercase tracking-wider ${
                  activeTab === "user" ? "text-white/80" : "text-gray-400"
                }`}
              >
                Tổng người dùng
              </p>
              <h3 className="text-3xl font-black mt-1">{usersCount}</h3>
            </div>
            <div
              className={`p-3 rounded-2xl ${
                activeTab === "user" ? "bg-white/20 text-white" : "bg-orange-50 text-orange-500"
              }`}
            >
              <Users className="w-7 h-7" />
            </div>
          </div>
          <p
            className={`text-xs font-medium mt-3 ${
              activeTab === "user" ? "text-white/90" : "text-gray-500"
            }`}
          >
            Tài khoản khách hàng đã đăng ký
          </p>
        </div>

        {/* Card Restaurants */}
        <div
          onClick={() => setActiveTab("restaurant")}
          className={`p-5 rounded-3xl cursor-pointer transition-all border ${
            activeTab === "restaurant"
              ? "bg-gradient-to-br from-orange-500 to-amber-500 text-white border-orange-500 shadow-lg shadow-orange-500/20 scale-[1.01]"
              : "bg-white text-gray-800 border-gray-100 hover:border-orange-200 hover:shadow-md"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-xs font-bold uppercase tracking-wider ${
                  activeTab === "restaurant" ? "text-white/80" : "text-gray-400"
                }`}
              >
                Nhà hàng đối tác
              </p>
              <h3 className="text-3xl font-black mt-1">{restaurantCount}</h3>
            </div>
            <div
              className={`p-3 rounded-2xl ${
                activeTab === "restaurant" ? "bg-white/20 text-white" : "bg-orange-50 text-orange-500"
              }`}
            >
              <Store className="w-7 h-7" />
            </div>
          </div>
          <p
            className={`text-xs font-medium mt-3 ${
              activeTab === "restaurant" ? "text-white/90" : "text-gray-500"
            }`}
          >
            Đối tác kinh doanh nhà hàng
          </p>
        </div>

        {/* Card Shippers */}
        <div
          onClick={() => setActiveTab("shipper")}
          className={`p-5 rounded-3xl cursor-pointer transition-all border ${
            activeTab === "shipper"
              ? "bg-gradient-to-br from-orange-500 to-amber-500 text-white border-orange-500 shadow-lg shadow-orange-500/20 scale-[1.01]"
              : "bg-white text-gray-800 border-gray-100 hover:border-orange-200 hover:shadow-md"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-xs font-bold uppercase tracking-wider ${
                  activeTab === "shipper" ? "text-white/80" : "text-gray-400"
                }`}
              >
                Tài xế giao hàng
              </p>
              <h3 className="text-3xl font-black mt-1">{shipperCount}</h3>
            </div>
            <div
              className={`p-3 rounded-2xl ${
                activeTab === "shipper" ? "bg-white/20 text-white" : "bg-orange-50 text-orange-500"
              }`}
            >
              <Truck className="w-7 h-7" />
            </div>
          </div>
          <p
            className={`text-xs font-medium mt-3 ${
              activeTab === "shipper" ? "text-white/90" : "text-gray-500"
            }`}
          >
            Tài xế vận chuyển đơn hàng
          </p>
        </div>
      </div>

      {/* Tabs Switch Bar & Filter */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* 3 Tab Toggle Buttons */}
        <div className="flex items-center p-1.5 bg-gray-100/80 rounded-2xl max-w-lg w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab("user")}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === "user"
                ? "bg-white text-orange-600 shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Người Dùng ({usersCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("restaurant")}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === "restaurant"
                ? "bg-white text-orange-600 shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Nhà Hàng ({restaurantCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("shipper")}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === "shipper"
                ? "bg-white text-orange-600 shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Shipper ({shipperCount})</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={
              activeTab === "user"
                ? "Tìm theo tên, email, SĐT..."
                : activeTab === "restaurant"
                ? "Tìm tên nhà hàng, chủ nhà hàng..."
                : "Tìm shipper theo tên, email, SĐT..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div>
        {err ? (
          <ErrorSpinner message={err} onRetry={handleRefresh} />
        ) : loading ? (
          <LoadingSpinner message="Đang tải dữ liệu..." />
        ) : activeTab === "user" ? (
          <UserSubCPN
            searchTerm={searchTerm}
            onEdit={handleOpenEdit}
            onDelete={handleOpenDelete}
          />
        ) : activeTab === "restaurant" ? (
          <RestaurantCPN
            searchTerm={searchTerm}
            onEdit={handleOpenEditRestaurant}
            onDelete={handleOpenDeleteRestaurant}
          />
        ) : (
          <ShipperCPN
            searchTerm={searchTerm}
            onEdit={handleOpenEditShipper}
            onDelete={handleOpenDeleteShipper}
          />
        )}
      </div>

      {/* Modal Thêm Người Dùng Mới Dùng Chung */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Thêm Người Dùng Mới"
        description="Nhập thông tin cá nhân để tạo tài khoản người dùng mới vào hệ thống"
        maxWidth="lg"
      >
        {addError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5 text-red-600 text-xs font-semibold animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{addError}</span>
          </div>
        )}

        <form onSubmit={handleAddUser} className="space-y-4">
          {/* Họ và tên */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                placeholder="Nhập họ và tên"
                value={dataAddUser.FullName}
                onChange={(e) =>
                  setDataAddUser({ ...dataAddUser, FullName: e.target.value })
                }
                className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
              />
            </div>
          </div>

          {/* Tên đăng nhập & Mật khẩu (2 cột) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Tên đăng nhập <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <AtSign className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Username"
                  value={dataAddUser.UserName}
                  onChange={(e) =>
                    setDataAddUser({ ...dataAddUser, UserName: e.target.value })
                  }
                  className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Nhập mật khẩu"
                  value={dataAddUser.Password}
                  onChange={(e) =>
                    setDataAddUser({ ...dataAddUser, Password: e.target.value })
                  }
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Số điện thoại & Email (2 cột) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  required
                  placeholder="Số điện thoại"
                  value={dataAddUser.NumberPhone}
                  onChange={(e) =>
                    setDataAddUser({ ...dataAddUser, NumberPhone: e.target.value })
                  }
                  className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={dataAddUser.Email}
                  onChange={(e) =>
                    setDataAddUser({ ...dataAddUser, Email: e.target.value })
                  }
                  className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Nhóm Nút Hành Động */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
            <button
              type="button"
              disabled={isSubmittingAdd}
              onClick={() => setIsAddModalOpen(false)}
              className="px-5 py-2.5 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
            >
              Hủy Bỏ
            </button>

            <button
              type="submit"
              disabled={isSubmittingAdd}
              className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-sm font-bold rounded-2xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmittingAdd ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang khởi tạo...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Thêm Người Dùng</span>
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Chỉnh Sửa Thông Tin Người Dùng Dùng Chung */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Chỉnh Sửa Thông Tin Người Dùng"
        description={`Cập nhật thông tin cho tài khoản #${dataUpdateUser.UserId}`}
        maxWidth="lg"
      >
        {updateError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5 text-red-600 text-xs font-semibold animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{updateError}</span>
          </div>
        )}

        <form onSubmit={handleUpdateUser} className="space-y-4">
          {/* Họ và tên */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Họ và tên
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                placeholder="Nhập họ và tên"
                value={dataUpdateUser.FullName}
                onChange={(e) =>
                  setDataUpdateUser({ ...dataUpdateUser, FullName: e.target.value })
                }
                className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
              />
            </div>
          </div>

          {/* Tên đăng nhập & Số điện thoại (2 cột) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Tên đăng nhập
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <AtSign className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Username"
                  value={dataUpdateUser.UserName}
                  onChange={(e) =>
                    setDataUpdateUser({ ...dataUpdateUser, UserName: e.target.value })
                  }
                  className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Số điện thoại
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  required
                  placeholder="Số điện thoại"
                  value={dataUpdateUser.NumberPhone}
                  onChange={(e) =>
                    setDataUpdateUser({ ...dataUpdateUser, NumberPhone: e.target.value })
                  }
                  className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                placeholder="Email"
                value={dataUpdateUser.Email}
                onChange={(e) =>
                  setDataUpdateUser({ ...dataUpdateUser, Email: e.target.value })
                }
                className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
              />
            </div>
          </div>

          {/* Nhóm Nút Hành Động */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setIsEditModalOpen(false)}
              className="px-5 py-2.5 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
            >
              Hủy Bỏ
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-sm font-bold rounded-2xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <span>Lưu Thay Đổi</span>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Xác Nhận Xóa Người Dùng */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Xác Nhận Xóa Người Dùng"
        description="Hành động này sẽ xóa vĩnh viễn tài khoản người dùng khỏi hệ thống và không thể hoàn tác."
        maxWidth="md"
      >
        {deleteError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5 text-red-600 text-xs font-semibold animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{deleteError}</span>
          </div>
        )}

        {userToDelete && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl space-y-2.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Mã tài khoản (ID):</span>
                <span className="font-bold text-gray-900">#{userToDelete.UserId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Họ và tên:</span>
                <span className="font-bold text-gray-900">{userToDelete.FullName || "Chưa cập nhật"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Tên đăng nhập:</span>
                <span className="font-mono text-xs font-bold text-orange-600">@{userToDelete.UserName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Email:</span>
                <span className="font-medium text-gray-800">{userToDelete.Email || "N/A"}</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-center gap-2.5 text-amber-800 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Bạn có chắc chắn muốn xóa tài khoản này không?</span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
              <button
                type="button"
                disabled={isSubmittingDelete}
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-5 py-2.5 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
              >
                Hủy Bỏ
              </button>

              <button
                type="button"
                disabled={isSubmittingDelete}
                onClick={handleDeleteUser}
                className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-sm font-bold rounded-2xl shadow-lg shadow-red-500/25 hover:shadow-red-500/35 transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmittingDelete ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang xóa...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Xác Nhận Xóa</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Thêm Nhà Hàng Mới Dùng Chung */}
      <Modal
        isOpen={isAddResModalOpen}
        onClose={() => setIsAddResModalOpen(false)}
        title="Thêm Nhà Hàng Đối Tác Mới"
        description="Nhập thông tin nhà hàng và lựa chọn chủ sở hữu quản lý"
        maxWidth="lg"
      >
        {addResError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5 text-red-600 text-xs font-semibold animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{addResError}</span>
          </div>
        )}

        <form onSubmit={handleAddRestaurant} className="space-y-4">
          {/* Tên nhà hàng */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Tên nhà hàng <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Store className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                placeholder="Nhập tên nhà hàng"
                value={dataAddRes.RestaurantName}
                onChange={(e) =>
                  setDataAddRes({ ...dataAddRes, RestaurantName: e.target.value })
                }
                className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
              />
            </div>
          </div>

          {/* Chọn chủ nhà hàng & Vai trò (2 cột) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Chủ sở hữu (Quản lý) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User className="w-4 h-4" />
                </div>
                <select
                  value={dataAddRes.UserId}
                  onChange={(e) =>
                    setDataAddRes({ ...dataAddRes, UserId: Number(e.target.value) })
                  }
                  className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all cursor-pointer"
                >
                  {dataUsers.map((u) => (
                    <option key={u.UserId} value={u.UserId}>
                      {u.FullName} (@{u.UserName})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Vai trò / Phân loại <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <select
                  value={dataAddRes.RestaurantRole}
                  onChange={(e) =>
                    setDataAddRes({ ...dataAddRes, RestaurantRole: e.target.value })
                  }
                  className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all cursor-pointer"
                >
                  <option value="OWNER">OWNER (Chủ sở hữu)</option>
                  <option value="MANAGER">MANAGER (Quản lý)</option>
                  <option value="PARTNER">PARTNER (Đối tác)</option>
                  <option value="STAFF">STAFF (Nhân viên)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Địa chỉ nhà hàng */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Địa chỉ nhà hàng <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Nhập địa chỉ nhà hàng"
                value={dataAddRes.Addresses}
                onChange={(e) =>
                  setDataAddRes({ ...dataAddRes, Addresses: e.target.value })
                }
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
            <button
              type="button"
              disabled={isSubmittingAddRes}
              onClick={() => setIsAddResModalOpen(false)}
              className="px-5 py-2.5 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
            >
              Hủy Bỏ
            </button>

            <button
              type="submit"
              disabled={isSubmittingAddRes}
              className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-sm font-bold rounded-2xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmittingAddRes ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang thêm...</span>
                </>
              ) : (
                <>
                  <Store className="w-4 h-4" />
                  <span>Thêm Nhà Hàng</span>
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Chỉnh Sửa Nhà Hàng Dùng Chung */}
      <Modal
        isOpen={isEditResModalOpen}
        onClose={() => setIsEditResModalOpen(false)}
        title="Chỉnh Sửa Thông Tin Nhà Hàng"
        description={`Cập nhật thông tin đối tác nhà hàng #${dataUpdateRes.RestaurantId}`}
        maxWidth="lg"
      >
        {editResError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5 text-red-600 text-xs font-semibold animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{editResError}</span>
          </div>
        )}

        <form onSubmit={handleUpdateRestaurant} className="space-y-4">
          {/* Tên nhà hàng */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Tên nhà hàng
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Store className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                placeholder="Tên nhà hàng"
                value={dataUpdateRes.RestaurantName}
                onChange={(e) =>
                  setDataUpdateRes({ ...dataUpdateRes, RestaurantName: e.target.value })
                }
                className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
              />
            </div>
          </div>

          {/* Chọn chủ nhà hàng & Vai trò (2 cột) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Chủ sở hữu (Quản lý)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User className="w-4 h-4" />
                </div>
                <select
                  value={dataUpdateRes.UserId}
                  onChange={(e) =>
                    setDataUpdateRes({ ...dataUpdateRes, UserId: Number(e.target.value) })
                  }
                  className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all cursor-pointer"
                >
                  {dataUsers.map((u) => (
                    <option key={u.UserId} value={u.UserId}>
                      {u.FullName} (@{u.UserName})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Vai trò / Phân loại <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <select
                  value={dataUpdateRes.RestaurantRole}
                  onChange={(e) =>
                    setDataUpdateRes({ ...dataUpdateRes, RestaurantRole: e.target.value })
                  }
                  className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all cursor-pointer"
                >
                  <option value="OWNER">OWNER (Chủ sở hữu)</option>
                  <option value="MANAGER">MANAGER (Quản lý)</option>
                  <option value="PARTNER">PARTNER (Đối tác)</option>
                  <option value="STAFF">STAFF (Nhân viên)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Địa chỉ nhà hàng */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Địa chỉ nhà hàng
            </label>
            <input
              type="text"
              required
              placeholder="Địa chỉ"
              value={dataUpdateRes.Addresses}
              onChange={(e) =>
                setDataUpdateRes({ ...dataUpdateRes, Addresses: e.target.value })
              }
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
            <button
              type="button"
              disabled={isSubmittingEditRes}
              onClick={() => setIsEditResModalOpen(false)}
              className="px-5 py-2.5 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
            >
              Hủy Bỏ
            </button>

            <button
              type="submit"
              disabled={isSubmittingEditRes}
              className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-sm font-bold rounded-2xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmittingEditRes ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <span>Lưu Thay Đổi</span>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Xác Nhận Xóa Nhà Hàng Dùng Chung */}
      <Modal
        isOpen={isDeleteResModalOpen}
        onClose={() => setIsDeleteResModalOpen(false)}
        title="Xác Nhận Xóa Nhà Hàng"
        description="Hành động này sẽ xóa vĩnh viễn nhà hàng đối tác khỏi hệ thống và không thể hoàn tác."
        maxWidth="md"
      >
        {deleteResError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5 text-red-600 text-xs font-semibold animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{deleteResError}</span>
          </div>
        )}

        {restaurantToDelete && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl space-y-2.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Mã nhà hàng (ID):</span>
                <span className="font-bold text-gray-900">#{restaurantToDelete.RestaurantId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Tên nhà hàng:</span>
                <span className="font-bold text-gray-900">{restaurantToDelete.RestaurantName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Chủ sở hữu:</span>
                <span className="font-medium text-orange-600">{restaurantToDelete.FullName || "N/A"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Địa chỉ:</span>
                <span className="font-medium text-gray-800 line-clamp-1">{restaurantToDelete.Addresses || "N/A"}</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-center gap-2.5 text-amber-800 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Bạn có chắc chắn muốn xóa nhà hàng đối tác này không?</span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
              <button
                type="button"
                disabled={isSubmittingDeleteRes}
                onClick={() => setIsDeleteResModalOpen(false)}
                className="px-5 py-2.5 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
              >
                Hủy Bỏ
              </button>

              <button
                type="button"
                disabled={isSubmittingDeleteRes}
                onClick={handleDeleteRestaurant}
                className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-sm font-bold rounded-2xl shadow-lg shadow-red-500/25 hover:shadow-red-500/35 transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmittingDeleteRes ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang xóa...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Xác Nhận Xóa</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Thêm Shipper Mới Dùng Chung */}
      <Modal
        isOpen={isAddShipperModalOpen}
        onClose={() => setIsAddShipperModalOpen(false)}
        title="Thêm Tài Xế Giao Hàng (Shipper) Mới"
        description="Nhập thông tin cá nhân để tạo tài khoản tài xế mới trong hệ thống"
        maxWidth="lg"
      >
        {addShipperError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5 text-red-600 text-xs font-semibold animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{addShipperError}</span>
          </div>
        )}

        <form onSubmit={handleAddShipper} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                placeholder="Nhập họ và tên tài xế"
                value={dataAddShipper.FullName}
                onChange={(e) =>
                  setDataAddShipper({ ...dataAddShipper, FullName: e.target.value })
                }
                className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Tên đăng nhập <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <AtSign className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Username"
                  value={dataAddShipper.UserName}
                  onChange={(e) =>
                    setDataAddShipper({ ...dataAddShipper, UserName: e.target.value })
                  }
                  className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showShipperPassword ? "text" : "password"}
                  required
                  placeholder="Nhập mật khẩu"
                  value={dataAddShipper.Password}
                  onChange={(e) =>
                    setDataAddShipper({ ...dataAddShipper, Password: e.target.value })
                  }
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowShipperPassword(!showShipperPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showShipperPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  required
                  placeholder="Số điện thoại"
                  value={dataAddShipper.NumberPhone}
                  onChange={(e) =>
                    setDataAddShipper({ ...dataAddShipper, NumberPhone: e.target.value })
                  }
                  className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={dataAddShipper.Email}
                  onChange={(e) =>
                    setDataAddShipper({ ...dataAddShipper, Email: e.target.value })
                  }
                  className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
            <button
              type="button"
              disabled={isSubmittingAddShipper}
              onClick={() => setIsAddShipperModalOpen(false)}
              className="px-5 py-2.5 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
            >
              Hủy Bỏ
            </button>

            <button
              type="submit"
              disabled={isSubmittingAddShipper}
              className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-sm font-bold rounded-2xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmittingAddShipper ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang khởi tạo...</span>
                </>
              ) : (
                <>
                  <Truck className="w-4 h-4" />
                  <span>Thêm Shipper</span>
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Chỉnh Sửa Shipper Dùng Chung */}
      <Modal
        isOpen={isEditShipperModalOpen}
        onClose={() => setIsEditShipperModalOpen(false)}
        title="Chỉnh Sửa Thông Tin Shipper"
        description={`Cập nhật thông tin cho tài xế #${dataUpdateShipper.ShipperId || dataUpdateShipper.UserId}`}
        maxWidth="lg"
      >
        {editShipperError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5 text-red-600 text-xs font-semibold animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{editShipperError}</span>
          </div>
        )}

        <form onSubmit={handleUpdateShipper} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Họ và tên
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                placeholder="Nhập họ và tên"
                value={dataUpdateShipper.FullName}
                onChange={(e) =>
                  setDataUpdateShipper({ ...dataUpdateShipper, FullName: e.target.value })
                }
                className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Tên đăng nhập
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <AtSign className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Username"
                  value={dataUpdateShipper.UserName}
                  onChange={(e) =>
                    setDataUpdateShipper({ ...dataUpdateShipper, UserName: e.target.value })
                  }
                  className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Số điện thoại
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  required
                  placeholder="Số điện thoại"
                  value={dataUpdateShipper.NumberPhone}
                  onChange={(e) =>
                    setDataUpdateShipper({ ...dataUpdateShipper, NumberPhone: e.target.value })
                  }
                  className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                placeholder="Email"
                value={dataUpdateShipper.Email}
                onChange={(e) =>
                  setDataUpdateShipper({ ...dataUpdateShipper, Email: e.target.value })
                }
                className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
            <button
              type="button"
              disabled={isSubmittingEditShipper}
              onClick={() => setIsEditShipperModalOpen(false)}
              className="px-5 py-2.5 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
            >
              Hủy Bỏ
            </button>

            <button
              type="submit"
              disabled={isSubmittingEditShipper}
              className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-sm font-bold rounded-2xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmittingEditShipper ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <Truck className="w-4 h-4" />
                  <span>Cập Nhật Shipper</span>
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Xác Nhận Xóa Shipper Dùng Chung */}
      <Modal
        isOpen={isDeleteShipperModalOpen}
        onClose={() => setIsDeleteShipperModalOpen(false)}
        title="Xác Nhận Xóa Shipper"
        description="Hành động này sẽ xóa tài xế khỏi danh sách Shipper và hủy quyền tài xế."
        maxWidth="md"
      >
        {deleteShipperError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5 text-red-600 text-xs font-semibold animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{deleteShipperError}</span>
          </div>
        )}

        {shipperToDelete && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl space-y-2.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Mã Shipper:</span>
                <span className="font-bold text-gray-900">#{shipperToDelete.ShipperId || shipperToDelete.UserId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Họ và tên:</span>
                <span className="font-bold text-gray-900">{shipperToDelete.FullName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Username:</span>
                <span className="font-medium text-orange-600">@{shipperToDelete.UserName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Số điện thoại:</span>
                <span className="font-medium text-gray-800">{shipperToDelete.NumberPhone || "N/A"}</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-center gap-2.5 text-amber-800 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Bạn có chắc chắn muốn xóa tài xế này khỏi danh sách Shipper không?</span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
              <button
                type="button"
                disabled={isSubmittingDeleteShipper}
                onClick={() => setIsDeleteShipperModalOpen(false)}
                className="px-5 py-2.5 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
              >
                Hủy Bỏ
              </button>

              <button
                type="button"
                disabled={isSubmittingDeleteShipper}
                onClick={handleDeleteShipper}
                className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-sm font-bold rounded-2xl shadow-lg shadow-red-500/25 hover:shadow-red-500/35 transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmittingDeleteShipper ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang xóa...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Xác Nhận Xóa</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}