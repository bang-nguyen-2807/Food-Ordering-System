import { Request } from "express";
import { connnectDB } from "../../../config/database";
import sql from "mssql"
export class UserRepo{
    async User(){ // get infomation user
        const pool = await connnectDB();
        let query=`
            SELECT U.UserId, U.FullName, U.UserName, U.NumberPhone, U.Email, STRING_AGG(UA.Addresses, ', ') AS Addresses, STRING_AGG(UA.AddressName, ', ') AS AddressNames
            FROM Users as U
            LEFT JOIN UserAddress as UA
            ON UA.UserId = U.UserId
            GROUP BY U.UserId, U.FullName, U.UserName, U.NumberPhone, U.Email 
            ORDER BY U.UserId
        `
        const result = await pool.request().query(query)
        return result.recordset
    }
    async Restaurant(){
        const pool = await connnectDB();
        let query = `
            SELECT R.RestaurantId , R.RestaurantName , U.FullName , R.Addresses , RM.RestaurantRole FROM RestaurantManagers as RM
            JOIN Restaurants as R
            ON RM.RestaurantId = R.RestaurantId
            JOIN Users as U
            ON RM.UserId = U.UserId
            ORDER BY R.RestaurantId
        `
        const result = await pool.request().query(query)
        return result.recordset
    }
    async Shipper(){
        const pool = await connnectDB();
        let query = `
            SELECT SH.ShipperId, SH.UserId, U.FullName, U.UserName, U.NumberPhone, U.Email FROM Shipper AS SH
            JOIN Users AS U
            ON U.UserId = SH.UserId
            GROUP BY SH.ShipperId, SH.UserId, U.FullName, U.UserName, U.NumberPhone, U.Email 
            ORDER BY SH.ShipperId
        `
        const result = await pool.request().query(query)
        return result.recordset
    }
    // Thêm thông tin user
    async addUser(req : Request){
        const body = req.body;
        const {FullName , UserName , Password , NumberPhone , Email} = body;
        const pool = await connnectDB()
        let query = `
            INSERT INTO Users (FullName , UserName , Password , NumberPhone , Email)
            VALUES (@FullName , @UserName , @Password , @NumberPhone , @Email)
        `
        const res = await pool.request()
        .input("FullName" , sql.NVarChar(255) , FullName)
        .input("UserName" , sql.VarChar(90) , UserName)
        .input("Password" , sql.VarChar(255) , Password)
        .input("NumberPhone" , sql.VarChar(20) ,  NumberPhone )
        .input("Email" , sql.VarChar(255) ,  Email )
        .query(query)
        return res.rowsAffected[0] > 0;
    }
    // update data in user
    async updateUser(UserId : number , FullName  : string, UserName : string , NumberPhone : string, Email : string){
        const pool = await connnectDB();
        let query = `
            UPDATE Users
            SET FullName = @FullName , 
                UserName = @UserName,
                NumberPhone = @NumberPhone , 
                Email = @Email
            WHERE UserId = @UserId 
        `
        const res = await pool.request()
        .input("UserId" , sql.Int , UserId)
        .input("FullName" , sql.NVarChar(255) , FullName)
        .input("UserName" , sql.VarChar(90) , UserName)
        .input("NumberPhone" , sql.VarChar(20) , NumberPhone)
        .input("Email" , sql.VarChar(255) , Email)
        .query(query)
        return res.rowsAffected[0] > 0;
    }
    // delete data in user
    async deleteUser(UserId : number){
        const pool = await connnectDB();
        let query = `
            DELETE FROM Users
            WHERE UserId = @UserId
        `
        const res = await pool.request()
        .input("UserId" , sql.Int , UserId)
        .query(query);
        return res.rowsAffected[0] > 0;
    }

    // RESTAURANT CRUD 
    // Thêm nhà hàng mới
    async addRestaurant(RestaurantName: string, UserId: number, Addresses: string, RestaurantRole: string) {
        const pool = await connnectDB();
        let queryRes = `
            INSERT INTO Restaurants (RestaurantName, Addresses)
            OUTPUT INSERTED.RestaurantId
            VALUES (@RestaurantName, @Addresses)
        `;
        const resRes = await pool.request()
            .input("RestaurantName", sql.NVarChar(255), RestaurantName)
            .input("Addresses", sql.NVarChar(255), Addresses)
            .query(queryRes);

        const restaurantId = resRes.recordset[0]?.RestaurantId;
        if (!restaurantId) return false;

        let queryRM = `
            INSERT INTO RestaurantManagers (RestaurantId, UserId, RestaurantRole)
            VALUES (@RestaurantId, @UserId, @RestaurantRole)
        `;
        const resRM = await pool.request()
            .input("RestaurantId", sql.Int, restaurantId)
            .input("UserId", sql.Int, UserId)
            .input("RestaurantRole", sql.NVarChar(100), RestaurantRole || "OWNER")
            .query(queryRM);

        return resRM.rowsAffected[0] > 0;
    }

    // Cập nhật nhà hàng
    async updateRestaurant(RestaurantId: number, RestaurantName: string, UserId: number, Addresses: string, RestaurantRole: string) {
        const pool = await connnectDB();
        let queryRes = `
            UPDATE Restaurants
            SET RestaurantName = @RestaurantName,
                Addresses = @Addresses
            WHERE RestaurantId = @RestaurantId
        `;
        await pool.request()
            .input("RestaurantId", sql.Int, RestaurantId)
            .input("RestaurantName", sql.NVarChar(255), RestaurantName)
            .input("Addresses", sql.NVarChar(255), Addresses)
            .query(queryRes);

        // Kiểm tra xem đã có record trong RestaurantManagers chưa
        let checkRM = `SELECT * FROM RestaurantManagers WHERE RestaurantId = @RestaurantId`;
        const checkResult = await pool.request().input("RestaurantId", sql.Int, RestaurantId).query(checkRM);

        if (checkResult.recordset.length > 0) {
            let queryRM = `
                UPDATE RestaurantManagers
                SET UserId = @UserId,
                    RestaurantRole = @RestaurantRole
                WHERE RestaurantId = @RestaurantId
            `;
            await pool.request()
                .input("RestaurantId", sql.Int, RestaurantId)
                .input("UserId", sql.Int, UserId)
                .input("RestaurantRole", sql.NVarChar(100), RestaurantRole)
                .query(queryRM);
        } else {
            let queryRM = `
                INSERT INTO RestaurantManagers (RestaurantId, UserId, RestaurantRole)
                VALUES (@RestaurantId, @UserId, @RestaurantRole)
            `;
            await pool.request()
                .input("RestaurantId", sql.Int, RestaurantId)
                .input("UserId", sql.Int, UserId)
                .input("RestaurantRole", sql.NVarChar(100), RestaurantRole)
                .query(queryRM);
        }
        return true;
    }

    // Xóa nhà hàng
    async deleteRestaurant(RestaurantId: number) {
        const pool = await connnectDB();
        let queryRM = `DELETE FROM RestaurantManagers WHERE RestaurantId = @RestaurantId`;
        await pool.request().input("RestaurantId", sql.Int, RestaurantId).query(queryRM);

        let queryRes = `DELETE FROM Restaurants WHERE RestaurantId = @RestaurantId`;
        const res = await pool.request().input("RestaurantId", sql.Int, RestaurantId).query(queryRes);
        return res.rowsAffected[0] > 0;
    }
    // SHIPPER CRUD
    async addShipper(FullName: string, UserName: string, Password: string, NumberPhone: string, Email: string, UserId?: number) {
        const pool = await connnectDB();

        let targetUserId = UserId;

        if (!targetUserId) {
            // Thêm mới user với SystemRole = 'SHIPPER'
            let queryUser = `
                INSERT INTO Users (FullName, UserName, Password, NumberPhone, Email, SystemRole)
                OUTPUT INSERTED.UserId
                VALUES (@FullName, @UserName, @Password, @NumberPhone, @Email, 'SHIPPER')
            `;
            const resUser = await pool.request()
                .input("FullName", sql.NVarChar(255), FullName)
                .input("UserName", sql.VarChar(90), UserName)
                .input("Password", sql.VarChar(255), Password)
                .input("NumberPhone", sql.VarChar(20), NumberPhone)
                .input("Email", sql.VarChar(255), Email)
                .query(queryUser);

            targetUserId = resUser.recordset[0]?.UserId;
        } else {
            // Cập nhật SystemRole nếu gán từ UserId có sẵn
            let updateRoleQuery = `UPDATE Users SET SystemRole = 'SHIPPER' WHERE UserId = @UserId`;
            await pool.request().input("UserId", sql.Int, targetUserId).query(updateRoleQuery);
        }

        if (!targetUserId) return false;

        // Thêm vào bảng Shipper
        let queryShipper = `
            INSERT INTO Shipper (UserId)
            VALUES (@UserId)
        `;
        const resShipper = await pool.request()
            .input("UserId", sql.Int, targetUserId)
            .query(queryShipper);

        return resShipper.rowsAffected[0] > 0;
    }

    async updateShipper(ShipperId: number, UserId: number, FullName: string, UserName: string, NumberPhone: string, Email: string) {
        const pool = await connnectDB();

        // Cập nhật bảng Users thông tin người dùng / tài xế
        let queryUser = `
            UPDATE Users
            SET FullName = @FullName,
                UserName = @UserName,
                NumberPhone = @NumberPhone,
                Email = @Email
            WHERE UserId = @UserId
        `;
        const resUser = await pool.request()
            .input("UserId", sql.Int, UserId)
            .input("FullName", sql.NVarChar(255), FullName)
            .input("UserName", sql.VarChar(90), UserName)
            .input("NumberPhone", sql.VarChar(20), NumberPhone)
            .input("Email", sql.VarChar(255), Email)
            .query(queryUser);

        return resUser.rowsAffected[0] > 0;
    }

    async deleteShipper(ShipperId: number) {
        const pool = await connnectDB();

        // Lấy UserId của Shipper trước khi xóa
        let getUserIdQuery = `SELECT UserId FROM Shipper WHERE ShipperId = @ShipperId`;
        const userRes = await pool.request().input("ShipperId", sql.Int, ShipperId).query(getUserIdQuery);
        const userId = userRes.recordset[0]?.UserId;

        // Xóa từ bảng Shipper
        let queryShipper = `DELETE FROM Shipper WHERE ShipperId = @ShipperId`;
        const res = await pool.request().input("ShipperId", sql.Int, ShipperId).query(queryShipper);

        if (userId) {
            // Cập nhật lại SystemRole về 'CUSTOMER' cho User
            let resetRoleQuery = `UPDATE Users SET SystemRole = 'CUSTOMER' WHERE UserId = @UserId`;
            await pool.request().input("UserId", sql.Int, userId).query(resetRoleQuery);
        }

        return res.rowsAffected[0] > 0;
    }
}