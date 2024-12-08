import { Router } from "express";
import { HotelController } from "../../controllers/Admin/HotelController";
import Authentication from "../../Middlewares/Authnetication";
import { CarMakeController } from "../../controllers/Admin/CarMakeController";

class CarMakeRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.post();
    this.get();
    this.put();
  }

  public post() {
    this.router.post("/add", Authentication.admin, CarMakeController.add);
  }
  public get() {
    this.router.get("/list", Authentication.admin, CarMakeController.list);
  }

  public put() {
    this.router.put("/edit/:id", Authentication.admin, CarMakeController.edit);
    this.router.put(
      "/status-change/:id",
      Authentication.admin,
      CarMakeController.statusChange
    );
  }
}

export default new CarMakeRouter().router;
