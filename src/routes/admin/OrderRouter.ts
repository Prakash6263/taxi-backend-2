import { Router } from "express";
import Authentication from "../../Middlewares/Authnetication";
import { OrderController } from "../../controllers/Admin/OrderController";

class OrderRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.post();
    this.get();
    this.put();
  }

  public post() {}
  public get() {
    this.router.get("/list", Authentication.admin, OrderController.list);
    this.router.get(
      "/get-activity/:id",
      Authentication.admin,
      OrderController.getActivities
    );
  }
  public put() {}
}

export default new OrderRouter().router;
