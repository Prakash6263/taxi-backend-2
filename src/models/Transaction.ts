import * as mongoose from "mongoose";
import { model, AggregatePaginateModel } from "mongoose";
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Schema = mongoose.Schema;
const Transaction = new Schema(
  {
    transactionId: {
      type: String,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    driver: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    carType: {
      type: Schema.Types.ObjectId,
      ref: "CarType",
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Refund", "Success", "Completed", "Cancelled"],
      default: "Success",
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    amount: {
      type: Number,
      default: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    discountCode: {
      type: String,
      default: null,
    },
    endDate: {
      type: String,
      default: null,
    },
    paymentId: {
      type: String,
      default: null,
    },
    refundAmount: {
      type: Number,
      default: 0,
    },
    inoviceNumber: {
      type: String,
      default: null,
    },
    paymentMethod: {
      type: String,
      default: null,
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

export default model<any, AggregatePaginateModel<any>>(
  "Transaction",
  Transaction
);
