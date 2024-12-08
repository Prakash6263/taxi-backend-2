import * as mongoose from "mongoose";
import { model, AggregatePaginateModel } from "mongoose";
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Schema = mongoose.Schema;
const UserNotification = new Schema(
  {
    title: {
      type: String,
    },
    message: {
      type: String,
    },
    type: {
      type: String,
      enum: ["Admin", "User"],
      default: "Admin",
    },
    image: {
      type: String,
      default: null,
    },
    allUser: {
      type: Boolean,
      default: false,
    },
    is_read: {
      type: Boolean,
      default: false,
    },
    user: { type: Schema.Types.ObjectId, ref: "User" },
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
  "UserNotification",
  UserNotification
);
