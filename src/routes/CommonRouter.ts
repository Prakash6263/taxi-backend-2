import { Router } from "express";
import UploadFiles from "../Middlewares/FileUploadMiddleware";
import { CommonController } from "../controllers/CommonController";

class CommonRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.post();
    this.get();
    this.put();
  }

  public post() {
    this.router.post(
      "/image-upload",
      UploadFiles.upload,
      CommonController.uploadImage
    );
    this.router.post("/storeContactData", CommonController.storeContactData);
  }

  public get() {
    this.router.get("/make-list", CommonController.makeList);
    this.router.get("/type-list", CommonController.typeList);
    this.router.get("/model-list/:id", CommonController.modelList);

    // Country State City
    this.router.get("/country", CommonController.getCountry);
    this.router.get("/state/:country_id", CommonController.getState);
    this.router.get("/city", CommonController.getCityFromPhoneCode);
    this.router.get("/get-cancel-reason", CommonController.getCancelReason);
    this.router.get("/get-content/:slug", CommonController.getContent);
    this.router.get("/factory-reset", CommonController.factoryReset);
    this.router.get("/get-all-driver", CommonController.getAllDriver);
  }

  public put() {
    this.router.put("/user-list/:type", CommonController.userList);
  }
}

export default new CommonRouter().router;
