"use client"
import { useEffect } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap // <-- 1. Import useMap từ react-leaflet
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// 2. Tạo Component con phụ trách tự động di chuyển bản đồ khi tọa độ lat/lng thay đổi
function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
    const map = useMap();
    useEffect(() => {
        map.invalidateSize();
        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 300);
        map.setView([lat, lng]);
        return () => clearTimeout(timer);
    }, [lat, lng, map]);
    return null;
}

interface MapLeafletProps {
    lat: number;
    lng: number;
    zoom: number;
    width: string;
    height: string;
}

export default function MapLeaflet({ lat, lng, zoom, width, height }: MapLeafletProps) {
    const position: [number, number] = [lat, lng];

    return (
        // Đảm bảo thẻ div bọc ngoài có chiều cao cụ thể
        <div style={{ width: width, height: height }}>
            <MapContainer
                center={position}
                zoom={zoom}
                style={{
                    width: "100%",
                    height: "100%",
                    zIndex : "1"
                }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.esri.com/">Esri</a> &copy; OpenStreetMap contributors'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
                />

                <Marker position={position}>
                    <Popup>
                        Vị trí của bạn
                    </Popup>
                </Marker>

                {/* 3. Chèn RecenterMap vào bên trong MapContainer */}
                <RecenterMap lat={lat} lng={lng} />

            </MapContainer>
        </div>
    )
}
