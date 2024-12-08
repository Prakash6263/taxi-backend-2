import { Router } from "express";
import { GovermentController } from "../../controllers/Admin/GovermentController";
import Authentication from "../../Middlewares/Authnetication";

class GovermentRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.post();
    this.get();
    this.put();
  }

  public post() {
    this.router.post("/add", Authentication.admin, GovermentController.addData);
  }
  public get() {
    this.router.get("/list", Authentication.admin, GovermentController.list);
    this.router.get(
      "/get-list/:type",
      Authentication.admin,
      GovermentController.getList
    );
  }

  public put() {
    this.router.put(
      "/edit/:id",
      Authentication.admin,
      GovermentController.editData
    );
    this.router.put(
      "/status-change/:id",
      Authentication.admin,
      GovermentController.statusChange
    );
    this.router.put(
      "/delete-account/:id",
      Authentication.admin,
      GovermentController.deleteUser
    );
    this.router.put(
      "/view-user/:id",
      Authentication.admin,
      GovermentController.viewUser
    );
  }
}

export default new GovermentRouter().router;
