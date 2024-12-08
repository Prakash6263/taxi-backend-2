import * as mongoose from "mongoose";
import { model, AggregatePaginateModel } from "mongoose";
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Schema = mongoose.Schema;
const CouponSummary = new Schema(
    {
        promoCode: {
            type: String,
        },
        type: {
            type: String,
            default: "Subscription",
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
        is_active: {
            type: Boolean,
            default: true,
        },
        percentage: {
            type: Number,
            default: 0,
        },
        maxAmount: {
            type: Number,
            default: 0,
        },
        minAmount: {
            type: Number,
            default: 0,
        },
        description: {
            type: String,
        },
        title: {
            type: String,
        },
        status:{
            type:String,
            enum:["apply","redeem","cancel"]
        },
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        coupon_id:{
            type: Schema.Types.ObjectId,
            ref: "Coupon",
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

export default model<any, AggregatePaginateModel<any>>("CouponSummary", CouponSummary);
