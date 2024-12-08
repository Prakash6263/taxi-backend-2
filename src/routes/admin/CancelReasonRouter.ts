import { Router } from "express";
import { CancelReasonController } from "../../controllers/Admin/CancelReasonController";
import Authentication from "../../Middlewares/Authnetication";

class CancelReasonRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.post();
    this.get();
    this.delete();
    this.put();
  }

  public post() {
    this.router.post(
      "/add",Authentication.admin,
      CancelReasonController.add
    );
  }

  public get() {
    this.router.get(
      "/list",Authentication.admin,
      CancelReasonController.list
    );
  }

  public delete() {
    this.router.delete(
      "/delete/:id",Authentication.admin,
      CancelReasonController.delete
    );
  }
  public put() {
    this.router.put(
      "/edit/:id",
      Authentication.admin,
      CancelReasonController.edit
    );
    this.router.put(
      "/status-change/:id",
      Authentication.admin,
      CancelReasonController.statusChange
    );
  }
}

export default new CancelReasonRouter().router;
