import { Router } from "express";
import Authentication from "../../Middlewares/Authnetication";
import { DashboardController } from "../../controllers/Admin/DashboardController";

class DashboardRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.post();
    this.get();
    this.put();
  }

  public post() {}
  public get() {}
  public put() {}
}

export default new DashboardRouter().router;
