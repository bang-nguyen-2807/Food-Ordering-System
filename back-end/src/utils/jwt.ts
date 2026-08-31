import jwt from "jsonwebtoken";
// Định nghĩa thông tin lưu trong JWT Payload
export interface UserPayload {
  userId: number | string;
  email: string;
  role: string; // VD: 'admin', 'user', 'restaurant', 'shipper'
}

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

// 1. Tạo JWT Token khi user đăng nhập thành công
export const generateToken = (payload: UserPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as any,
  });
};

// 2. Xác thực và giải mã JWT Token
export const verifyToken = (token: string): UserPayload => {
  return jwt.verify(token, JWT_SECRET) as UserPayload;
};
