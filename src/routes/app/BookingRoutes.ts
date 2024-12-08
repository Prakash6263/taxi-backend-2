import { Router } from "express";
import Authentication from "../../Middlewares/Authnetication";
import { TipController } from "../../controllers/User/TipController";
import { BookingController } from "../../controllers/User/BookingController";

class BookingRoutes {
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
      "/cancel-ride",
      Authentication.user,
      BookingController.cancelRide
    );
  }
  public get() {
    this.router.get(
      "/get-booking-driver/:lat/:long",
      Authentication.user,
      BookingController.getBookingDriver
    );
    this.router.get(
      "/get-booking-list/:status",
      Authentication.user,
      BookingController.getBookingList
    );
    this.router.get(
      "/get-booking-list-customer/:status",
      Authentication.user,
      BookingController.getBookingListCustomer
    );
    this.router.get(
      "/pre-booking-ride-list",
      Authentication.user,
      BookingController.preBookingRide
    );
    this.router.get(
      "/get-booking/:id",
      Authentication.user,
      BookingController.getBookingById
    );
  }

  public put() {}
  public delete() {}
}

export default new BookingRoutes().router;
