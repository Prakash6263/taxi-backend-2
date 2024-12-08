import * as mongoose from "mongoose";
import { model, AggregatePaginateModel } from "mongoose";
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Schema = mongoose.Schema;
const CarType = new Schema(
  {
    name: {
      type: String,
    },
    uniqueId: {
      type: String,
    },
    capacity: {
      type: Number,
    },
    image: {
      type: String,
    },
    price: {
      type: Number,
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

export default model<any, AggregatePaginateModel<any>>("CarType", CarType);
