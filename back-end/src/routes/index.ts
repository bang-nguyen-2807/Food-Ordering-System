import { Router } from 'express';
import AdminDashboardRoutes from "../routes/admin/dashboard/Admin.Dashboard.routes"
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';
import LoginRoutes from "../routes/authentication/login/login.routes";
import CreateAccount from "../routes/authentication/createAccount/createAccount.Routes"
import AdminUsersRoutes from "../routes/admin/UsersAndPartness/user.routes"
import AdminManagerOrderRoutes from "../routes/admin/managerOrder/managerOrder.routes"
import SaleCodeRoutes from "../routes/admin/saleCode/saleCode.routes"
import AdminAnalyticsRoutes from "../routes/admin/analytics/Admin.Analytics.routes"
import DashboardRoutes from "../routes/restaurant/dashboard/dashboard.routes"
import ManagerOrderRoutes from "../routes/restaurant/managerOrder/managerOrder.routes"
import ManagerMenuRoutes from "../routes/restaurant/managerMenu/managerMenu.routes"
const rootRouter = Router();
// middleware bảo vệ admin 
//  ÁP DỤNG MIDDLEWARE BẢO VỆ CHO TOÀN BỘ NHÁNH /admin Ở ĐÂY:
rootRouter.use(
    "/admin",
    authenticateToken,        //  Bắt buộc phải có Token hợp lệ
    authorizeRoles("ADMIN")   //  Bắt buộc Role phải là 'admin'
);
// ÁP DỤNG MIDDLEWARE BẢO VỆ CHO NHÁNH NHÀ HÀNG
rootRouter.use(
  "/restaurant",
  authenticateToken,
  authorizeRoles("MERCHANT", "ADMIN")
)
// login
rootRouter.use("/authentication" , LoginRoutes); // /api/authentication/login
rootRouter.use("/authentication" , CreateAccount); // /api/authentication/createAccount
// admin
rootRouter.use("/admin/dashboard" , AdminDashboardRoutes) // tổng số lượng user , restaurant , shipper , orderStatus , totalRevenue  /api/admin/dashboard/total
rootRouter.use("/admin/userAndPartness" , AdminUsersRoutes ) // info user and restaurant 
rootRouter.use("/admin/managerOrder" , AdminManagerOrderRoutes ) // info order /api/admin/managerOrder/infoOrder
rootRouter.use("/admin/saleCode" , SaleCodeRoutes) // info saleCode /api/admin/saleCode/saleCode
rootRouter.use("/admin/analytics" , AdminAnalyticsRoutes) // thống kê doanh thu /api/admin/analytics/data
// restaurant
rootRouter.use("/restaurant/dashboard" , DashboardRoutes) // thống kê doanh thu 
rootRouter.use("/restaurant/managerOrder" , ManagerOrderRoutes)
rootRouter.use("/restaurant/managerMenu" , ManagerMenuRoutes)

export default rootRouter;
