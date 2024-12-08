import { Router } from "express";
import Authentication from "../../Middlewares/Authnetication";
import { TipController } from "../../controllers/User/TipController";

class TipRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.post();
    this.get();
    this.put();
    this.delete();
  }

  public post() {
    this.router.post("/add-tip", Authentication.user, TipController.addTip);
  }
  public get() {
    this.router.get("/get-tip", Authentication.user, TipController.getTip);
    this.router.get("/get-tip-amount", TipController.getTipAmountList);
  }

  public put() {}
  public delete() {}
}

export default new TipRoutes().router;
