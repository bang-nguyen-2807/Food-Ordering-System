import { Request } from "express";
import sql from "mssql";
import { StatusCodes } from "http-status-codes";
import { connnectDB } from "../../../config/database";
import { generateToken } from "../../../utils/jwt";
export class LoginRepo {
  async login(req: Request) {
    try {
      const body = req.body;
      const { username, password } = body;
  
      if (!username || !password) {
        return {
          status: StatusCodes.BAD_REQUEST,
          message: "Vui lòng nhập đầy đủ tài khoản và mật khẩu",
        };
      }

      const pool = await connnectDB();
      const query = `
                SELECT 
                    UserId, 
                    FullName, 
                    UserName, 
                    Email, 
                    NumberPhone, 
                    SystemRole 
                FROM Users 
                WHERE (UserName = @Username OR Email = @Username) 
                  AND Password = @Password
            `;

      const result = await pool
        .request()
        .input("Username", sql.NVarChar, username.trim())
        .input("Password", sql.NVarChar, password)
        .query(query);

      if (result.recordset.length === 0) {
        return {
          status: StatusCodes.UNAUTHORIZED,
          message: "Tài khoản hoặc mật khẩu không chính xác",
        };
      }

      const user = result.recordset[0];

      const token = generateToken({
        userId: user.UserId,
        email: user.Email,
        role: user.SystemRole,
      });
      return {
        status: StatusCodes.OK,
        message: "Đăng nhập thành công",
        data: user,
        accessToken: token,
      };
    } catch (error: any) {
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Lỗi hệ thống trong quá trình đăng nhập",
        error: error.message,
      };
    }
  }
  
}
