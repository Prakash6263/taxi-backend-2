import { Router } from "express";
import { HotelRidesController } from "../../controllers/Admin/HotelRidesController";
import Authentication from "../../Middlewares/Authnetication";

class RideRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.post();
    this.get();
    this.put();
  }

  public post() {
    this.router.post("/add", Authentication.admin, HotelRidesController.add);
  }
  public get() {
    this.router.get("/list", Authentication.admin, HotelRidesController.list);
  }

  public put() {
    this.router.put(
      "/edit/:id",
      Authentication.admin,
      HotelRidesController.edit
    );
    this.router.put(
      "/status-change/:id",
      Authentication.admin,
      HotelRidesController.statusChange
    );
  }
}

export default new RideRouter().router;
