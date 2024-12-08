import * as mongoose from "mongoose";
import { model, AggregatePaginateModel } from "mongoose";
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Schema = mongoose.Schema;

const Rides = new Schema(
  {
    customerName: { type: String, default: null },
    customerPhoneNumber: { type: String, default: null },
    customerCountryCode: { type: String, default: null },
    pickupAddress: { type: String, default: null },
    destinationAddress: { type: String, default: null },
    pickupLatitude: { type: Number, default: null },
    pickupLongitude: { type: Number, default: null },
    destinationLatitude: { type: Number, default: null },
    destinationLongitude: { type: Number, default: null },
    rideType: {
      type: String,
      enum: ["Now", "Scheduled"],
      default: "Now",
    },
    paymentType: {
      type: String,
      enum: ["Cash", "ByHotel"],
      default: "Cash",
    },
    city: { type: String},
    state: { type: String },
    country: { type: String},
    landmark: { type: String },
    house_no: { type: String },
    user_id: { type: Schema.Types.ObjectId, ref: "User" },
    driver_id: { type: Schema.Types.ObjectId, ref: "User" },
    hotel: { type: Schema.Types.ObjectId, ref: "User" },
    vehicle_id:{ type: Schema.Types.ObjectId, ref: "UserCar" },
    pickupLocation: {
      type: { type: String },
      coordinates: [Number],
    },
    dropLocation: {
      type: { type: String },
      coordinates: [Number],
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
Rides.index({ pickupLocation: "2dsphere" });
Rides.index({ dropLocation: "2dsphere" });

export default model<any, AggregatePaginateModel<any>>("Rides", Rides);
