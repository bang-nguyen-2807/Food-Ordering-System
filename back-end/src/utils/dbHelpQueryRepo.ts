// file tối ưu repository
// giúp giảm thiểu việc ghi code nhiều lần
import sql from "mssql"
import { connnectDB } from "../config/database";
export interface SqlParam {
  name: string;
  type: sql.ISqlType | (() => sql.ISqlType);
  value: any;
}
export class DbHelpQueryRepo{
    // hàm chạy query
    static async excuteQuery<T>(queryText : string , params : SqlParam[] ) : Promise<T[]>{
        const pool = await connnectDB();
        const request = await pool.request();
        if(params.length > 0){
            params.forEach((params)=>{
                request.input(params.name , params.type , params.value)
            })
        }
        const result = await request.query(queryText)
        return result.recordset || []
    }
    // hàm chạy query cho update , add , delete
    static async excuteNonQuery(queryText : string , params : SqlParam[] ) : Promise<boolean>{
        const pool = await connnectDB();
        const request = await pool.request();
        if(params.length > 0){
            params.forEach((params)=>{
                request.input(params.name , params.type , params.value)
            })
        }
        const result = await request.query(queryText)
        return (result.rowsAffected[0] ?? 0) > 0;
    }
}