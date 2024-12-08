import { Router } from "express";
import { CouponController } from "../../controllers/Admin/CouponController";
import Authentication from "../../Middlewares/Authnetication";

class CouponRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.post();
    this.get();
    this.put();
  }

  public post() {
    this.router.post(
      "/add-discount-coupon",
      Authentication.admin,
      CouponController.addDiscountCoupon
    );
  }
  public get() {
    this.router.get("/list", Authentication.admin, CouponController.list);
  }
  public put() {
    this.router.put(
      "/edit-discount-coupon/:id",
      Authentication.admin,
      CouponController.editDiscountCoupon
    );
    this.router.put(
      "/status-change/:id",
      Authentication.admin,
      CouponController.statusChange
    );
    this.router.put(
      "/view-coupon/:id",
      Authentication.admin,
      CouponController.view
    );
  }
}

export default new CouponRouter().router;
