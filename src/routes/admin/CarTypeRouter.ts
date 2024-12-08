import { Router } from "express";
import { HotelController } from "../../controllers/Admin/HotelController";
import Authentication from "../../Middlewares/Authnetication";
import { CarTypeController } from "../../controllers/Admin/CarTypeController";

class CarTypeRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.post();
    this.get();
    this.put();
  }

  public post() {
    this.router.post("/add", Authentication.admin, CarTypeController.add);
  }
  public get() {
    this.router.get("/list", Authentication.admin, CarTypeController.list);
  }

  public put() {
    this.router.put("/edit/:id", Authentication.admin, CarTypeController.edit);
    this.router.put(
      "/status-change/:id",
      Authentication.admin,
      CarTypeController.statusChange
    );
  }
}

export default new CarTypeRouter().router;
