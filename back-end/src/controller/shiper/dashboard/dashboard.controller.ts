import { StatusCodes } from "http-status-codes";
import { DashboardService } from "../../../services/shiper/dashboard/dashboard.service";
import { Request, Response } from "express";

export class DashboardController {
    private dashboardService: DashboardService;
    constructor() {
        this.dashboardService = new DashboardService()
    }
    totalOrder = async (req: Request, res: Response) => {
        try {
            const UserId = req.query.UserId as string;
            if (!UserId) {
                return res.status(StatusCodes.BAD_REQUEST).json("missing data")
            }
            const result = await this.dashboardService.totalOrder(UserId);
            return res.status(StatusCodes.OK).json(result);
        } catch (error: any) {
            console.error("Lỗi getManagerMenuController:", error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message || "Lỗi máy chủ khi lấy menu" });
        }
    }
    updateShipperLocation = async (req: Request, res: Response) => {
        try {
            const UserId = req.body.UserId as string;
            const longitude = req.body.longitude as string;
            const latitude = req.body.latitude as string;
            if (!UserId || !longitude || !latitude) {
                return res.status(StatusCodes.BAD_REQUEST).json("missing data")
            }
            const result = await this.dashboardService.updateShipperLocation(req);
            return res.status(StatusCodes.OK).json(result);
        } catch (error: any) {
            console.error("Lỗi updateShipperLocation:", error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message || "Lỗi máy chủ khi update location" });
        }
    }
    getAvailableDeliveries = async (req: Request, res: Response) => {
        try {
            const UserId = req.query.UserId as string;
            const radiusMeter = req.query.radiusMeter as string;
            if (!UserId) {
                return res.status(StatusCodes.BAD_REQUEST).json("missing data")
            }
            const radius = radiusMeter ? parseInt(radiusMeter) : undefined;
            const result = await this.dashboardService.getAvailableDeliveries(UserId, radius);
            return res.status(StatusCodes.OK).json(result);
        } catch (error: any) {
            console.error("Lỗi getAvailableDeliveries:", error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message || "Lỗi máy chủ khi lấy danh sách đơn" });
        }
    }
}