import { Request } from "express"
import { DbHelpQueryRepo } from "../../../utils/dbHelpQueryRepo"
import sql from "mssql"
export class SaleCodeRepo{
    async listSaleCode(){ // GET sale code
        let query = `
            SELECT AC.AdminCodeId,
                AC.CodeSale ,
                AC.Description , 
                AC.Amount , 
                AC.MinOrderAmount , 
                AC.MaxAmount , 
                AC.EndDate , 
                ISNULL(AC.IsActive, 1) AS IsActive,
                COUNT(CASE WHEN CS.IsUsed = 1 THEN 1 END) AS TotalUsed,-- Số lượng thực tế người đã dùng
                ISNULL(CAST(AC.UsageLimit AS VARCHAR(20)), N'Không giới hạn') AS UsageLimitText,-- Giới hạn tối đa (nếu NULL thì hiển thị là 'Không giới hạn')
                CONCAT(
                        COUNT(CASE WHEN CS.IsUsed = 1 THEN 1 END), 
                        ' / ', 
                        ISNULL(CAST(AC.UsageLimit AS VARCHAR(20)), N'Không giới hạn')
                ) AS UsageRatio
                FROM AdminCode AS AC
                LEFT JOIN CodeSale AS CS
                ON CS.AdminCodeId = AC.AdminCodeId
                GROUP BY 
                    AC.AdminCodeId,
                    AC.CodeSale,
                    AC.Description,
                    AC.DiscountType,
                    AC.Amount,
                    AC.MinOrderAmount,
                    AC.MaxAmount,
                    AC.EndDate,
                    AC.IsActive,
                    AC.UsageLimit;
        `
        return DbHelpQueryRepo.excuteQuery(query, [])
    }
    async addSaleCode(req : Request){
        const body = req.body;
        const {CodeSale , Description , DiscountType , Amount , MinOrderAmount , MaxAmount , StartDate , EndDate , UsageLimit} = body;
        let query = `
            INSERT INTO AdminCode (CodeSale , Description , DiscountType , Amount , MinOrderAmount , MaxAmount , StartDate , EndDate , UsageLimit, IsActive)
            VALUES (@CodeSale , @Description , @DiscountType , @Amount , @MinOrderAmount , @MaxAmount , @StartDate , @EndDate , @UsageLimit, 1)
        `
        const params = [
            {name : "CodeSale" , type : sql.VarChar(50) , value : CodeSale},
            {name : "Description" , type : sql.NVarChar(255) , value : Description},
            {name : "DiscountType" , type : sql.NVarChar(20) , value : DiscountType},
            {name : "Amount" , type : sql.Decimal(18,2) , value : Amount},
            {name : "MinOrderAmount" , type : sql.Decimal(18,2) , value : MinOrderAmount},
            {name : "MaxAmount" , type : sql.Decimal(18,2) , value : MaxAmount},
            {name : "StartDate" , type : sql.DateTime2 , value : StartDate},
            {name : "EndDate" , type : sql.DateTime2 , value : EndDate},
            {name : "UsageLimit" , type : sql.Int , value : UsageLimit}
        ]
        return DbHelpQueryRepo.excuteNonQuery(query , params)
    }
    async deleteSaleCode(req : Request){
        const body = req.body;
        const {AdminCodeId} = body;
        let query = `
            DELETE FROM AdminCode WHERE AdminCodeId = @AdminCodeId
        `
        const params = [
            {name : "AdminCodeId" , type : sql.Int , value : AdminCodeId}
        ]
        return DbHelpQueryRepo.excuteNonQuery(query , params)
    }
}
