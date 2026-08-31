import express, { Request, Response } from "express";
import cors from "cors";
import { StatusCodes } from "http-status-codes";
import rootRouter from "./routes";
const app = express();
const PORT = 5000;
app.use(cors()); // dùng để cho phép front-end gọi vào API (nếu khác port)
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

app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
