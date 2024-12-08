import { Router } from "express";
import Authentication from "../../Middlewares/Authnetication";
import { TransactionController } from "../../controllers/Admin/TransactionController";

class TransactionRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.post();
    this.get();
    this.put();
  }

  public post() {}
  public get() {
    this.router.get("/list", Authentication.admin, TransactionController.list);
    this.router.get(
      "/get-list",
      Authentication.admin,
      TransactionController.getList
    );
  }
  public put() {}
}

export default new TransactionRouter().router;
