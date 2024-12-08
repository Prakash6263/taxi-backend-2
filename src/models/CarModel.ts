import * as mongoose from "mongoose";
import { model, AggregatePaginateModel } from "mongoose";
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Schema = mongoose.Schema;
const CarModel = new Schema(
  {
    name: {
      type: String,
    },
    uniqueId: {
      type: String,
    },
    make: { type: Schema.Types.ObjectId, ref: "CarMake" },
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

export default model<any, AggregatePaginateModel<any>>("CarModel", CarModel);
