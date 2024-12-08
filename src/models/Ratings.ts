import * as mongoose from "mongoose";
import { model, AggregatePaginateModel } from "mongoose";
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Schema = mongoose.Schema;

const Rating = new Schema(
  {
    booking_id:{ type: Schema.Types.ObjectId, ref: "Booking" },
    Ride_id:{ type: Schema.Types.ObjectId, ref: "Rides" },
    from_user:{ type: Schema.Types.ObjectId, ref: "User" },
    to_user:{ type: Schema.Types.ObjectId, ref: "User" },
    rating_type:{
        type:String,
        enum:["User", "Hotel", "Goverment", "Driver"],
    },
    rating:Number, // rating can be any number out of 5
    description:String

  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

mongoose.plugin(aggregatePaginate);
// Rides.index({ pickupLocation: "2dsphere" });
// Rides.index({ dropLocation: "2dsphere" });

export default model<any, AggregatePaginateModel<any>>("Rating", Rating);
