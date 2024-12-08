import { Router } from "express";
import Authentication from "../../Middlewares/Authnetication";
import { UserController } from "../../controllers/User/UserController";
import { PromoCodeController } from "../../controllers/User/PromoCodeController";

class UserRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.post();
    this.get();
    this.put();
    this.delete();
  }

  public post() {
    this.router.post(
      "/update-profile",
      Authentication.user,
      UserController.updateProfile
    );
    this.router.post(
      "/change-password",
      Authentication.user,
      UserController.ChangePassword
    );
    this.router.post(
      "/add-address",
      Authentication.user,
      UserController.addAddress
    );
    this.router.post(
      "/edit-address/:id",
      Authentication.user,
      UserController.editAddress
    );

    this.router.post("/add-car", Authentication.user, UserController.addCar);
    this.router.post("/edit-car", Authentication.user, UserController.editCar);
    this.router.post(
      "/apply-promo",
      Authentication.user,
      PromoCodeController.applyPromoCode
    );

    this.router.post(
      "/book-ride",
      Authentication.user,
      UserController.BookRide
    );
    this.router.post(
      "/add-rating",
      Authentication.user,
      UserController.addUserRating
    );

    this.router.post(
      "/ride/accept-decline",
      Authentication.user,
      UserController.rideAcceptDecine
    );
    this.router.post(
      "/verify-otp-delete",
      Authentication.user,
      UserController.verifyOTPDelete
    );
    this.router.post(
      "/update-phone-or-email",
      Authentication.user,
      UserController.updatePhoneOrEmail
    );
    this.router.post(
      "/verify-otp-phone-email",
      Authentication.user,
      UserController.verifyOtpPhoneOrEmail
    );
  }
  public get() {
    this.router.get(
      "/delete-account",
      Authentication.user,
      UserController.deleteAccount
    );
    this.router.get(
      "/get-promo-code",
      Authentication.user,
      PromoCodeController.getPromoCode
    );
    this.router.get(
      "/get-all-driver-list",
      Authentication.user,
      UserController.getAllDriver
    );
    this.router.get(
      "/get-nearby-vehicle",
      Authentication.user,
      UserController.getVehicleListNearBy
    );
    this.router.get(
      "/default-car/:id",
      Authentication.user,
      UserController.setDefaultCar
    );
    this.router.get(
      "/car-detail/:id",
      Authentication.user,
      UserController.carDetail
    );
    this.router.get(
      "/get-all-driver",
      Authentication.user,
      UserController.getAllDriv
    );
    this.router.get(
      "/saved-address",
      Authentication.user,
      UserController.savedAddress
    );
    this.router.get(
      "/get-profile",
      Authentication.user,
      UserController.getProfile
    );
    this.router.get(
      "/get-all-address",
      Authentication.user,
      UserController.getAllAddress
    );
    this.router.get(
      "/get-address/:id",
      Authentication.user,
      UserController.getAddress
    );
    this.router.get(
      "/get-car-list",
      Authentication.user,
      UserController.getCarListByDriverId
    );
    this.router.get(
      "/get-driver-details",
      // Authentication.user,
      UserController.getdriverDetailsByDriverId
    );
    this.router.get(
      "/dashBoardData",
      Authentication.user,
      UserController.dashBoardData
    );
  }

  public put() {}
  public delete() {
    this.router.delete(
      "/remove-address/:id",
      Authentication.user,
      UserController.removeAddress
    );
    this.router.delete(
      "/remove-car",
      Authentication.user,
      UserController.removeCar
    );
  }
}

export default new UserRoutes().router;
