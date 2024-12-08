import { Router } from "express";
import Authentication from "../../Middlewares/Authnetication";
import { VoucherController } from "../../controllers/Admin/VoucherController";

class VoucherRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.post();
    this.get();
    this.put();
  }

  public post() {
    this.router.post("/add", Authentication.admin, VoucherController.add);
  }
  public get() {
    this.router.get("/list", Authentication.admin, VoucherController.list);
  }

  public put() {
    this.router.put("/edit/:id", Authentication.admin, VoucherController.edit);
    this.router.put(
      "/status-change/:id",
      Authentication.admin,
      VoucherController.statusChange
    );
  }
}

export default new VoucherRouter().router;
