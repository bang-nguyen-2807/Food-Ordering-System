import { Request } from "express";
import sql from "mssql";
import { StatusCodes } from "http-status-codes";
import { connnectDB } from "../../../config/database";

export class CreateAccountRepo {
  async createAccount(req: Request) {
    try {
      const body = req.body;
      const { username, password, fullName, numberPhone, email, systemRole } = body;

      // 1. Kiểm tra dữ liệu đầu vào
      if (!username || !password || !fullName || !numberPhone || !email || !systemRole) {
        return {
          status: StatusCodes.BAD_REQUEST,
          message: "Vui lòng nhập đầy đủ thông tin!",
        };
      }

      const validRoles = ["CUSTOMER", "SHIPPER", "MERCHANT", "ADMIN", "USER"];
      const roleUpper = systemRole.toUpperCase() === "USER" ? "CUSTOMER" : systemRole.toUpperCase();

      if (!validRoles.includes(roleUpper)) {
        return {
          status: StatusCodes.BAD_REQUEST,
          message: "Vai trò người dùng không hợp lệ!",
        };
      }

      if (username.trim().length < 3) {
        return {
          status: StatusCodes.BAD_REQUEST,
          message: "Tên đăng nhập phải có ít nhất 3 kí tự!",
        };
      }

      if (password.length < 3) {
        return {
          status: StatusCodes.BAD_REQUEST,
          message: "Mật khẩu phải có ít nhất 3 kí tự!",
        };
      }

      const pool = await connnectDB();

      // 2. Chèn vào bảng Users và lấy ra UserId vừa tạo
      const queryInsertUser = `
        INSERT INTO Users (
            FullName,
            UserName,
            Password,
            NumberPhone,
            Email,
            SystemRole
        ) 
        OUTPUT INSERTED.UserId
        VALUES (@fullName, @username, @password, @numberPhone, @email, @systemRole);
      `;

      const result = await pool
        .request()
        .input("fullName", sql.NVarChar(255), fullName)
        .input("username", sql.VarChar(90), username)
        .input("password", sql.VarChar(255), password)
        .input("numberPhone", sql.VarChar(20), numberPhone)
        .input("email", sql.VarChar(255), email)
        .input("systemRole", sql.NVarChar(30), roleUpper)
        .query(queryInsertUser);

      const newUserId = result.recordset?.[0]?.UserId;

      // 3. Nếu là SHIPPER -> tự động tạo bản ghi trong bảng Shipper
      if (roleUpper === "SHIPPER" && newUserId) {
        await pool
          .request()
          .input("userId", sql.Int, newUserId)
          .query(`INSERT INTO Shipper (UserId) VALUES (@userId)`);
      }

      return {
        status: StatusCodes.OK,
        message: `Đăng ký tài khoản ${roleUpper === "SHIPPER" ? "Tài xế" : "Khách hàng"} thành công!`,
        data: {
          userId: newUserId,
          username,
          fullName,
          email,
          systemRole: roleUpper,
        },
      };
    } catch (error: any) {
      console.log("Lỗi sql trong Repo", error);

      // Bắt lỗi trùng khóa UNIQUE (UserName, Email, NumberPhone)
      if (error.number === 2627 || error.number === 2601) {
        return {
          status: StatusCodes.BAD_REQUEST,
          message: "Tên đăng nhập, Email hoặc Số điện thoại đã tồn tại!",
        };
      }

      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Lỗi hệ thống khi tạo tài khoản!",
      };
    }
  }
}