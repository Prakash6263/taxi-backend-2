import { Router } from "express";
import Authentication from "../../Middlewares/Authnetication";
import { DriverController } from "../../controllers/Admin/DriverController";

class DriverRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.post();
    this.get();
    this.put();
  }

  public post() {
    this.router.post("/add", Authentication.admin, DriverController.addData);
  }
  public get() {
    this.router.get("/list", Authentication.admin, DriverController.list);
    this.router.get(
      "/get-list/:type",
      Authentication.admin,
      DriverController.getList
    );
    
  }

  public put() {
    this.router.put(
      "/edit/:id",
      Authentication.admin,
      DriverController.editData
    );
    this.router.put(
      "/status-change/:id",
      Authentication.admin,
      DriverController.statusChange
    );
    this.router.put(
      "/delete-account/:id",
      Authentication.admin,
      DriverController.deleteUser
    );
    this.router.put(
      "/view-driver/:id",
      Authentication.admin,
      DriverController.viewDriver
    );
    this.router.put(
      "/approve-driver/:id",
      Authentication.admin,
      DriverController.approveDriver
    );
  }
}

export default new DriverRouter().router;
