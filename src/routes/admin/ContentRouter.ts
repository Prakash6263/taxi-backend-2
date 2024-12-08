import { Router } from "express";
import Authentication from "../../Middlewares/Authnetication";
import { ContentController } from "../../controllers/Admin/ContentController";

class ContentRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.post();
    this.get();
    this.put();
  }

  public post() {}
  public get() {
    this.router.get("/list", Authentication.admin, ContentController.list);
  }
  public put() {
    this.router.put(
      "/edit-content/:id",
      Authentication.admin,
      ContentController.editContent
    );
    this.router.put(
      "/status-change/:id",
      Authentication.admin,
      ContentController.statusChange
    );
    this.router.put(
      "/view-content/:id",
      Authentication.admin,
      ContentController.viewContent
    );
  }
}

export default new ContentRouter().router;
