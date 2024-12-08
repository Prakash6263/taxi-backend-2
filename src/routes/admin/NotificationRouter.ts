import { Router } from "express";
import Authentication from "../../Middlewares/Authnetication";
import EmailTemplateController from "../../controllers/Admin/EmailTemplateController";
import NotificationController from "../../controllers/Admin/NotificationController";

class NotificationRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.post();
    this.get();
    this.put();
  }

  public post() {
    this.router.post(
      "/add-notification",
      Authentication.admin,
      NotificationController.addNotification
    );
  }
  public get() {
    this.router.get(
      "/list",
      Authentication.admin,
      NotificationController.notificationList
    );
  }
  public put() {
    this.router.put(
      "/view-notification/:id",
      Authentication.admin,
      NotificationController.viewNotification
    );
  }
}

export default new NotificationRouter().router;
