import { Router } from "express";
import { SubAdminController } from "../../controllers/Admin/SubAdminController";
import Authentication from "../../Middlewares/Authnetication";

class SubAdminRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.post();
    this.get();
    this.put();
  }

  public post() {
    this.router.post(
      "/add-sub-admin",
      Authentication.admin,
      SubAdminController.addUser
    );
  }
  public get() {
    this.router.get("/list", Authentication.admin, SubAdminController.list);
    this.router.get(
      "/get-list/:type",
      Authentication.admin,
      SubAdminController.getList
    );
  }

  public put() {
    this.router.put(
      "/edit-add-sub-admin/:id",
      Authentication.admin,
      SubAdminController.editUser
    );
    this.router.put(
      "/status-change/:id",
      Authentication.admin,
      SubAdminController.statusChange
    );
    this.router.put(
      "/delete-account/:id",
      Authentication.admin,
      SubAdminController.deleteUser
    );
    this.router.put(
      "/view-add-sub-admin/:id",
      Authentication.admin,
      SubAdminController.viewUser
    );
  }
}

export default new SubAdminRouter().router;
