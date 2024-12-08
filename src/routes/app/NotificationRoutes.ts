import { Router } from "express";
import Authentication from "../../Middlewares/Authnetication";
import { NotificationController } from "../../controllers/User/NotificationController";

class NotificationRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.post();
    this.get();
    this.put();
    this.delete();
  }

  public post() {}
  public get() {
    this.router.get(
      "/get-list",
      Authentication.user,
      NotificationController.notificationList
    );
  }

  public put() {
    this.router.put(
      "/read-notification",
      Authentication.user,
      NotificationController.readNotification
    );
  }
  public delete() {
    this.router.delete(
      "/delete-notification",
      Authentication.user,
      NotificationController.deleteNotification
    );
  }
}

export default new NotificationRoutes().router;
