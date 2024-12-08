import * as mongoose from "mongoose";
import { model, AggregatePaginateModel } from "mongoose";
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Schema = mongoose.Schema;
const User = new Schema(
  {
    userId: {
      type: String,
    },
    userName: {
      type: String,
    },
    name: {
      type: String,
    },
    hotelName: {
      type: String,
    },
    mobileNumber: {
      type: String,
    },
    countryCode: {
      type: String,
    },
    email: {
      type: String,
    },
    designation: {
      type: String,
    },
    password: {
      type: String,
    },
    uniqueId: {
      type: String,
    },
    dob: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "Male",
    },
    age: {
      type: Number,
      default: 0,
    },

    address: {
      type: String,
    },
    city_id: Number,
    is_active: {
      type: Boolean,
      default: true,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      default: null,
    },

    creditLimit: {
      type: Number,
      default: 0,
    },
    language: {
      type: String,
      default: "en",
    },
    languageId: {
      type: Schema.Types.ObjectId,
      ref: "Language",
    },

    type: {
      type: String,
      enum: ["User", "Hotel", "Goverment", "Driver"],
      default: "User",
    },
   

    description: {
      type: String,
      default: null,
    },

    isProfileCompleted: {
      type: Boolean,
      default: false,
    },
    is_notification: {
      type: Boolean,
      default: true,
    },
    isApprove: {
      type: Boolean,
      default: false,
    },
    subscription: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
    },
    car: {
      type: Schema.Types.ObjectId,
      ref: "UserCar",
    },
    isSubscription: {
      type: Boolean,
      default: false,
    },

    experience: {
      type: Number,
      default: 0,
    },
    loginType: {
      type: String,
      enum: ["Email", "Google", "Facebook", "Apple", "Phone"],
      default: "Email",
    },
    deviceType: {
      type: String,
      enum: ["Android", "Ios"],
      default: "Android",
    },
    country: {
      type: String,
      default: null,
    },
    endDate: {
      type: String,
      default: null,
    },
    voipToken: {
      type: String,
      default: null,
    },
    isCar: {
      type: Boolean,
      default: false,
    },
    isCarAdded: {
      type: Boolean,
      default: false,
    },

    latitude: {
      type: Number,
      default: 0.0,
    },
    longitude: {
      type: Number,
      default: 0.0,
    },

    deviceToken: {
      type: String,
      default: null,
    },
    socialId: {
      type: String,
      default: null,
    },
    myReferralCode: {
      type: String,
      default: null,
    },
    referByCode: {
      type: String,
      default: null,
    },
    accountId: {
      type: String,
      default: null,
    },
    socialSecurityNumber: {
      type: String,
      default: null,
    },
    isVerify: {
      type: Boolean,
      default: false,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    isActiveRide: {
      type: Boolean,
      default: false,
    },
    profileImage: { type: String },
    bankAccountDocument: { type: String, default: null },
    drivingLicence: { type: String, default: null },
    drivingLicenceBack: { type: String, default: null },
    govermentId: { type: String, default: null },
    user_location: {
      type: { type: String },
      coordinates: [Number],
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
User.index({ user_location: "2dsphere" });

export default model<any, AggregatePaginateModel<any>>("User", User);
