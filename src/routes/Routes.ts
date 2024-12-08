import { Router } from "express";
import AuthRouter from "./admin/AuthRouter";
import CouponRouter from "./admin/CouponRouter";
import UserRouter from "./admin/UserRouter";
import SubscriptionRouter from "./admin/SubscriptionRouter";
import CommonRouter from "./CommonRouter";
import BannerRouter from "./admin/BannerRouter";
import AuthRoutes from "./app/AuthRoutes";
import UserRoutes from "./app/UserRoutes";
import ContentRouter from "./admin/ContentRouter";
import DashbordRouter from "./admin/DashbordRouter";
import OrderRouter from "./admin/OrderRouter";
import TransactionRouter from "./admin/TransactionRouter";
import EmailTemplateRouter from "./admin/EmailTemplateRouter";
import HotelRoutes from "./admin/HotelRoutes";
import GovermentRouter from "./admin/GovermentRouter";
import DriverRouter from "./admin/DriverRouter";
import NotificationRouter from "./admin/NotificationRouter";
import CarType from "../models/CarType";
import CarTypeRouter from "./admin/CarTypeRouter";
import CarModelRouter from "./admin/CarModelRouter";
import CarMakeRouter from "./admin/CarMakeRouter";
import PriceMatrixRouter from "./admin/PriceMatrixRouter";
import VoucherRouter from "./admin/VoucherRouter";
import RideRouter from "./admin/RideRouter";
import NotificationRoutes from "./app/NotificationRoutes";
import TipRoutes from "./app/TipRoutes";
import BookingRoutes from "./app/BookingRoutes";
import SubAdminRouter from "./admin/SubAdminRouter";
import UserCarRouter from "./admin/UserCarRouter";
import CancelReasonRouter from "./admin/CancelReasonRouter";

class Routes {
  public router: Router;
  constructor() {
    this.router = Router();
    this.app();
    this.admin();
    this.common();
  }

  app() {
    this.router.use("/app/auth", AuthRoutes);
    this.router.use("/app/user", UserRoutes);
    this.router.use("/app/notification", NotificationRoutes);
    this.router.use("/app/tip", TipRoutes);
    this.router.use("/app/booking", BookingRoutes);
  }
  admin() {
    this.router.use("/admin/auth", AuthRouter);
    this.router.use("/admin/user", UserRouter);
    this.router.use("/admin/hotel", HotelRoutes);
    this.router.use("/admin/goverment", GovermentRouter);
    this.router.use("/admin/driver", DriverRouter);
    this.router.use("/admin/subscription", SubscriptionRouter);
    this.router.use("/admin/discount-manager", CouponRouter);
    this.router.use("/admin/banner", BannerRouter);
    this.router.use("/admin/content", ContentRouter);
    this.router.use("/admin/dashboard", DashbordRouter);
    this.router.use("/admin/order", OrderRouter);
    this.router.use("/admin/transaction", TransactionRouter);
    this.router.use("/admin/email-template", EmailTemplateRouter);
    this.router.use("/admin/notification", NotificationRouter);
    this.router.use("/admin/car-type", CarTypeRouter);
    this.router.use("/admin/car-model", CarModelRouter);
    this.router.use("/admin/car-make", CarMakeRouter);
    this.router.use("/admin/price-matrix", PriceMatrixRouter);
    this.router.use("/admin/voucher", VoucherRouter);
    this.router.use("/admin/ride", RideRouter);
    this.router.use("/admin/sub-admin", SubAdminRouter);
    this.router.use("/admin/usercar", UserCarRouter);
    this.router.use("/admin/cancel-reason", CancelReasonRouter);
  }
  common() {
    this.router.use("/common", CommonRouter);
  }
}
export default new Routes().router;
