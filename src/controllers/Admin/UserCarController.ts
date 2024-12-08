import _RS from "../../helpers/ResponseHelper";
import { date } from "joi";
import Auth from "../../Utils/Auth";
import MailHelper from "../../helpers/MailHelper";
import UserCar from "../../models/UserCar";
import User from "../../models/User";
import NotificationService from "../../services/NotificationService";
const express = require("express");

export class UserCarController {
  static async list(req, res, next) {
    try {
      const startTime = new Date().getTime();

      let sort: any = [["created_at", -1]];
      if (req.query.sort) {
        const map = Array.prototype.map;
        sort = Object.keys(req.query.sort).map((key) => [
          key,
          req.query.sort[key],
        ]);
        console.log(sort, "sort");
      }

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
            carNumber: {
              $regex: new RegExp(req.query.search),
              $options: "i",
            },
          },
          {
            carName: {
              $regex: new RegExp(req.query.search),
              $options: "i",
            },
          },
          {
            fuelType: {
              $regex: new RegExp(req.query.search),
              $options: "i",
            },
          },
          {
            "user.name": {
              $regex: new RegExp(req.query.search),
              $options: "i",
            },
          },
          {
            "carType.name": {
              $regex: new RegExp(req.query.search),
              $options: "i",
            },
          },
          {
            "carMake.name": {
              $regex: new RegExp(req.query.search),
              $options: "i",
            },
          },
          {
            "carModel.name": {
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
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "cartypes",
            localField: "carType",
            foreignField: "_id",
            as: "carType",
          },
        },
        {
          $unwind: {
            path: "$carType",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "carmakes",
            localField: "carMake",
            foreignField: "_id",
            as: "carMake",
          },
        },
        {
          $unwind: {
            path: "$carMake",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "carmodels",
            localField: "carModel",
            foreignField: "_id",
            as: "carModel",
          },
        },
        {
          $unwind: {
            path: "$carModel",
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
      var myAggregate = UserCar.aggregate(query);
      const list = await UserCar.aggregatePaginate(myAggregate, options);
      return _RS.ok(res, "SUCCESS", "List", { list: list }, startTime);
    } catch (err) {
      next(err);
    }
  }

  static async statusChange(req, res, next) {
    try {
      const startTime = new Date().getTime();
      const id = req.params.id;
      const getCar = await UserCar.findOne({ _id: req.params.id });
      if (!getCar)
        return _RS.notFound(
          res,
          "NOTFOUND",
          "Expact not found",
          getCar,
          startTime
        );
      (getCar.is_active = !getCar.is_active), getCar.save();

      return _RS.ok(
        res,
        "SUCCESS",
        "Status Change Successfully",
        getCar,
        startTime
      );
      // return _RS.ok(res, "SUCCESS", "List", { list: list }, startTime);
    } catch (err) {
      next(err);
    }
  }

  static async viewCar(req, res, next) {
    try {
      const startTime = new Date().getTime();
      const id = req.params.id;
      console.log(id, "id");
      let getData = await UserCar.findOne({ user: id })
        .populate([
          {
            path: "carModel",
            select: "name _id",
          },
          {
            path: "carMake",
            select: "name _id",
          },
          {
            path: "carType",
            select: "name _id",
          },
        ])
        .lean();

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

  static async approveRejectCar(req, res, next) {
    try {
      const startTime = new Date().getTime();
      const id = req.params.id;
      const type = req.query.type;
      const getCar = await UserCar.findOne({ _id: req.params.id });
      if (!getCar)
        return _RS.notFound(
          res,
          "NOTFOUND",
          "User not found",
          getCar,
          startTime
        );
      // (getCar.isApprove = true),
      if (type == "is_approved") {
        getCar.isApprove = true;
        (getCar.is_active = true), getCar.save();

        const getDefaultCar = await UserCar.findOne({
          user: getCar.user,
          isDefault: true,
        });
        if (!getDefaultCar) {
          await UserCar.updateMany(
            { _id: req.params.id },
            { $set: { isDefault: true } }
          );

          await User.findOneAndUpdate(
            { _id: getCar.user },
            { $set: { car: req.params.id, isCarAdded: true } }
          );
        }
        await User.findOneAndUpdate(
          { _id: getCar.user },
          { $set: { car: req.params.id, isCarAdded: true } }
        );
        await NotificationService.sendNotification(
          getCar.user,
          "Welcome, your Car has been accepted by the admin"
        );
      } else if (type == "is_rejected") {
        await UserCar.findOneAndDelete({ _id: req.params.id });
      }

      return _RS.ok(
        res,
        "SUCCESS",
        "Approve Car Successfully",
        getCar,
        startTime
      );
      // return _RS.ok(res, "SUCCESS", "List", { list: list }, startTime);
    } catch (err) {
      next(err);
    }
  }
}
