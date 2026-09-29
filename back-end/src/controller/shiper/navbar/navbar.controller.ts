import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { NavbarService } from "../../../services/shiper/navbar/navbar.service";

export class NavbarController {
    private navbarService = new NavbarService();

    getActiveDeliveryOrder = async (req: Request, res: Response) => {
        try {
            const UserId = req.query.UserId as string;
            if (!UserId) {
                return res.status(StatusCodes.BAD_REQUEST).json("missing data");
            }
            const result = await this.navbarService.getActiveDeliveryOrder(UserId);
            return res.status(StatusCodes.OK).json(result);
        } catch (error: any) {
            console.error("Lỗi getActiveDeliveryOrder:", error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message || "Lỗi máy chủ khi lấy đơn hàng đang giao" });
        }
    }
}
