import * as mongoose from "mongoose";
import { model, AggregatePaginateModel } from "mongoose";
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Schema = mongoose.Schema;
const Coupon = new Schema(
  {
    promoCode: {
      type: String,
    },
    type: {
      type: String,
      default: "Subscription",
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    noOfUse: {
      type: Number,
      default: 0,
    },
    noOfUser: {
      type: Number,
      default: 0,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    maxAmount: {
      type: Number,
      default: 0,
    },
    minAmount: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
    },
    title: {
      type: String,
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

export default model<any, AggregatePaginateModel<any>>("Coupon", Coupon);
