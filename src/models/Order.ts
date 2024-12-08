import * as mongoose from "mongoose";
import { model, AggregatePaginateModel } from "mongoose";
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Schema = mongoose.Schema;

const Order = new Schema(
  {
    pickupAddress: { type: String, default: null },
    destinationAddress: { type: String, default: null },
    pickupLatitude: { type: Number, default: null },
    pickupLongitude: { type: Number, default: null },
    customerMidlocation: { type: String, default: null },
    customerMidLocationLat: { type: Number, default: null },
    customerMidLocationLong: { type: Number, default: null },
    destinationLatitude: { type: Number, default: null },
    destinationLongitude: { type: Number, default: null },
    city: { type: String, default: null },
    state: { type: String, default: null },
    country: { type: String, default: null },
    landmark: { type: String, default: null },
    house_no: { type: String, default: null },
    customer: { type: Schema.Types.ObjectId, ref: "User" },
    driver: { type: Schema.Types.ObjectId, ref: "User" },
    declineRideDriver: [{ type: Schema.Types.ObjectId, ref: "User" }],
    notificationSendUser: [{ type: Schema.Types.ObjectId, ref: "User" }],
    hotel: { type: Schema.Types.ObjectId, ref: "User" },
    vehicleType: { type: Schema.Types.ObjectId, ref: "CarType" },
    vehicleModel: { type: Schema.Types.ObjectId, ref: "CarModel" },
    vehicleMake: { type: Schema.Types.ObjectId, ref: "CarMake" },
    vehicleNumber: { type: String, default: null },
    vehicleColor: { type: String, default: null },
    amount: { type: Number, default: null },
    status: {
      type: String,
      enum: [
        "Pending",
        "InProgress",
        "Waiting",
        "Completed",
        "Cancelled",
        "On-the-Way",
        "Arrived",
        "Arrive",
        "Arriving",
        "Reject",
        "Drop",
      ],
      default: "Pending",
    },
    pickupLocation: {
      type: { type: String },
      coordinates: [Number],
    },
    dropLocation: {
      type: { type: String },
      coordinates: [Number],
    },
    rideType: {
      type: String,
      enum: ["Now", "Scheduled"],
      default: "Now",
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
    date: {
      type: Date,
    },
    otp: {
      type: Number,
      default: null,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    time: {
      type: String,
      default: null,
    },
    perMileAmount: {
      type: Number,
      default: null,
    },
    totalDistance: {
      type: Number,
      default: null,
    },
    totalAmount: {
      type: Number,
      default: null,
    },
    carType: {
      type: String,
      default: null,
    },
    seatCapacity: {
      type: String,
      default: null,
    },
    customer_rating: {
      type: Number,
      default: 0,
    },
    driver_rating: {
      type: Number,
      default: 0,
    },
    start_ride_time: {
      type: String,
      default: null,
    },
    end_ride_time: {
      type: String,
      default: null,
    },
    reason: {
      type: String,
      default: null,
    },
    crnNumber: {
      type: String,
      default: null,
    },
    otherPersonName: {
      type: String,
      default: null,
    },
    otherPersonContactNumber: {
      type: String,
      default: null,
    },
    isSelf:{
      type:Boolean,
      default:true
    },
    dateTimeStamp:{
      type:String,
      default:null
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

mongoose.plugin(aggregatePaginate);
Order.index({ pickupLocation: "2dsphere" });
Order.index({ dropLocation: "2dsphere" });

export default model<any, AggregatePaginateModel<any>>("Order", Order);
