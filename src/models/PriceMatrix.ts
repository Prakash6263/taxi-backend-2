import * as mongoose from "mongoose";
import { model, AggregatePaginateModel } from "mongoose";
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Schema = mongoose.Schema;
const PriceMatrix = new Schema(
  {
    price: {
      type: Number,
      default: 0,
    },
    uniqueId: {
      type: String,
    },
    type: { type: Schema.Types.ObjectId, ref: "CarType" },
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
  "PriceMatrix",
  PriceMatrix
);
