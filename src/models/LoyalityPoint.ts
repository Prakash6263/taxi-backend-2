import * as mongoose from "mongoose";
import { model, AggregatePaginateModel } from "mongoose";
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Schema = mongoose.Schema;
const LoyalityPoint = new Schema(
  {
    redemptionRate: {
      type: Number,
      default: 0,
    },
    loyalityPointRedemption: {
      type: Number,
      default: 0,
    },
    conversionRate: {
      type: Number,
      default: 0,
    },
    loyalityPointConversion: {
      type: Number,
      default: 0,
    },
    uniqueId: {
      type: String,
    },

    is_status: {
      type: Boolean,
      default: true,
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
  "LoyalityPoint",
  LoyalityPoint
);
