import { DbHelpQueryRepo } from "../../../utils/dbHelpQueryRepo"
import sql from "mssql"

export class NavbarRepo {
    async getActiveDeliveryOrder(UserId: string) {
        let query = `
            SELECT TOP 1 
                D.DeliveriesId,
                D.OrderId,
                D.DeliveryStatus
            FROM Deliveries AS D
            INNER JOIN Shipper AS SH ON D.ShipperId = SH.ShipperId
            WHERE 
                SH.UserId = @UserId
                AND D.DeliveryStatus IN ('ACCEPTED', 'ARRIVED_AT_STORE', 'PICKED_UP', 'ARRIVED_AT_BUYER')
            ORDER BY D.CreatedAt DESC;
        `
        return DbHelpQueryRepo.excuteQuery(
            query, [
            { name: "UserId", type: sql.Int, value: UserId }
        ]
        )
    }
}
