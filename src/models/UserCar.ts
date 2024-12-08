import * as mongoose from "mongoose";
import { model, AggregatePaginateModel } from "mongoose";
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Schema = mongoose.Schema;

const UserCar = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    isDefault: {
      type: Boolean,
      default: false,
    },
    isApprove: {
      type: Boolean,
      default: false,
    },
    carType: { type: Schema.Types.ObjectId, ref: "CarType" },
    carModel: { type: Schema.Types.ObjectId, ref: "CarModel" },
    carMake: { type: Schema.Types.ObjectId, ref: "CarMake" },
    carNumber: { type: String, default: null },
    carColor: { type: String, default: null },
    carName: { type: String, default: null },
    fuelType: { type: String, default: null },
    carImage: { type: String, default: null },
    carPuc: { type: String, default: null },
    carInsurance: { type: String, default: null },
    carPermit: { type: String, default: null },
    carRegistrationCertificate: { type: String, default: null },
    carRegistrationCertificateBack: { type: String, default: null },
    chassisNumber: { type: String, default: null },
    frontNumberPlate: { type: String, default: null },
    backNumberPlate: { type: String, default: null },
    leftExrerior: { type: String, default: null },
    rightExrerior: { type: String, default: null },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

mongoose.plugin(aggregatePaginate);

export default model<any, AggregatePaginateModel<any>>("UserCar", UserCar);
