import { DbHelpQueryRepo } from "../../../utils/dbHelpQueryRepo"
import sql from "mssql"
export class HomeRepo {
    async getListRestaurant(lat : string , lng : string) { // lấy danh sách nhà hàng hiện có 
        let query = `
            DECLARE @UserLat DECIMAL(10,7) = @lat;
            DECLARE @UserLng DECIMAL(10,7) = @lng;
            DECLARE @UserLocation geography = geography::Point(@UserLat, @UserLng, 4326);

            SELECT 
                R.RestaurantId, 
                R.RestaurantName, 
                R.ImageUrl, 
                R.Addresses,
                -- 1. Nếu có GPS Location -> Tính theo khoảng cách thực tế
                -- 2. Nếu chưa có GPS -> Tính toán linh hoạt theo RestaurantId để mỗi nhà hàng có thời gian riêng
                CASE 
                    WHEN R.Location IS NOT NULL THEN CAST(10 + CEILING((R.Location.STDistance(@UserLocation) / 1000.0) * 3) AS INT)
                    WHEN R.Latitude IS NOT NULL AND R.Longitude IS NOT NULL THEN CAST(10 + CEILING((geography::Point(R.Latitude, R.Longitude, 4326).STDistance(@UserLocation) / 1000.0) * 3) AS INT)
                    ELSE 12 + ((R.RestaurantId * 7) % 18)
                END AS MinTime,

                CASE 
                    WHEN R.Location IS NOT NULL THEN CAST(20 + CEILING((R.Location.STDistance(@UserLocation) / 1000.0) * 3) AS INT)
                    WHEN R.Latitude IS NOT NULL AND R.Longitude IS NOT NULL THEN CAST(20 + CEILING((geography::Point(R.Latitude, R.Longitude, 4326).STDistance(@UserLocation) / 1000.0) * 3) AS INT)
                    ELSE 22 + ((R.RestaurantId * 7) % 18)
                END AS MaxTime
            FROM Restaurants as R;
        `;
        return DbHelpQueryRepo.excuteQuery(query, [
            {name : "lat" ,  type: sql.Decimal(10, 7), value : lat},
            {name : "lng" ,  type: sql.Decimal(10, 7), value : lng},
        ]);
    }
    async getListCatagories() { // lấy danh sách loại đồ ăn toàn hệ thống
        let query = `SELECT C.CategoriesName , C.CategoriesCode , C.CategoriesId FROM Categories AS C`
        return DbHelpQueryRepo.excuteQuery(query, []);
    }
}
