import sql from "mssql"
import dotenv from "dotenv";
dotenv.config();
const config : sql.config = {
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    server : process.env.DB_SERVER!,
    port : Number(process.env.DB_PORT),
    database : process.env.DB_NAME,
    options:{
        encrypt : false,
        trustServerCertificate : true,
    },
}
let pool : sql.ConnectionPool | null = null;
export async function connnectDB() {
    if(!pool){
        pool = await sql.connect(config);
    }
    return pool
}
export default sql;