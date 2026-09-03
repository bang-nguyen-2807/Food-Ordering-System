import { DbHelpQueryRepo } from "../../../utils/dbHelpQueryRepo"
import { Request } from "express";
import sql from "mssql"

export class ManagerMenuRepo {
    async getManagerMenu(UserId: string, CategoriesRestaurantId: string){ // danh sách món trong menu của cửa hàng
        const query = `
            SELECT 
                MI.MenuItemId,
                MI.ImageUrl AS ImageItems,
                MI.NameMenuItems AS NameItems,
                CR.CategoriesRestaurantId,
                CR.CategoriesRestaurantName AS CateName,
                MI.Price AS Amount,
                MI.is_available AS OpenOrClose
            FROM CategoriesRestaurant AS CR
            JOIN Restaurants AS R
                ON CR.RestaurantId = R.RestaurantId
            JOIN RestaurantManagers AS RM 
                ON RM.RestaurantId = R.RestaurantId 
            JOIN Users AS URM
                ON URM.UserId = RM.UserId
            JOIN MenuItems AS MI
                ON MI.CategoriesRestaurantId = CR.CategoriesRestaurantId
            WHERE RM.UserId = @UserId AND (@CategoriesRestaurantId IS NULL OR CR.CategoriesRestaurantId = @CategoriesRestaurantId)
        `
        const categoryIdValue = (CategoriesRestaurantId && CategoriesRestaurantId !== '' && CategoriesRestaurantId !== 'undefined') ? Number(CategoriesRestaurantId) : null;
        return DbHelpQueryRepo.excuteQuery(query , [
            {name : "UserId" , type : sql.Int , value : UserId},
            {name : "CategoriesRestaurantId" , type : sql.Int , value : categoryIdValue}
        ])
    }

    async getCategoriesRestaurant(UserId : string){ // danh sách loại đồ ăn của cửa hàng
        const query = `
            SELECT 
                CR.CategoriesRestaurantId,
                CR.CategoriesRestaurantName
            FROM CategoriesRestaurant AS CR
            JOIN Restaurants AS R
                ON CR.RestaurantId = R.RestaurantId
            JOIN RestaurantManagers AS RM 
                ON RM.RestaurantId = R.RestaurantId 
            JOIN Users AS URM
                ON URM.UserId = RM.UserId
            WHERE RM.UserId = @UserId
        `
        return DbHelpQueryRepo.excuteQuery(query , [
            {name : "UserId" , type : sql.Int , value : UserId}
        ])
    }

    async addMenuItem(req : Request){ // thêm món vào menu
        const query = `
            INSERT INTO MenuItems 
            (CategoriesRestaurantId, NameMenuItems, Price, ImageUrl, is_available)
            VALUES (
                ISNULL(@CategoriesRestaurantId, (
                    SELECT TOP 1 CR.CategoriesRestaurantId
                    FROM CategoriesRestaurant AS CR
                    JOIN Restaurants AS R ON CR.RestaurantId = R.RestaurantId
                    JOIN RestaurantManagers AS RM ON R.RestaurantId = RM.RestaurantId
                    WHERE RM.UserId = @UserId
                )),
                @NameMenuItems,
                @Price,
                @ImageUrl,
                @is_available
            )
        `
        const body = await req.body;
        const {UserId, CategoriesRestaurantId, NameMenuItems, Price, ImageUrl, is_available} = body;
        return DbHelpQueryRepo.excuteNonQuery(query , [
            {name : "CategoriesRestaurantId" , type : sql.Int , value : CategoriesRestaurantId ? Number(CategoriesRestaurantId) : null},
            {name : "UserId" , type : sql.Int , value : UserId},
            {name : "NameMenuItems" , type : sql.NVarChar , value : NameMenuItems},
            {name : "Price" , type : sql.Decimal , value : Price},
            {name : "ImageUrl" , type : sql.NVarChar , value : ImageUrl},
            {name : "is_available" , type : sql.Bit , value : is_available}
        ])
    }

    async addCategoriesRestaurant(req : Request){ // thêm loại đồ ăn mới cho cửa hàng
        const query = `
            INSERT INTO CategoriesRestaurant 
            (RestaurantId, CategoriesRestaurantName, CategorieRestaurantsCode, Descriptions, ImageUrl)
            VALUES (
                (SELECT TOP 1 RestaurantId FROM RestaurantManagers WHERE UserId = @UserId),
                @CategoriesRestaurantName,
                @CategorieRestaurantsCode,
                @Descriptions,
                @ImageUrl
            )
        `
        const body = await req.body;
        const {UserId, CategoriesRestaurantName, CategorieRestaurantsCode, Descriptions, ImageUrl} = body;
        return DbHelpQueryRepo.excuteNonQuery(query , [
            {name : "UserId" , type : sql.Int , value : UserId},
            {name : "CategoriesRestaurantName" , type : sql.NVarChar , value : CategoriesRestaurantName},
            {name : "CategorieRestaurantsCode" , type : sql.VarChar , value : CategorieRestaurantsCode},
            {name : "Descriptions" , type : sql.NVarChar , value : Descriptions},
            {name : "ImageUrl" , type : sql.VarChar , value : ImageUrl}
        ])
    }

    async deleteMenuItem(req : Request){ // xóa món khỏi menu
        const query = `
            DELETE FROM MenuItems
            WHERE MenuItemId = @MenuItemId
        `
        const MenuItemId = req.params.MenuItemId;
        return DbHelpQueryRepo.excuteNonQuery(query , [
            {name : "MenuItemId" , type : sql.Int , value : MenuItemId}
        ])
    }

    async deleteCategoriesRestaurant(req : Request){ // xóa loại đồ ăn của cửa hàng
        const query = `
            DELETE FROM MenuItems WHERE CategoriesRestaurantId = @CategoriesRestaurantId;
            DELETE FROM CategoriesRestaurant WHERE CategoriesRestaurantId = @CategoriesRestaurantId;
        `
        const CategoriesRestaurantId = req.params.CategoriesRestaurantId;
        return DbHelpQueryRepo.excuteNonQuery(query , [
            {name : "CategoriesRestaurantId" , type : sql.Int , value : CategoriesRestaurantId}
        ])
    }

    async updateMenuItem(req : Request){ // cập nhật thông tin món ăn
        const query = `
            UPDATE MenuItems
            SET 
                NameMenuItems = @NameMenuItems,
                Price = @Price,
                ImageUrl = @ImageUrl,
                is_available = @is_available
            WHERE MenuItemId = @MenuItemId
        `
        const body = await req.body;
        const {MenuItemId, NameMenuItems, Price, ImageUrl, is_available} = body;
        return DbHelpQueryRepo.excuteNonQuery(query , [
            {name : "MenuItemId" , type : sql.Int , value : MenuItemId},
            {name : "NameMenuItems" , type : sql.NVarChar , value : NameMenuItems},
            {name : "Price" , type : sql.Decimal , value : Price},
            {name : "ImageUrl" , type : sql.NVarChar , value : ImageUrl},
            {name : "is_available" , type : sql.Bit , value : is_available}
        ])
    }
}