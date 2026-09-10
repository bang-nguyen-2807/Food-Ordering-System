'use server';

export async function fetchAddressFromOSM(lat: number | string, lon: number | string) {
  const latitude = parseFloat(String(lat));
  const longitude = parseFloat(String(lon));

  if (isNaN(latitude) || isNaN(longitude)) return null;

  try {
    // Gọi BigDataCloud (trả về chi tiết các cấp địa danh)
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=vi`,
      { cache: 'no-store' }
    );

    if (!res.ok) return null;

    const data = await res.json();

    // IN TOÀN BỘ RA TERMINAL ĐỂ XEM THỰC TẾ NÓ CÓ GÌ
    console.log('[Địa chỉ chi tiết nhận được]:', JSON.stringify(data, null, 2));

    // Lấy thông tin chi tiết nhất có thể:
    // 1. Tìm tên đường/hẻm hoặc địa điểm phụ
    const informativeNames = data.localityInfo?.informative
      ?.filter((item: any) => item.order >= 5 && item.name)
      ?.map((item: any) => item.name) || [];

    // 2. Tìm phường/xã, quận/huyện, thành phố
    const adminNames = data.localityInfo?.administrative
      ?.map((item: any) => item.name)
      ?.reverse() || [];

    // Ghép lại toàn bộ các cấp địa danh tìm được
    const allParts = Array.from(new Set([...informativeNames, data.locality, ...adminNames])).filter(Boolean);

    const fullText = allParts.join(', ');

    return {
      display_name: fullText || data.locality || 'Không xác định được vị trí chi tiết',
      raw: data,
    };
  } catch (error) {
    console.error('Lỗi lấy địa chỉ:', error);
    return null;
  }
}