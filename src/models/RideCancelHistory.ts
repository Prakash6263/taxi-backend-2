import * as mongoose from "mongoose";
import { model, AggregatePaginateModel } from "mongoose";
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Schema = mongoose.Schema;

const RidesCancelHistory = new Schema(
  {
    action_to:{ type: Schema.Types.ObjectId, ref: "User" },
    action_by:{ type: Schema.Types.ObjectId, ref: "User" },
    booking_id:{ type: Schema.Types.ObjectId, ref: "User" },
    type:{
        type:String,
        enum:["Accept","Decline"]
    },
    action_type:{
        type:String,
        enum: ["User", "Hotel", "Goverment", "Driver"],
    },
    description:String,
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

mongoose.plugin(aggregatePaginate);

export default model<any, AggregatePaginateModel<any>>("RidesCancelHistory", RidesCancelHistory);
