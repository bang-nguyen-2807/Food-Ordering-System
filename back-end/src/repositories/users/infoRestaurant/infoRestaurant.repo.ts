import { connnectDB } from "../../../config/database";
import sql from "mssql"
import { DbHelpQueryRepo } from "../../../utils/dbHelpQueryRepo";
export class InfoRestaurantRepo {
    async getInfoRestaurant(RestaurantId : string , CategoriesRestaurantId ?: string) { // get data in restaurant after user click by restaurant 
        let query = `
            SELECT MI.MenuItemId , MI.NameMenuItems , MI.ImageUrl , MI.Price , MI.is_available , CR.CategoriesRestaurantName , CR.CategorieRestaurantsCode , CR.CategoriesRestaurantId , R.RestaurantName FROM MenuItems AS MI
            JOIN CategoriesRestaurant as CR
            ON MI.CategoriesRestaurantId = CR.CategoriesRestaurantId
            JOIN Restaurants as R
            ON R.RestaurantId = CR.RestaurantId
            WHERE R.RestaurantId = @RestaurantId AND MI.is_available = 1 AND (@CategoriesRestaurantId IS NULL OR CR.CategoriesRestaurantId = @CategoriesRestaurantId)
        `
        return DbHelpQueryRepo.excuteQuery(query , [
            {name : "RestaurantId" , type : sql.Int , value : RestaurantId},
            {name : "CategoriesRestaurantId" , type : sql.Int , value : CategoriesRestaurantId == '' ? null : CategoriesRestaurantId}
        ])
    }
    async getListCategoriesRestaurant(RestaurantId : string) { // get data in categories restaurant for click button to filter menuItems
        let query = `
            SELECT c.CategoriesRestaurantName , c.CategoriesRestaurantId FROM CategoriesRestaurant as c
            WHERE c.RestaurantId = @RestaurantId
        `
        return DbHelpQueryRepo.excuteQuery(query , [
            {name : "RestaurantId" , type : sql.Int , value : RestaurantId}
        ])
    }
}