import { Router } from "express";
import Authentication from "../../Middlewares/Authnetication";
import { BannerController } from "../../controllers/Admin/BannerController";

class BannerRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.post();
    this.get();
    this.put();
  }

  public post() {
    this.router.post(
      "/add-banner",
      Authentication.admin,
      BannerController.addBanner
    );
  }
  public get() {
    this.router.get("/list", Authentication.admin, BannerController.list);
  }
  public put() {
    this.router.put(
      "/edit-banner/:id",
      Authentication.admin,
      BannerController.editBanner
    );
    this.router.put(
      "/status-change/:id",
      Authentication.admin,
      BannerController.statusChange
    );
  }
}

export default new BannerRouter().router;
