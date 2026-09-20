"use client"
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchAddAddressUser, getInfoUser, getAddressUser, deleteAddressUser, updateInfoUser } from "@/features/users/infoUser/infoUserSlice";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/spinner/loading";
import ErrorSpinner from "@/components/spinner/error";
import Modal from "@/components/modal/modal";

export default function InfoUserCPN() {
    const dispatch = useDispatch<AppDispatch>();
    const { err, loading, addresses, infoUser } = useSelector((state: RootState) => state.infoUser);
    const { user } = useSelector((state: RootState) => state.login);
    const UserId = user?.UserId;
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
    if (loading) {
        return <LoadingSpinner />
    }
    if (err) {
        return <ErrorSpinner message={err} />
    }
    return (
        <>
            <div>
                <h2>Thông tin cá nhân</h2>
                {/* Nút kích hoạt mở modal */}
                <button className="border-2 border-gray-300 rounded-md p-2" onClick={handleOpenModalEditInfoUser}>Edit</button>
                {infoUser.map((info, index) => (
                    <div key={index}>
                        <p>Họ và tên : {info.FullName}</p>
                        <p>Số điện thoại : {info.NumberPhone}</p>
                        <p>Email : {info.Email}</p>
                    </div>
                ))}
            </div>
            <div>
                <h2>Thêm địa chỉ</h2>
                <button className="border-2 border-gray-300 rounded-md p-2" onClick={handleOpenModalAddAddress}>Add Address</button>
            </div>
            <div>
                <h2>List Address</h2>
                <ul>
                    {addresses.map((address) => (
                        <div key={address.UserAddressId}>{address.AddressName} - {address.Addresses}<button onClick={() => handleDeleteAddress(address.UserAddressId)}>Delete</button></div>
                    ))}
                </ul>
            </div>
            {/* Modal Update information user */}
            <Modal isOpen={isOpenModalEditUser} onClose={()=>setIsOpenModalEditUser(false)} title="cập nhật thông tin cá nhân" maxWidth="md">
                <div>
                    <div>
                        <label htmlFor="">Họ và tên</label>
                        <input className="border-2 border-gray-300 rounded-md p-2" type="text" value={editFullName} onChange={(e)=>setEditFullName(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="">Số điện thoại</label>
                        <input className="border-2 border-gray-300 rounded-md p-2" type="text" value={editNumberPhone} onChange={(e)=>setEditNumberPhone(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="">Email</label>
                        <input className="border-2 border-gray-300 rounded-md p-2" type="text" value={editEmail} onChange={(e)=>setEditEmail(e.target.value)} />
                    </div>
                    <button onClick={handleSaveInfoUser}>Lưu</button>
                </div>
            </Modal>
            {/* Modal Add Address */}
            <Modal isOpen={isOpenModalAddAddress} onClose={()=>setIsOpenModalAddAddress(false)} title="Thêm địa chỉ" maxWidth="md">
                <div>
                    <div>
                        <label htmlFor="">Tên địa chỉ</label>
                        <input className="border-2 border-gray-300 rounded-md p-2" type="text" value={AddressName} onChange={(e)=>setAddressName(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="">Địa chỉ chi tiết</label>
                        <input className="border-2 border-gray-300 rounded-md p-2" type="text" value={Addresses} onChange={(e)=>setAddresses(e.target.value)} />
                    </div>
                    <button onClick={handleAddAddress}>Thêm</button>
                </div>
            </Modal>
        </>
    )
}