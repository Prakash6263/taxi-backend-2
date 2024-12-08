import User from "../../models/User";
import _RS from "../../helpers/ResponseHelper";
import { date } from "joi";
import Auth from "../../Utils/Auth";
import MailHelper from "../../helpers/MailHelper";
const express = require("express");

export class GovermentController {
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
        console.log(req.query.search, "req.query.search");
        // filteredQuery = {
        //   name: {
        //     $regex: req.query.search,
        //     $options: "$i",
        //   },
        // };
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
            type: "Goverment",
            isVerify: true,
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
      // const list = await User.find({ type: "Data" }).sort({ created_at: -1 });
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
        type: "Goverment",
      });
      if (getData)
        return _RS.conflict(
          res,
          "COFLICT",
          "Goverment already exist with this email ",
          getData,
          startTime
        );
      const data = {
        email: email,
        mobileNumber: mobileNumber,
        countryCode: countryCode,
        name: name,
        type: "Goverment",
        userName: name,
        password: await Auth.encryptPassword("Test@123"),
        isApprove: true,
        isVerify: true,
        designation: designation,
        creditLimit: creditLimit,
      };
      const user = await new User(data).save();
      // await MailHelper.sendMailUser(user._id, "Send Credentials", "123456");
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
          "Goverment not found",
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
        type: "Goverment",
      });
      if (isCheck) {
        return _RS.conflict(
          res,
          "CONFLICT",
          "Goverment already exists with this email or phone number",
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
  static async viewUser(req, res, next) {
    try {
      const startTime = new Date().getTime();
      const id = req.params.id;
      let getData = await User.findOne({ _id: req.params.id });

      if (!getData)
        return _RS.notFound(
          res,
          "NOTFOUND",
          "Data not found",
          getData,
          startTime
        );

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
            isVerify: true,
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
}
