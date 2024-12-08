import { Router } from "express";
import { SubscriptionController } from "../../controllers/Admin/SubscriptionController";
import Authentication from "../../Middlewares/Authnetication";

class SubscriptionRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.post();
    this.get();
    this.put();
  }

  public post() {
    this.router.post(
      "/add-subscription",
      Authentication.admin,
      SubscriptionController.addSubscription
    );
  }
  public get() {
    this.router.get("/list", Authentication.admin, SubscriptionController.list);
  }
  public put() {
    this.router.put(
      "/edit-subscription/:id",
      Authentication.admin,
      SubscriptionController.editSubscription
    );
    this.router.put(
      "/status-change/:id",
      Authentication.admin,
      SubscriptionController.statusChange
    );
    this.router.put(
      "/view-subscription/:id",
      Authentication.admin,
      SubscriptionController.viewSubscription
    );
  }
}

export default new SubscriptionRouter().router;
