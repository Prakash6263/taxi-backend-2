import { Router } from "express";
import Authentication from "../../Middlewares/Authnetication";
import { UserCarController } from "../../controllers/Admin/UserCarController";

class UserCarRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.post();
    this.get();
    this.put();
  }

  public post() {}
  public get() {
    this.router.get("/list", Authentication.admin, UserCarController.list);
  }

  public put() {
    this.router.put(
      "/status-change/:id",
      Authentication.admin,
      UserCarController.statusChange
    );

    this.router.put(
      "/approve-car/:id",
      Authentication.admin,
      UserCarController.approveRejectCar
    );
    this.router.put(
      "/view-car/:id",
      Authentication.admin,
      UserCarController.viewCar
    );
    
  }
}

export default new UserCarRouter().router;
