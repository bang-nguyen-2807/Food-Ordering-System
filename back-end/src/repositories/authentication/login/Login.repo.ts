import { Request } from "express";
import sql from "mssql";
import { StatusCodes } from "http-status-codes";
import { connnectDB } from "../../../config/database";
import { generateToken } from "../../../utils/jwt";
import bcrypt from "bcrypt"
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
                    Password,
                    Email, 
                    NumberPhone, 
                    SystemRole 
                FROM Users 
                WHERE (UserName = @Username OR Email = @Username) 
            `;

      const result = await pool
        .request()
        .input("Username", sql.NVarChar, username.trim())
        .query(query);

      if (result.recordset.length === 0) {
        return {
          status: StatusCodes.UNAUTHORIZED,
          message: "Tài khoản hoặc mật khẩu không chính xác",
        };
      }

      const user = result.recordset[0];

      // so sánh password người dùng gửi lên với password hash trong db cs giống nhau hay ko . giống thì đi tiếp
      const isPasswordMatch = await bcrypt.compare(password, user.Password)

      if(!isPasswordMatch){
        return{
          status: StatusCodes.UNAUTHORIZED,
          message: "Tài khoản hoặc mật khẩu không chính xác",
        }
      }
      // phải xóa field password trước khi trả về client
      delete user.Password

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

// nếu lỗi khi đăng nhập bằng tk cũ trước khi sử dụng bcrypt thì dùng code dưới thay cho dòng 47 - 56(phần so sánh password người dùng với bcript)

// let isPasswordMatch = false;

// // 1. Kiểm tra xem mật khẩu trong DB có phải là hash bcrypt không (bắt đầu bằng $2)
// const isBcryptHash = user.Password && user.Password.startsWith("$2");

// if (isBcryptHash) {
//   // Mật khẩu đã hash -> Dùng bcrypt.compare
//   isPasswordMatch = await bcrypt.compare(password, user.Password);
// } else {
//   // Mật khẩu cũ dạng chữ thường -> So sánh trực tiếp
//   isPasswordMatch = (password === user.Password);

//   // Nếu mật khẩu cũ đúng -> Tự động mã hóa và cập nhật lại vào DB luôn!
//   if (isPasswordMatch) {
//     const newHashedPassword = await bcrypt.hash(password, 10);
//     await pool.request()
//       .input("UserId", sql.Int, user.UserId)
//       .input("NewPassword", sql.VarChar(255), newHashedPassword)
//       .query("UPDATE Users SET Password = @NewPassword WHERE UserId = @UserId");
//   }
// }

// if (!isPasswordMatch) {
//   return {
//     status: StatusCodes.UNAUTHORIZED,
//     message: "Tài khoản hoặc mật khẩu không chính xác",
//   };
// }

