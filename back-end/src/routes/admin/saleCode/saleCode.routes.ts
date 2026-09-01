import { Router } from "express";
import { SaleCodeController } from "../../../controller/admin/saleCode/saleCode.controller";

const router = Router();
const saleCodeController = new SaleCodeController();

router.get('/listSaleCode', saleCodeController.listSaleCodeController); // danh sách mã giảm giá // /api/admin/saleCode/listSaleCode
router.post('/addSaleCode', saleCodeController.addSaleCodeController); // thêm mã giảm giá // /api/admin/saleCode/addSaleCode
router.delete('/deleteSaleCode/:AdminCodeId' , saleCodeController.deleteSaleCodeController); // xóa mã giảm giá // /api/admin/saleCode/deleteSaleCode/:AdminCodeId
export default router;
