// API endpoint
// https://photon.komoot.io/api/?q=<ĐỊA_CHỈ>&limit=1&lang=vi
// => GeoJSON format:
// {
//     "features": [
//         {
//             "geometry": {
//                 "coordinates": [108.2169, 16.0665]  // [longitude, latitude]
//             },
//             "properties": {
//                 "name": "Dũng Sĩ Thanh Khê",
//                 "city": "Đà Nẵng",
//                 "country": "Việt Nam"
//             }
//         }
//     ]
// }
// Photon API (https://photon.komoot.io) - Miễn phí, không cần API key, không bị CORS
// Thuật toán Fallback 4 nấc tự động xử lý các địa chỉ tiếng Việt phức tạp

export async function GeocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
    try {
        const fetchPhoton = async (query: string) => {
            if (!query || !query.trim()) return null;
            const encoded = encodeURIComponent(query.trim());
            const url = `https://photon.komoot.io/api/?q=${encoded}&limit=1`;
            const res = await fetch(url);
            if (!res.ok) return null;
            const data = await res.json();
            if (data.features && data.features.length > 0) {
                const [lng, lat] = data.features[0].geometry.coordinates; // Photon trả về [longitude, latitude]
                return { lat, lng };
            }
            return null;
        };

        // Nấc 1: Thử địa chỉ gốc đầy đủ từ DB
        let result = await fetchPhoton(address);
        if (result) return result;

        // Nấc 2: Loại bỏ từ gây nhiễu địa giới hành chính (Phường..., Quận..., Xã..., Huyện...)
        // VD: "90, Dũng Sĩ Thanh Khê, Phường Thanh Khê Đông, Quận Thanh Khê, Đà Nẵng, Việt Nam"
        //  -> "90 Dũng Sĩ Thanh Khê Đà Nẵng Việt Nam"
        const cleanedNoDistrict = address
            .replace(/Phường\s+[^,]+,?/gi, '')
            .replace(/Quận\s+[^,]+,?/gi, '')
            .replace(/Xã\s+[^,]+,?/gi, '')
            .replace(/Huyện\s+[^,]+,?/gi, '')
            .replace(/,/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        
        result = await fetchPhoton(cleanedNoDistrict);
        if (result) return result;

        // Nấc 3: Kết hợp Tên đường (đoạn đầu) + Thành phố / Tỉnh (đoạn cuối)
        const parts = address.split(',').map(p => p.trim()).filter(Boolean);
        if (parts.length >= 2) {
            const street = parts[0];
            const city = parts.find(p => /đà nẵng|hồ chí minh|hà nội|cần thơ|hải phòng|bình dương|đồng nai/i.test(p)) 
                || parts[parts.length - 2] 
                || parts[parts.length - 1];
            result = await fetchPhoton(`${street} ${city}`);
            if (result) return result;
        }

        // Nấc 4: Tên đường bỏ số nhà + Thành phố
        if (parts.length >= 1) {
            const streetWithoutNum = parts[0].replace(/^\d+[a-zA-Z/]*[\s,]*/, '');
            const city = parts[parts.length - 2] || parts[parts.length - 1];
            result = await fetchPhoton(`${streetWithoutNum} ${city}`);
            if (result) return result;
        }

        return null;
    } catch (error) {
        console.error("Geocoding lỗi:", error);
        return null;
    }
}