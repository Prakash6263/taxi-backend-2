import { Schema, model, AggregatePaginateModel } from "mongoose";
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const ContentSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    is_status: {
      type: Boolean,
      default: true,
    },
    slug: {
      type: String,
    },
    description: {
      type: String,
    },
    l_description: {
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
ContentSchema.plugin(aggregatePaginate);

const Content = model("Content", ContentSchema);

export default Content;
