import { Request } from "express"
import { DbHelpQueryRepo } from "../../../utils/dbHelpQueryRepo"
import sql from "mssql"
export class DashboardRepo {
    async totalOrder(UserId: string) {
        let query = `
            SELECT 
                SH.ShipperId,
                U.FullName AS ShipperName,
                COUNT(D.DeliveriesId) AS TotalOrdersToday,                    -- Tổng số đơn đã giao thành công hôm nay
                ISNULL(SUM(O.DeliveryFee), 0) AS EstimatedRevenueToday,       -- Doanh thu tiền ship tạm tính hôm nay
                ISNULL(SUM(O.TotalPrice), 0) AS TotalOrderValueToday          -- Tổng tiền hàng đã giao (Tiền thu hộ)
            FROM Shipper AS SH
            INNER JOIN Users AS U ON SH.UserId = U.UserId
            INNER JOIN Deliveries AS D ON SH.ShipperId = D.ShipperId
            INNER JOIN Orders AS O ON D.OrderId = O.OrderId
            WHERE 
                SH.UserId = @UserId-- Hoặc SH.ShipperId = @ShipperId
                AND D.DeliveryStatus = 'DELIVERED'                           -- Chỉ tính đơn giao thành công
                AND CAST(D.DeliveryTime AS DATE) = CAST(GETDATE() AS DATE)  -- Lọc trong ngày hôm nay
            GROUP BY 
                SH.ShipperId, 
                U.FullName;
        `
        return DbHelpQueryRepo.excuteQuery(
            query, [
            { name: "UserId", type: sql.Int, value: UserId }
        ]
        )
    }
    async updateShipperLocation(req: Request) {
        let query = `
            EXEC UpdateShipperLocation @UserId = @UserId, @Latitude = @latitude, @Longitude = @longitude;
        `
        const UserId = req.body.UserId as string;
        const longitude = req.body.longitude as string;
        const latitude = req.body.latitude as string;
        return DbHelpQueryRepo.excuteNonQuery(
            query, [
            { name: "UserId", type: sql.Int, value: UserId },
            { name: "latitude", type: sql.Decimal(10, 7), value: latitude },
            { name: "longitude", type: sql.Decimal(10, 7), value: longitude }
        ]
        )
    }

    async getAvailableDeliveries(UserId: string, radiusMeter?: number) {// lấy đơn hàng gần nhất
        let query = `
            EXEC GetAvailableDeliveries @UserId = @UserId, @RadiusMeter = @RadiusMeter;
        `
        return DbHelpQueryRepo.excuteQuery(
            query, [
            { name: "UserId", type: sql.Int, value: UserId },
            { name: "RadiusMeter", type: sql.Int, value: radiusMeter ?? 5000 }
        ]
        )
    }
}