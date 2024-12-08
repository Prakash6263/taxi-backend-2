import Order from "../models/Order";
import User from "../models/User";
import NotificationService from "../services/NotificationService";
import * as mongoose from "mongoose";
const startTime = new Date().getTime();
export class CronController {
  static async sendNotification() {
    try {
      const getBooking = await Order.find({
        status: "Pending",
        isPaid: false,
        rideType: "Now",
      });

      console.log(getBooking.length, "111");

      getBooking.length > 0 &&
        getBooking.map(async (data) => {
          const getAllDriver = await User.aggregate([
            {
              $geoNear: {
                near: {
                  type: "Point",
                  coordinates: [
                    Number(data.pickupLongitude),
                    Number(data.pickupLatitude),
                  ],
                },
                distanceField: "distance",
                maxDistance: 5 * 1000, // 15000000,0
                spherical: true,
                key: "user_location",
                distanceMultiplier: 0.001,
              },
            },
            {
              $match: {
                $or: [
                  { _id: { $nin: data.notificationSendUser } },
                  { _id: { $nin: data.declineRideDriver } },
                ],
                is_active: true,
                isApprove: true,
                isOnline: true,
                type: "Driver",
                isActiveRide: false,
                isCarAdded: true,
              },
            },

            {
              $addFields: {
                distance: "$distance",
              },
            },
          ]);

          // console.log(getAllDriver, "getAllDriver");

          getAllDriver.length > 0 &&
            getAllDriver.map(async (driver) => {
              await NotificationService.sendNotification(
                driver._id,
                "Booking Coming"
              );
              await Order.updateOne(
                { _id: new mongoose.Types.ObjectId(data._id) },
                { $push: { notificationSendUser: driver._id } }
              );
            });
        });
    } catch (error) {}
  }
  static async deleteNotCompleteBooking() {
    try {
      const getBooking = await Order.find({
        status: "Pending",
        isPaid: false,
      });

      console.log(getBooking.length, "111");

      getBooking.length > 0 &&
        getBooking.map(async (data) => {
          const getAllDriver = await User.aggregate([
            {
              $geoNear: {
                near: {
                  type: "Point",
                  coordinates: [
                    Number(data.pickupLongitude),
                    Number(data.pickupLatitude),
                  ],
                },
                distanceField: "distance",
                maxDistance: 5 * 1000, // 15000000,0
                spherical: true,
                key: "user_location",
                distanceMultiplier: 0.001,
              },
            },
            {
              $match: {
                $or: [
                  { _id: { $nin: data.notificationSendUser } },
                  { _id: { $nin: data.declineRideDriver } },
                ],
                is_active: true,
                isApprove: true,
                isOnline: true,
                type: "Driver",
                isActiveRide: false,
                isCarAdded: true,
              },
            },

            {
              $addFields: {
                distance: "$distance",
              },
            },
          ]);

          // console.log(getAllDriver, "getAllDriver");

          getAllDriver.length > 0 &&
            getAllDriver.map(async (driver) => {
              await NotificationService.sendNotification(
                driver._id,
                "Booking Coming"
              );
              await Order.updateOne(
                { _id: new mongoose.Types.ObjectId(data._id) },
                { $push: { notificationSendUser: driver._id } }
              );
            });
        });
    } catch (error) {}
  }
}
