import User from "../../models/User";
import UserCar from "../../models/UserCar";
import _RS from "../../helpers/ResponseHelper";
import { date } from "joi";
import Auth from "../../Utils/Auth";
import MailHelper from "../../helpers/MailHelper";
import NotificationService from "../../services/NotificationService";
const express = require("express");

export class DriverController {
  static async list(req, res, next) {
    try {
      const startTime = new Date().getTime();

      const options = {
        page: req.query.page || 1,
        limit: req.query.limit || 10,
        collation: {
          locale: "en",
        },
      };
      let filteredQuery: any = {};
      if (req.query.search && req.query.search.trim()) {
        filteredQuery.$or = [
          {
            name: {
              $regex: new RegExp(req.query.search),
              $options: "i",
            },
          },
          {
            email: {
              $regex: new RegExp(req.query.search),
              $options: "i",
            },
          },
          {
            mobileNumber: {
              $regex: new RegExp(req.query.search),
              $options: "i",
            },
          },
          {
            countryCode: {
              $regex: new RegExp(req.query.search),
              $options: "i",
            },
          },
        ];
      }

      if (req.query.start_date && req.query.start_date.trim()) {
        filteredQuery.created_at = {
          $gte: new Date(req.query.start_date + "T00:00:00Z"),
        };
      }

      if (req.query.end_date && req.query.end_date.trim()) {
        filteredQuery.created_at = {
          $lte: new Date(req.query.end_date + "T23:59:59Z"),
        };
      }
      if (req.query.start_date && req.query.end_date) {
        filteredQuery.created_at = {
          $gte: new Date(req.query.start_date + "T00:00:00Z"),
          $lte: new Date(req.query.end_date + "T23:59:59Z"),
        };
      }
      if (req.query.status && req.query.status.trim()) {
        var arrayValues = req.query.status.split(",");
        var booleanValues = arrayValues.map(function (value) {
          return value.toLowerCase() === "true";
        });
        filteredQuery.is_active = { $in: booleanValues };
      }
      if (req.query.isApprove && req.query.isApprove.trim()) {
        var arrayValues = req.query.isApprove.split(",");
        var booleanValues = arrayValues.map(function (value) {
          return value.toLowerCase() === "true";
        });
        filteredQuery.isApprove = { $in: booleanValues };
      }
      let query: any = [
        {
          $match: {
            type: "Driver",
            // isVerify: true,
            is_deleted: false,
          },
        },

        {
          $match: filteredQuery,
        },

        {
          $sort: {
            created_at: -1,
          },
        },
      ];
      var myAggregate = User.aggregate(query);
      const list = await User.aggregatePaginate(myAggregate, options);
      return _RS.ok(res, "SUCCESS", "List", { list: list }, startTime);
    } catch (err) {
      next(err);
    }
  }

  static async addData(req, res, next) {
    try {
      const startTime = new Date().getTime();
      const {
        email,
        mobileNumber,
        designation,
        countryCode,
        name,
        creditLimit,
      } = req.body;
      const getData = await User.findOne({
        $or: [
          {
            email: email,
          },
          { mobileNumber: mobileNumber, countryCode: countryCode },
        ],
        type: "Driver",
      });
      if (getData)
        return _RS.conflict(
          res,
          "COFLICT",
          "Driver already exist with this email or phone number ",
          getData,
          startTime
        );
      const data = {
        email: email,
        mobileNumber: mobileNumber,
        countryCode: countryCode,
        name: name,
        type: "Driver",
        userName: name,
        password: await Auth.encryptPassword("Test@123"),
        isApprove: true,
        isVerify: true,
        designation: designation,
        creditLimit: creditLimit,
      };
      const user = await new User(data).save();
      await MailHelper.sendMailUser(user._id, "Send Credentials", "Test@123");
      return _RS.created(res, "SUCCESS", "Add User Successfully", user);
    } catch (err) {
      next(err);
    }
  }
  static async editData(req, res, next) {
    try {
      const startTime = new Date().getTime();
      const {
        email,
        mobileNumber,
        countryCode,
        name,
        creditLimit,
        designation,
      } = req.body;
      const id = req.params.id;

      const getData = await User.findOne({ _id: id });
      if (!getData)
        return _RS.notFound(
          res,
          "NOTFOUND",
          "Data not found",
          getData,
          startTime
        );

      const isCheck = await User.findOne({
        $or: [
          {
            email: email,
          },
          { mobileNumber: mobileNumber, countryCode: countryCode },
        ],
        _id: { $ne: id },
        type: "Driver",
      });
      if (isCheck) {
        return _RS.conflict(
          res,
          "CONFLICT",
          "Driver already exists with this email or phone number",
          isCheck,
          startTime
        );
      }

      (getData.name = name ? name : getData.name),
        (getData.userName = name ? name : getData.userName),
        (getData.mobileNumber = mobileNumber
          ? mobileNumber
          : getData.mobileNumber),
        (getData.countryCode = countryCode ? countryCode : getData.countryCode),
        (getData.email = email ? email : getData.email),
        (getData.creditLimit = creditLimit ? creditLimit : getData.creditLimit),
        (getData.designation = designation ? designation : getData.designation),
        getData.save();

      // const user = await new User(data).save();
      return _RS.ok(
        res,
        "SUCCESS",
        "Update data Successfully",
        getData,
        startTime
      );
      // return _RS.ok(res, "SUCCESS", "List", { list: list }, startTime);
    } catch (err) {
      next(err);
    }
  }

  static async statusChange(req, res, next) {
    try {
      const startTime = new Date().getTime();
      const id = req.params.id;
      const getData = await User.findOne({ _id: req.params.id });
      if (!getData)
        return _RS.notFound(
          res,
          "NOTFOUND",
          "Data not found",
          getData,
          startTime
        );
      (getData.is_active = !getData.is_active), getData.save();

      return _RS.ok(
        res,
        "SUCCESS",
        "Status Change Successfully",
        getData,
        startTime
      );
      // return _RS.ok(res, "SUCCESS", "List", { list: list }, startTime);
    } catch (err) {
      next(err);
    }
  }
  static async deleteUser(req, res, next) {
    try {
      const startTime = new Date().getTime();
      const id = req.params.id;
      const getData = await User.findOne({ _id: req.params.id });

      if (!getData)
        return _RS.notFound(
          res,
          "NOTFOUND",
          "Data not found",
          getData,
          startTime
        );
      (getData.is_deleted = true), getData.save();

      return _RS.ok(
        res,
        "SUCCESS",
        "Status Change Successfully",
        getData,
        startTime
      );
      // return _RS.ok(res, "SUCCESS", "List", { list: list }, startTime);
    } catch (err) {
      next(err);
    }
  }

  static async viewDriver(req, res, next) {
    try {
      const startTime = new Date().getTime();
      const id = req.params.id;

      let getData = await User.findOne({ _id: id }).populate({
        path: "car",
        populate: [
          { path: "carMake" },
          { path: "carModel" },
          { path: "carType" }
        ]
      });

      if (!getData) {
        return _RS.notFound(
          res,
          "NOTFOUND",
          "Data not found",
          getData,
          startTime
        );
      }

      return _RS.ok(
        res,
        "SUCCESS",
        "User details retrieved successfully",
        getData,
        startTime
      );
    } catch (err) {
      next(err);
    }
  }


  static async getList(req, res, next) {
    try {
      let filteredQuery: any = {};

      if (req.query.search && req.query.search.trim()) {
        filteredQuery.$or = [
          {
            name: {
              $regex: new RegExp(req.query.search),
              $options: "i",
            },
          },
          {
            email: {
              $regex: new RegExp(req.query.search),
              $options: "i",
            },
          },
          {
            mobileNumber: {
              $regex: new RegExp(req.query.search),
              $options: "i",
            },
          },
          {
            countryCode: {
              $regex: new RegExp(req.query.search),
              $options: "i",
            },
          },
        ];
      }

      if (req.query.start_date && req.query.start_date.trim()) {
        filteredQuery.created_at = {
          $gte: new Date(req.query.start_date + "T00:00:00Z"),
        };
      }

      if (req.query.end_date && req.query.end_date.trim()) {
        filteredQuery.created_at = {
          $lte: new Date(req.query.end_date + "T23:59:59Z"),
        };
      }
      if (req.query.start_date && req.query.end_date) {
        filteredQuery.created_at = {
          $gte: new Date(req.query.start_date + "T00:00:00Z"),
          $lte: new Date(req.query.end_date + "T23:59:59Z"),
        };
      }
      if (req.query.status && req.query.status.trim()) {
        var arrayValues = req.query.status.split(",");
        var booleanValues = arrayValues.map(function (value) {
          return value.toLowerCase() === "true";
        });
        filteredQuery.is_active = { $in: booleanValues };
      }
      console.log(filteredQuery, "filteredQuery");
      let query: any = [
        {
          $match: {
            type: req.params.type,
            // isVerify: true,
            is_deleted: false,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "therapists",
            foreignField: "_id",
            as: "therapists",
          },
        },
        {
          $unwind: {
            path: "$therapists",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "languages",
            localField: "languageId",
            foreignField: "_id",
            as: "languageId",
          },
        },
        {
          $unwind: {
            path: "$languageId",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "languages",
            localField: "psychologistLanguage",
            foreignField: "_id",
            as: "psychologistLanguage",
          },
        },
        {
          $lookup: {
            from: "psychologisttypes",
            localField: "psychologistType",
            foreignField: "_id",
            as: "psychologistType",
          },
        },
        {
          $unwind: {
            path: "$psychologistType",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: filteredQuery,
        },
        {
          $sort: {
            created_at: -1,
          },
        },
      ];

      const getUser = await User.aggregate(query);
      // const getUser = await User.find({ type: req.params.type }).populate(
      //   "therapists psychologistLanguage languageId areaOfExperties subscription psychologistType"
      // );
      return _RS.ok(res, "SUCCESS", "List", getUser, new Date().getTime());
    } catch (error) {
      next(error);
    }
  }

  static async approveDriver(req, res, next) {
    try {
      const startTime = new Date().getTime();
      const id = req.params.id;
      const type = req.query.type;
      const getUser = await User.findOne({ _id: req.params.id });
      if (!getUser)
        return _RS.notFound(
          res,
          "NOTFOUND",
          "User not found",
          getUser,
          startTime
        );
      // (getUser.isApprove = true),
      if (type == "is_approved") {
        await NotificationService.sendNotification(
          getUser._id,
          "Welcome, your request has been accepted by the admin"
        );
        getUser.isApprove = true;
      } else if (type == "is_rejected") {
        getUser.isApprove = false;
        getUser.email = "";
        getUser.mobileNumber = "";
        getUser.is_deleted = true;
      }

      (getUser.is_active = true), getUser.save();

      return _RS.ok(
        res,
        "SUCCESS",
        "Approve Driver SUccessfully",
        getUser,
        startTime
      );
      // return _RS.ok(res, "SUCCESS", "List", { list: list }, startTime);
    } catch (err) {
      next(err);
    }
  }
}
