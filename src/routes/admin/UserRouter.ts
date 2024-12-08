import { Router } from "express";
import { UserController } from "../../controllers/Admin/UserController";
import Authentication from "../../Middlewares/Authnetication";

class UserRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.post();
    this.get();
    this.put();
  }

  public post() {
    this.router.post("/add-user", Authentication.admin, UserController.addUser);
  }
  public get() {
    this.router.get("/list", Authentication.admin, UserController.list);
    this.router.get(
      "/get-list/:type",
      Authentication.admin,
      UserController.getList
    );
  }

  public put() {
    this.router.put(
      "/edit-user/:id",
      Authentication.admin,
      UserController.editUser
    );
    this.router.put(
      "/status-change/:id",
      Authentication.admin,
      UserController.statusChange
    );
    this.router.put(
      "/delete-account/:id",
      Authentication.admin,
      UserController.deleteUser
    );
    
    this.router.put(
      "/reset-password/:id",
      Authentication.admin,
      UserController.resetPassword
    );
  }
}

export default new UserRouter().router;
