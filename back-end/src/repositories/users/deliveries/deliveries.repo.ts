import { DbHelpQueryRepo } from "../../../utils/dbHelpQueryRepo"
import sql from "mssql"
export class DeliveriesRepo{
    async getLocationShipperDelivery(OrderId: string , UserId:string) {// lấy vị trí , thông tin đơn hàng mà shipper đó đang giao đến cho khách hàng 
        let query = `
            SELECT 
                US.FullName AS NameShipper ,
                US.NumberPhone as NumberPhoneShipper,
                S.Latitude as LatShip,
                S.Longitude as LngShip,
                -- Chi tiết đơn hàng
                O.OrderId as CodeOrder,
                O.CreatedAt as TimeCreateOrder,
                -- Gộp danh sách các món thành mảng JSON
                (
                    SELECT 
                        OI.ItemName AS FoodName,
                        OI.Quantity AS Quantity,
                        OI.UnitPrice AS UnitPrice,
                        OI.TotalPrice AS ItemTotalPrice
                    FROM OrderItems AS OI
                    WHERE OI.OrderId = O.OrderId
                    FOR JSON PATH
                ) AS Items,
                O.TotalPrice as TotalPrice
            FROM Shipper as S
            JOIN Deliveries as D
            ON D.ShipperId = S.ShipperId
            JOIN Orders as O
            ON O.OrderId = D.OrderId
            JOIN Users as U
            ON U.UserId = O.UserId
            JOIN Users as US
            ON US.UserId = S.UserId
            JOIN OrderItems as OI
            ON O.OrderId = OI.OrderId
            WHERE O.OrderId = @OrderId AND U.UserId = @UserId
            GROUP BY US.FullName, US.NumberPhone, O.OrderId, O.CreatedAt, S.Latitude ,S.Longitude, O.TotalPrice;
        `
        return DbHelpQueryRepo.excuteQuery(query , [
            {name : "OrderId" , type : sql.Int , value : OrderId},
            {name : "UserId" , type : sql.Int , value : UserId}
        ]);
    }
    async getAddressUserPlaceOrder(OrderId: string , UserId:string) {// lấy địa chỉ của người đặt hàng 
        let query = `
            SELECT UA.Addresses as AddressUsersPlaceOrder FROM UserAddress as UA
            JOIN Users as U
            ON UA.UserId = U.UserId
            JOIN Orders as O
            ON O.UserId = U.UserId
            WHERE O.OrderId = @OrderId AND U.UserId = @UserId
        `
        return DbHelpQueryRepo.excuteQuery(query , [
            {name : "OrderId" , type : sql.Int , value : OrderId},
            {name : "UserId" , type : sql.Int , value : UserId}
        ]);
    }
    async getStatusDeliveries(OrderId: string , UserId:string){// lấy trạng thái của đơn hàng 
        let query = `
            SELECT D.DeliveryStatus as DeliveryStatus FROM Deliveries as D
            JOIN Orders as O
            ON O.OrderId = D.OrderId
            JOIN Users as U
            ON U.UserId = O.UserId
            WHERE U.UserId = @UserId AND O.OrderId = @OrderId
        `
        return DbHelpQueryRepo.excuteQuery(query , [
            {name : "OrderId" , type : sql.Int , value : OrderId},
            {name : "UserId" , type : sql.Int , value : UserId}
        ]);
    }
}