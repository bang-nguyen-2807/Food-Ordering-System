// 'use server'

export default async function ShipperLocation(lat: string, lng: string, apiKey: string) {
  if (!lat || !lng || !apiKey) return "";

  try {
    const res = await fetch(
      `https://geocode.maps.co/reverse?lat=${lat}&lon=${lng}&api_key=${apiKey}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      console.error("Lỗi HTTP maps.co:", res.status);
      return "";
    }

    const data = await res.json();

    // 1. Ưu tiên lấy trực tiếp từ root (rất an toàn)
    if (data?.locality && data?.city) {
      return `${data.locality}, ${data.city}`;
    }

    // 2. Nếu có mảng administrative bên trong localityInfo
    const adminList = data?.localityInfo?.administrative;
    if (Array.isArray(adminList) && adminList.length > 0) {
      const lastItem = adminList[adminList.length - 1];
      if (lastItem?.name) {
        return `${lastItem.name}, ${data?.city || data?.principalSubdivision || ""}`;
      }
    }

    // 3. Fallback cuối cùng nếu các trường trên không có
    return data?.display_name || data?.city || data?.principalSubdivision || "Đà Nẵng";
    
  } catch (error) {
    console.error("Lỗi khi lấy địa chỉ:", error);
    return "";
  }
}