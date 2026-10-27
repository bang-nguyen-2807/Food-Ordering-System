import express, { Request, Response } from "express";
import cors from "cors";
import { StatusCodes } from "http-status-codes";
import rootRouter from "./routes";
import rateLimit from "express-rate-limit"
const app = express();
const PORT = 5000;
const limiter = rateLimit({// giới hạn số lần gởi request của user trong 1 phút là 5
  windowMs: 15 * 60 * 1000, // 15 phút
  limit: 500,            // Tối đa 500 request
  message: {
    message: "Bạn gửi quá nhiều request. Vui lòng thử lại sau!"
  },
  standardHeaders: "draft-8",
  legacyHeaders: false
})

app.use(cors()); // dùng để cho phép front-end gọi vào API (nếu khác port)
app.use(limiter)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Xin chào! API đang hoạt động bình thường.",
    status: 200,
  });
});
app.use("/api" , rootRouter)
// Fallback khi gọi sai route
app.use((req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).json({
    message: `Không tìm thấy endpoint: ${req.method} ${req.originalUrl}`,
  });
});

if (!process.env.VERCEL) { // khi run local
  app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
  });
}

export default app;
