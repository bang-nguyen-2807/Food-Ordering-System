import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { verifyToken } from "../utils/jwt";

/**
 * Middleware 1: Xác thực Access Token
 * Kiểm tra Client có gửi Header Authorization: Bearer <token> hợp lệ không.
 */
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  // Lấy chuỗi token đằng sau chữ "Bearer "
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Bạn chưa đăng nhập hoặc không tìm thấy Access Token.",
    });
  }

  try {
    // Giải mã token
    const decodedPayload = verifyToken(token);

    // Gán thông tin user đã giải mã vào req.user
    req.user = decodedPayload;

    // Cho phép request tiếp tục đi vào Controller
    next();
  } catch (error) {
    return res.status(StatusCodes.FORBIDDEN).json({
      message: "Token không hợp lệ hoặc đã hết hạn.",
    });
  }
};

/**
 * Middleware 2: Phân quyền truy cập theo Vai Trò (Role)
 * Ví dụ: authorizeRoles('admin', 'restaurant')
 */
export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Người dùng chưa xác thực.",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: `Bạn không có quyền thực hiện chức năng này. Yêu cầu quyền: ${allowedRoles.join(", ")}`,
      });
    }

    next();
  };
};