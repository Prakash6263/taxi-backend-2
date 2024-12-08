import { nextTick } from "process";
import _RS from "../../helpers/ResponseHelper";
import Booking from "../../models/Booking";
import Order from "../../models/Order";
import Tip from "../../models/Tip";
import socketObj from "../../services/SocketService";
import * as mongoose from "mongoose";
import User from "../../models/User";
import NotificationService from "../../services/NotificationService";
import moment = require("moment");
import BookingActivity from "../../models/BookingActivity";
const startTime = new Date().getTime();
export class BookingController {
  static async acceptReject(data, callback, socket, io) {
    try {
      let getDriver;
      let getBooking = await Order.findOne({ _id: data.bookingId });
      // getBooking.driver = data.driverId;
      if (!getBooking.driver && getBooking.status == "Pending") {
        if (data.status == "Arriving") {
          getBooking.status = data.status;
          getBooking.driver = data.driverId;

          getBooking.start_ride_time = moment().format("YYYY-MM-DD HH:mm");
          // await NotificationService.sendNotification(
          //   data.customerId,
          //   "Driver is accept the request and arriving soon"
          // );
          getDriver = await User.findOne({ _id: data.driverId }).populate(
            "car"
          );
          getDriver.isActiveRide = true;
          getDriver.save();
          getBooking.vehicleNumber = getDriver.car
            ? getDriver.car.carNumber
            : "";
          await BookingActivity.create({
            bookingId: data.bookingId,
            title: "Driver is accept the request and arriving soon",
            status: data.status,
          });
        } else if (data.status == "Reject") {
          await BookingActivity.create({
            bookingId: data.bookingId,
            title: "Driver is Reject the request",
            status: data.status,
          });
          await Order.updateOne(
            { _id: new mongoose.Types.ObjectId(data.bookingId.toString()) },
            { $push: { declineRideDriver: data.driverId } }
          );
        } else {
          await BookingActivity.create({
            bookingId: data.bookingId,
            title: "",
            status: data.status,
          });
          getBooking.status = data.status;
        }
        await getBooking.save();
        getBooking.driverId = getDriver._id;
        const memberSocket = socketObj.sockets[data.customerId] || null;
        
        if (memberSocket) {
          memberSocket.emit("receiveStatusUpdate", {
            status: 201,
            message: "Booking Status Changed.",
            data: getBooking,
          });
        }
        callback({
          status: 200,
          message: "Booking Status Change form driver.",
          data: getBooking,
        });
      } else {
        callback({
          status: 409,
          message: "Booking assign another driver",
          data: {},
        });
      }
    } catch (error) {
      console.log(error, "error");
    }
  }
  static async statusUpdate(data, callback, socket, io) {
    try {
      let getDriver;
      let getBooking = await Order.findOne({ _id: data.bookingId });
      getBooking.status = data.status;
      getBooking.otp = 1234;
      if (data.status == "Completed") {
        getDriver = await User.findOne({ _id: getBooking.driver });
        getDriver.isActiveRide = false;
        getDriver.save();
        getBooking.end_ride_time = moment().format("YYYY-MM-DD HH:mm");
        getBooking.isPaid = true;
        getBooking.otp = null;
      } else if (data.status == "Drop") {
        getBooking.customerMidlocation = data.customerMidlocation;
        getBooking.customerMidLocationLat = data.customerMidLocationLat;
        getBooking.customerMidLocationLong = data.customerMidLocationLong;
        getBooking.totalDistance = data.totalDistance;
        getBooking.totalAmount = data.totalAmount;
        getBooking.otp = null;
      } else if (data.status == "Arrived") {
        getBooking.otp = 1234;
      }
      getBooking.save();
      getBooking.driverId = getDriver._id;

      let title = "";
      if (data.status == "Arriving") {
        title = "Driver Is on the way  ";
      } else if (data.status == "Arrived") {
        title = "Driver is arrived on your pickup location";
      } else if (data.status == "Completed") {
        title = "Driver is completed your ride please pay your fare";
      } else if (data.status == "Drop") {
        title = "Driver is reached your drop location";
      }
      await BookingActivity.create({
        bookingId: data.bookingId,
        title: title,
        status: data.status,
      });
      await NotificationService.sendNotification(data.customerId, title);

      const memberSocket = socketObj.sockets[data.customerId] || null;
      console.log(memberSocket, "memberSocket");
      if (memberSocket) {
        memberSocket.emit("receiveStatusUpdate", {
          status: 201,
          message: "Booking Status Changed.",
          data: getBooking,
        });
      }
      callback({
        status: 200,
        message: "Booking Status Change form driver.",
        data: getBooking,
      });
    } catch (error) {
      console.log(error, "error");
    }
  }

  static async getBookingDriverEmit(data, callback, socket, io) {
    const { lat, long } = data;
    try {
      const getBooking = await Order.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [Number(long), Number(lat)],
            },
            distanceField: "distance",
            maxDistance: 1500 * 1000, // 15000000,0
            spherical: true,
            key: "pickupLocation",
            distanceMultiplier: 0.001,
          },
        },
        {
          $match: {
            isPaid: false,
            status: "Pending",
            rideType: "Now",
            declineRideDriver: {
              $nin: [new mongoose.Types.ObjectId(data.senderId)],
            },
          },
        },

        {
          $lookup: {
            from: "users",
            localField: "customer",
            foreignField: "_id",
            as: "customerData",
          },
        },
        {
          $unwind: "$customerData",
        },
        {
          $addFields: {
            distance: "$distance",
          },
        },
        {
          $limit: 1,
        },
      ]);
      console.log(getBooking, "getBooking");
      // return _RS.ok(res, "Success", "getBooking", getBooking, startTime);

      callback({
        status: 200,
        message: "getBooking.",
        data: getBooking,
      });
    } catch (error) {
      console.log(error, "Error");
    }
  }

  /**
   * @api {get} /api/app/booking/get-booking-driver/:lat/:long  Get Booking Driver
   * @apiVersion 1.0.0
   * @apiName Get Booking Driver
   * @apiGroup App-Booking
   */
  static async getBookingDriver(req, res, next) {
    console.log(req.user.id, "req.user.id");
    const { lat, long } = req.params;
    try {
      let getBooking = [];
      if (!req.user.isActiveRide && req.user.isOnline && req.user.isCarAdded) {
        getBooking = await Order.aggregate([
          {
            $geoNear: {
              near: {
                type: "Point",
                coordinates: [Number(long), Number(lat)],
              },
              distanceField: "distance",
              maxDistance: 5 * 1000, // 15000000,0
              spherical: true,
              key: "pickupLocation",
              distanceMultiplier: 0.001,
            },
          },
          {
            $match: {
              isPaid: false,
              status: "Pending",
              rideType: "Now",
              declineRideDriver: {
                $nin: [new mongoose.Types.ObjectId(req.user.id)],
              },
            },
          },

          {
            $lookup: {
              from: "users",
              localField: "customer",
              foreignField: "_id",
              as: "customer",
            },
          },
          {
            $unwind: "$customer",
          },
          {
            $addFields: {
              distance: "$distance",
            },
          },
          {
            $limit: 1,
          },
        ]);
      }

      console.log(getBooking, "getBooking");
      return _RS.ok(res, "Success", "getBooking", getBooking, startTime);
    } catch (error) {
      console.log(error, "Error");
      next(error);
    }
  }

  static async updateLocation(data, callback, socket, io) {
    try {
      console.log(data, "data");
      let getDriver = await User.findOne({ _id: data.driverId });
      getDriver.latitude = data.latitude;
      getDriver.longitude = data.longitude;
      (getDriver.user_location = {
        type: "Point",
        coordinates: [parseFloat(data.longitude), parseFloat(data.latitude)],
      }),
        getDriver.save();
      const memberSocket = socketObj.sockets[data.customerId] || null;
      console.log(memberSocket, "memberSocket");
      if (memberSocket) {
        memberSocket.emit("receiveupdatedLocation", {
          status: 201,
          message: "Driver Location Updated .",
          data: getDriver,
        });
      }
      callback({
        status: 200,
        message: "Driver Location Updated.",
        data: getDriver,
      });
    } catch (error) {
      console.log(error, "error");
    }
  }

  static async verifyOtpBooking(data, callback, socket, io) {
    try {
      let getBooking = await Order.findOne({ _id: data.bookingId });
      if (data.otp != getBooking.otp) {
        callback({
          status: 400,
          message: "Invaild OTP",
          data: {},
        });
      } else {
        getBooking.status = data.status;
        getBooking.otp = "";
        getBooking.save();
        // getBooking.driverId = getDriver._id;

        const memberSocket = socketObj.sockets[data.customerId] || null;
        if (memberSocket) {
          memberSocket.emit("receiveStatusUpdate", {
            status: 200,
            message: "Booking Status Changed.",
            data: getBooking,
          });
        }
        callback({
          status: 200,
          message: "Verify OTP Successfully.",
          data: getBooking,
        });
      }
    } catch (error) {
      console.log(error, "error");
    }
  }

  /**
   * @api {get} /api/app/booking/get-booking-list/:status  Get Booking List
   * @apiVersion 1.0.0
   * @apiName Get Booking List
   * @apiGroup App-Booking
   */

  static async getBookingList(req, res, next) { 
    console.log("user getBookingList"); 

    try {
      const options = {
        page: req.query.page || 1,
        limit: req.query.limit || 10,
        collation: {
          locale: "en",
        },
      };
      let filteredQuery: any = {};
      if (
        req.params.status == "Completed" ||
        req.params.status == "Cancelled"
      ) {
        filteredQuery.status = req.params.status;
      } else {
        filteredQuery.status = { $nin: ["Completed", "Cancelled"] };
      }
      let query: any = [
        {
          $match: filteredQuery,
        },
        {
          $match: {
            driver: new mongoose.Types.ObjectId(req.user.id),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "driver",
            foreignField: "_id",
            as: "driver",
          },
        },
        {
          $unwind: {
            path: "$driver",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "customer",
            foreignField: "_id",
            as: "customer",
          },
        },
        {
          $unwind: {
            path: "$customer",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $sort: {
            created_at: -1,
          },
        },
      ];

      var myAggregate = Order.aggregate(query);
      const getBookingNew = await Order.aggregatePaginate(myAggregate, options);

      // const getBooking =
      //   req.params.status == "Completed" || req.params.status == "Cancelled"
      //     ? await Order.find({
      //         status: req.params.status,
      //       }).populate("driver customer")
      //     : await Order.find({
      //         driver: req.user.id,
      //         status: { $nin: ["Completed", "Cancelled"] },
      //       }).populate("driver customer");
      return _RS.ok(res, "Success", "getBooking", getBookingNew, startTime);
    } catch (error) {
      next(error);
    }
  }
  /**
   * @api {get} /api/app/booking/get-booking-list-customer/:status  Get Booking List
   * @apiVersion 1.0.0
   * @apiName Get Booking List
   * @apiGroup App-Booking
   */

  static async getBookingListCustomer(req, res, next) {
    try {
      const getBooking =
        req.params.status == "Completed" || req.params.status == "Cancelled"
          ? await Order.find({
              status: req.params.status,
              customer: req.user.id,
            }).populate("driver customer")
          : await Order.find({
              customer: req.user.id,
              status: { $nin: ["Completed", "Cancelled"] },
            }).populate("driver customer");
      return _RS.ok(res, "Success", "getBooking", getBooking, startTime);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @api {get} /api/app/booking/pre-booking-ride-list  Pre Booking Ride List
   * @apiVersion 1.0.0
   * @apiName Pre Booking Ride List
   * @apiGroup App-Booking
   */
  static async preBookingRide(req, res, next) {
    try {
      let sort: any = [["created_at", -1]];
      if (req.query.sort) {
        const map = Array.prototype.map;
        sort = Object.keys(req.query.sort).map((key) => [
          key,
          req.query.sort[key],
        ]);
        console.log(sort, "sort");
      }

      const options = {
        page: req.query.page || 1,
        limit: req.query.limit || 10,
        collation: {
          locale: "en",
        },
      };
      let filteredQuery: any = {};

      if (req.user.type == "User") {
        filteredQuery["customer._id"] = new mongoose.Types.ObjectId(
          req.user.id
        );
      }

      if (req.user.type == "Driver") {
        filteredQuery["driver._id"] = new mongoose.Types.ObjectId(req.user.id);
      }

      let query: any = [
        {
          $lookup: {
            from: "users",
            localField: "driver",
            foreignField: "_id",
            as: "driver",
          },
        },
        {
          $unwind: {
            path: "$driver",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "customer",
            foreignField: "_id",
            as: "customer",
          },
        },
        {
          $unwind: {
            path: "$customer",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "carmodels",
            localField: "vehicleModel",
            foreignField: "_id",
            as: "vehicleModel",
          },
        },
        {
          $unwind: {
            path: "$vehicleModel",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "cartypes",
            localField: "vehicleType",
            foreignField: "_id",
            as: "vehicleType",
          },
        },
        {
          $unwind: {
            path: "$vehicleType",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "carmakes",
            localField: "vehicleMake",
            foreignField: "_id",
            as: "vehicleMake",
          },
        },
        {
          $unwind: {
            path: "$vehicleMake",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: filteredQuery,
        },
        {
          $sort: {
            created_at: -1,
          },
        },
      ];
      var myAggregate = Order.aggregate(query);
      const list = await Order.aggregatePaginate(myAggregate, options);
      // const list = await User.find({ type: "Expact" }).sort({ created_at: -1 });
      return _RS.ok(res, "SUCCESS", "List", { list: list }, startTime);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @api {post} /api/app/booking/cancel-ride  Cancel Ride List
   * @apiVersion 1.0.0
   * @apiName Cancel Ride List
   * @apiGroup App-Booking
   */
  static async cancelRide(req, res, next) {
    const { reason } = req.body;
    try {
      let getBooking = await Order.findOne({ _id: req.body.bookingId });
      getBooking.status = "Cancelled";
      getBooking.reason = reason;

      console.log(getBooking, "getBooking");

      let getDriver = await User.findOne({ _id: getBooking.driver });
      if (getDriver) {
        console.log(getDriver, "getDriver");
        getDriver.isActiveRide = false;
        getBooking.driver = getDriver._id; 
        getDriver.save();
      }
      getBooking.save();
      let memberSocket;

      if (req.user.type == "Driver") {
        memberSocket = socketObj.sockets[getBooking.customer] || null;
      } else {
        getBooking.driver
          ? (memberSocket = socketObj.sockets[getBooking.driver])
          : null || null;
      }

      console.log(memberSocket, "memberSocket");
      if (memberSocket) {
        memberSocket.emit("cancelRide", {
          status: 201,
          message: "Booking Status Changed.",
          data: getBooking,
        });
      }
      return _RS.ok(res, "SUCCESS", "List", getBooking, startTime);
    } catch (error) {
      next(error);
    }
  }
  /**
   * @api {post} /api/app/booking/get-booking/:id  Get Booking
   * @apiVersion 1.0.0
   * @apiName Get Booking
   * @apiGroup App-Booking
   */
  static async getBookingById(req, res, next) {
    try {
      let getBooking = await Order.find({
        _id: req.params.id,
      }).populate("driver customer");
      return _RS.ok(res, "SUCCESS", "List", getBooking, startTime);
    } catch (error) {
      next(error);
    }
  }
}
