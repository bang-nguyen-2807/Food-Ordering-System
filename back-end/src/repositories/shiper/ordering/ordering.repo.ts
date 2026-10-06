import { Request } from "express";
import { DbHelpQueryRepo } from "../../../utils/dbHelpQueryRepo"
import sql from "mssql"
export class OrderingRepo {
    async StatusOrder(UserId: string, OrderId: string) {
        let query = `
            SELECT 
                d.DeliveryStatus AS DeliveryStatus,
                us.FullName AS CustomerName,
                us.NumberPhone AS CustomerPhone,
                o.DeliveryAddress AS DeliveryAddress,
                o.TotalPrice AS TotalMoneyToCollect, -- Tổng tiền cần thu khách
                STRING_AGG(
                    CONCAT(oi.Quantity, 'x ', oi.ItemName, ' (', CAST(oi.TotalPrice AS INT), 'đ)'), 
                    CHAR(10) -- CHAR(10) để xuống dòng giữa các món
                ) AS ItemsSummary
            FROM Deliveries AS d
            INNER JOIN Shipper AS s ON s.ShipperId = d.ShipperId
            INNER JOIN Users AS u ON u.UserId = s.UserId
            INNER JOIN Orders AS o ON d.OrderId = o.OrderId
            INNER JOIN Users AS us ON us.UserId = o.UserId
            INNER JOIN OrderItems AS oi ON o.OrderId = oi.OrderId
            WHERE u.UserId = @UserId AND o.OrderId = @OrderId
            GROUP BY 
                d.DeliveryStatus,
                us.FullName,
                us.NumberPhone,
                o.DeliveryAddress,
                o.TotalPrice;
        `
        return DbHelpQueryRepo.excuteQuery(query, [
            { name: "UserId", type: sql.Int, value: UserId },
            { name: "OrderId", type: sql.Int, value: OrderId }
        ]);
    }

    async UpdateNextStatusOrder(req : Request) { // update status deliveries for shipper
        const {OrderId , UserId} = req.body
        let query = `
            DECLARE @ShipperId INT;
            SELECT @ShipperId = ShipperId from Shipper 
            WHERE UserId = @UserId;

            UPDATE Deliveries 
            SET DeliveryStatus = CASE DeliveryStatus
            WHEN 'ACCEPTED' THEN 'ARRIVED_AT_STORE'
            WHEN 'ARRIVED_AT_STORE' THEN 'PICKED_UP'
            WHEN 'PICKED_UP'        THEN 'ARRIVED_AT_BUYER'
            WHEN 'ARRIVED_AT_BUYER' THEN 'DELIVERED'
            ELSE DeliveryStatus
            END,
            PickupTime = CASE WHEN DeliveryStatus = 'ARRIVED_AT_STORE' THEN GETDATE() ELSE PickupTime
            END
            WHERE OrderId = @OrderId And ShipperId = @ShipperId
            UPDATE O 
            SET O.OrderStatus = CASE
            WHEN D.DeliveryStatus = 'PICKED_UP' THEN 'DELIVERING'
            WHEN D.DeliveryStatus = 'DELIVERED' THEN 'COMPLETED'
            ELSE O.OrderStatus
            END
            FROM Orders as O
            INNER JOIN Deliveries D ON O.OrderId = D.OrderId
            WHERE O.OrderId = @OrderId
        `
        return DbHelpQueryRepo.excuteNonQuery(query, [
            { name: "UserId", type: sql.Int, value: UserId },
            { name: "OrderId", type: sql.Int, value: OrderId }
        ])
    }
    async infoRoute(UserId : string , OrderId : string){// get info route(lộ trình) for shipper deliveries
        let query = `
            SELECT 
                R.RestaurantName AS RestaurantName , 
                R.Addresses as RestaurantAddress ,
                UA.AddressName as UserAddressName , 
                UA.Addresses  as UserAddress
                FROM Orders AS O
            JOIN Restaurants as R
            ON R.RestaurantId = O.RestaurantId
            JOIN UserAddress AS UA
            ON O.UserAddressId = UA.UserAddressId
            JOIN Deliveries as D
            on d.OrderId = O.OrderId
            JOIN Shipper as S
            ON S.ShipperId = D.ShipperId
            Join Users as U
            ON U.UserId = s.UserId

            WHERE O.OrderId = @OrderId AND U.UserId = @UserId
        `
        return DbHelpQueryRepo.excuteQuery(query, [
            { name: "UserId", type: sql.Int, value: UserId },
            { name: "OrderId", type: sql.Int, value: OrderId }
        ]);
    }
    async getLocationRestaurant(OrderId : string){
        let query = `
            SELECT R.Latitude as laRes , R.Longitude as lngRes FROM Restaurants as R
            JOIN Orders AS O
            ON R.RestaurantId = O.RestaurantId
            WHERE O.OrderId = @OrderId
        `
        return DbHelpQueryRepo.excuteQuery(query, [
            { name: "OrderId", type: sql.Int, value: OrderId }
        ]);
    }
    async getStatusOrder(OrderId : string , UserId : string){
        let query = `
            SELECT DeliveryStatus as StatusOrder FROM Deliveries as D
            JOIN Orders AS O
            ON D.OrderId = O.OrderId
            JOIN Shipper as S
            ON S.ShipperId = D.ShipperId
            JOIN Users as U
            ON U.UserId = S.UserId	
            WHERE O.OrderId = @OrderId AND U.UserId = @UserId
        `
        return DbHelpQueryRepo.excuteQuery(query, [
            { name: "OrderId", type: sql.Int, value: OrderId },
            { name: "UserId", type: sql.Int, value: UserId }
        ]);
    }
}