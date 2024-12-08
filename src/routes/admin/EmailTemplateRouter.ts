import { Router } from "express";
import Authentication from "../../Middlewares/Authnetication";
import EmailTemplateController from "../../controllers/Admin/EmailTemplateController";

class EmailTemplateRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.post();
    this.get();
    this.put();
  }

  public post() {}
  public get() {
    this.router.get(
      "/list",
      Authentication.admin,
      EmailTemplateController.emailTemplateList
    );
  }
  public put() {
    this.router.put(
      "/edit-email-template/:id",
      Authentication.admin,
      EmailTemplateController.editEmailTemplate
    );
    this.router.put(
      "/status-change/:id",
      Authentication.admin,
      EmailTemplateController.statusChange
    );
    this.router.put(
      "/view/:id",
      Authentication.admin,
      EmailTemplateController.viewEmailTemplate
    );
  }
}

export default new EmailTemplateRouter().router;
