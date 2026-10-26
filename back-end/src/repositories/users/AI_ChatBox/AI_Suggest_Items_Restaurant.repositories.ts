import { DbHelpQueryRepo } from "../../../utils/dbHelpQueryRepo"
import sql from "mssql"
export class AiSuggestItemsRestaurantRepo {
    async getItemsForAI(RestaurantId : string){
        const query = `
            SELECT 
                MI.NameMenuItems AS name,
                MI.Price AS price,
                MI.is_available,
                CR.CategoriesRestaurantName AS category
            FROM MenuItems MI
            JOIN CategoriesRestaurant CR 
                ON MI.CategoriesRestaurantId = CR.CategoriesRestaurantId
            WHERE CR.RestaurantId = @RestaurantId
            AND MI.is_available = 1
        `
        return DbHelpQueryRepo.excuteQuery(query , [
            {name : "RestaurantId" , type:sql.Int , value : parseInt(RestaurantId)}
        ])
    }
    
}