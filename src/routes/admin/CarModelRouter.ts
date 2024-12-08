import { Router } from "express";
import { HotelController } from "../../controllers/Admin/HotelController";
import Authentication from "../../Middlewares/Authnetication";
import { CarModelController } from "../../controllers/Admin/CarModelController";

class CarModelRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.post();
    this.get();
    this.put();
  }

  public post() {
    this.router.post("/add", Authentication.admin, CarModelController.add);
  }
  public get() {
    this.router.get("/list", Authentication.admin, CarModelController.list);
  }

  public put() {
    this.router.put("/edit/:id", Authentication.admin, CarModelController.edit);
    this.router.put(
      "/status-change/:id",
      Authentication.admin,
      CarModelController.statusChange
    );
  }
}

export default new CarModelRouter().router;
