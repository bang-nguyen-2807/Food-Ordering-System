"use client"
import { useEffect, useState } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap, // <-- 1. Import useMap từ react-leaflet
    Polyline,
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
// icon shipper
const shipperIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/2972/2972185.png",
    iconSize: [38, 38],
    iconAnchor: [19, 19],
});
// icon restaurant
const restaurantIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/3448/3448609.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
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
    latShip: number;
    lngShip: number;
    latRes : number;
    lngRes : number;
    zoom: number;
    width: string;
    height: string;
}

export default function MapLeaflet({ latShip, lngShip, latRes, lngRes, zoom, width, height }: MapLeafletProps) {
    const isShipValid = typeof latShip === "number" && !isNaN(latShip) && typeof lngShip === "number" && !isNaN(lngShip);
    const isResValid = typeof latRes === "number" && !isNaN(latRes) && typeof lngRes === "number" && !isNaN(lngRes);
    const [routePoint , setRoutePoint] = useState<[number , number][]>([]); 
    const [loading, setLoading] = useState<boolean>(true); // loading for fetch data
    if (!isShipValid || !isResValid) {
        return (
            <div style={{ width: width, height: height }} className="flex items-center justify-center bg-gray-50 text-gray-400 text-sm">
                Đang chờ tọa độ hợp lệ...
            </div>
        );
    }

    const positionShip: [number, number] = [latShip, lngShip];
    const positionRes: [number, number] = [latRes, lngRes];

    // fetch road Shipper to Restaurant or Customer
    useEffect(()=>{
        const fetchRoute = async()=>{
            try{
                setLoading(true);
                const url = `https://router.project-osrm.org/route/v1/driving/${lngShip},${latShip};${lngRes},${latRes}?overview=full&geometries=geojson`;
                const res = await fetch(url);
                const data = await res.json();
                if(data.code === "Ok" && data.routes.length > 0){
                    const route = data.routes[0];
                    const coords : [number , number][] = route.geometry.coordinates.map((coor : [number , number]) => [coor[1], coor[0]]);
                    setRoutePoint(coords);
                }
            }catch(err){
                console.error("Lỗi khi lấy đường đi từ OSRM:", err);
            }finally {
                setLoading(false);
            }
            
        }
        if(lngShip && latShip && lngRes && latRes){
            fetchRoute();
        }
    },[lngShip , latShip , lngRes , latRes])

    return (
        // Đảm bảo thẻ div bọc ngoài có chiều cao cụ thể
        <div style={{ width: width, height: height }}>
            <MapContainer
                center={positionShip}
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

                <Marker position={positionShip} icon={shipperIcon}>
                    <Popup>
                        Vị trí của bạn
                    </Popup>
                </Marker>
                <Marker position={positionRes} icon={restaurantIcon}>
                    <Popup>
                        Vị trí của nhà hàng
                    </Popup>
                </Marker>
                {/* đường viền mờ và đường viền chính màu xanh dương */}
                {routePoint.length > 0 && (
                    <Polyline
                        positions={routePoint}
                        pathOptions={{
                            color: "#003cb3",
                            weight: 9,
                            opacity: 0.3,
                        }}
                    />
                )}
                {routePoint.length > 0 && (
                    <Polyline
                        positions={routePoint}
                        pathOptions={{
                            color: "#0062FF", // Màu xanh dương Grab
                            weight: 6,
                            opacity: 0.9,
                            lineCap: "round",
                            lineJoin: "round",
                        }}
                    />
                )}

                {/* 3. Chèn RecenterMap vào bên trong MapContainer */}
                <RecenterMap lat={latShip} lng={lngShip} />

            </MapContainer>
        </div>
    )
}
