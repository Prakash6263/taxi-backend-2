import { Router } from "express";
import { HotelController } from "../../controllers/Admin/HotelController";
import Authentication from "../../Middlewares/Authnetication";

class HotelRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.post();
    this.get();
    this.put();
  }

  public post() {
    this.router.post(
      "/add-hotel",
      Authentication.admin,
      HotelController.addHotel
    );
  }
  public get() {
    this.router.get("/list", Authentication.admin, HotelController.list);
    this.router.get(
      "/get-list/:type",
      Authentication.admin,
      HotelController.getList
    );
  }

  public put() {
    this.router.put(
      "/edit-hotel/:id",
      Authentication.admin,
      HotelController.editHotel
    );
    this.router.put(
      "/status-change/:id",
      Authentication.admin,
      HotelController.statusChange
    );
    this.router.put(
      "/delete-account/:id",
      Authentication.admin,
      HotelController.deleteUser
    );
    this.router.put(
      "/view-user/:id",
      Authentication.admin,
      HotelController.viewUser
    );
  }
}

export default new HotelRoutes().router;
