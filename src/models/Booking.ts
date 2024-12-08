import * as mongoose from "mongoose";
import { model, AggregatePaginateModel } from "mongoose";
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Schema = mongoose.Schema;
const Booking = new Schema(
  {
    driver: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    bookingId: {
      type: String,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    amount: {
      type: Number,
      default: 0,
    },
    driver_gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    book_for_self: {
      type: Boolean,
      default: true,
    },
    another_user_mobile: String,
    another_user_name: String,
    pickupAddress: { type: String },
    destinationAddress: { type: String },
    pickupLatitude: { type: Number },
    pickupLongitude: { type: Number },
    destinationLatitude: { type: Number },
    destinationLongitude: { type: Number },
    rideType: {
      type: String,
      enum: ["Now", "Scheduled"],
      default: "Now",
    },
    date: {
      type: Date,
    },
    time: {
      type: String,
    },
    from: {
      type: String,
    },
    to: {
      type: String,
    },
    day: {
      type: String,
    },
    rideTimeStamp: {
      type: Number,
    },
    rating: {
      type: Number,
      default: 0,
    },
    customerRating: {
      type: Number,
      default: 0,
    },
    review: {
      type: String,
    },
    cancelReason: {
      type: String,
    },
    subject: {
      type: String,
    },
    description: {
      type: String,
    },
    driverAmount: {
      type: Number,
      default: 0,
    },
    isRideStatus: {
      type: Boolean,
    },

    status: {
      type: String,
      enum: ["Pending", "Completed", "led", "Rescheduled"],
      default: "Pending",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    is_rating: {
      type: Boolean,
      default: false,
    },
    is_report: {
      type: Boolean,
      default: false,
    },
    customer_rating: {},
    driver_rating: {},
    start_ride_time: {},
    end_ride_time: {},
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

mongoose.plugin(aggregatePaginate);
export default model<any, AggregatePaginateModel<any>>("Booking", Booking);
