import { Router } from "express";
import { HotelController } from "../../controllers/Admin/HotelController";
import Authentication from "../../Middlewares/Authnetication";
import { PriceMatrixController } from "../../controllers/Admin/PriceMatrixController";
import { LoyalityPointController } from "../../controllers/Admin/LoyalityPointController";

class PriceMatrixRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.post();
    this.get();
    this.put();
  }

  public post() {
    this.router.post("/add", Authentication.admin, PriceMatrixController.add);
    this.router.post(
      "/edit-loyality-point",
      Authentication.admin,
      LoyalityPointController.edit
    );
  }
  public get() {
    this.router.get("/list", Authentication.admin, PriceMatrixController.list);
    this.router.get(
      "/loyality-point",
      Authentication.admin,
      LoyalityPointController.getLoyalityData
    );
  }

  public put() {
    this.router.put(
      "/edit/:id",
      Authentication.admin,
      PriceMatrixController.edit
    );
    this.router.put(
      "/status-change/:id",
      Authentication.admin,
      PriceMatrixController.statusChange
    );
  }
}

export default new PriceMatrixRouter().router;
