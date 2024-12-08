import { Schema, model, AggregatePaginateModel } from "mongoose";
import * as mongoose from "mongoose";
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const EmailTemplate = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    is_status: {
      type: Boolean,
      default: true,
    },
    subject: {
      type: String,
    },
    body: {
      type: String,
    },
  },
  { timestamps: true }
);

function deviceLimit(val) {
  if (val.length > 4) {
    this.deviceInfo.shift();
  }
  return true;
}
mongoose.plugin(aggregatePaginate);

export default model<any, AggregatePaginateModel<any>>(
  "EmailTemplate",
  EmailTemplate
);
