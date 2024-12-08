import User from "../../models/User";
import _RS from "../../helpers/ResponseHelper";
import { date } from "joi";
import Auth from "../../Utils/Auth";
import MailHelper from "../../helpers/MailHelper";
import Admin from "../../models/Admin";
const express = require("express");

export class SubAdminController {
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
            type: "SubAdmin",
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
      var myAggregate = Admin.aggregate(query);
      const list = await Admin.aggregatePaginate(myAggregate, options);
      // const list = await Admin.find({ type: "Expact" }).sort({ created_at: -1 });
      return _RS.ok(res, "SUCCESS", "List", { list: list }, startTime);
    } catch (err) {
      next(err);
    }
    // try {
    //   const startTime = new Date().getTime();
    //   const list = await Admin.find({ type: "Psychologist" }).sort({
    //     created_at: -1,
    //   });
    //   return _RS.ok(res, "SUCCESS", "List", { list: list }, startTime);
    // } catch (err) {
    //   next(err);
    // }
  }
  static async addUser(req, res, next) {
    try {
      const startTime = new Date().getTime();
      const { email, mobileNumber, countryCode, name, creditLimit } = req.body;
      const getPsychologist = await Admin.findOne({
        $or: [
          {
            email: email,
          },
          { phoneNumber: mobileNumber, countryCode: countryCode },
        ],
      });
      if (getPsychologist)
        return _RS.conflict(
          res,
          "COFLICT",
          "User already exist with this email ",
          getPsychologist,
          startTime
        );
      const data = {
        email: email,
        phoneNumber: mobileNumber,
        countryCode: countryCode,
        name: name,
        userName: name,
        password: await Auth.encryptPassword("Test@123"),
        type: "SubAdmin",
      };
      const user = await new Admin(data).save();
      // await MailHelper.sendMailUser(Admin._id, "Send Credentials", "123456");
      return _RS.created(res, "SUCCESS", "Add User Successfully", user);
    } catch (err) {
      next(err);
    }
  }
  static async editUser(req, res, next) {
    try {
      const startTime = new Date().getTime();
      const { email, mobileNumber, countryCode, name } = req.body;
      const id = req.params.id;

      const getPsychologist = await Admin.findOne({ _id: id });
      console.log(getPsychologist);
      if (!getPsychologist)
        return _RS.notFound(
          res,
          "NOTFOUND",
          "Admin not found",
          getPsychologist,
          startTime
        );

      const isCheck = await Admin.findOne({
        $or: [
          {
            email: email,
          },
          { phoneNumber: mobileNumber, countryCode: countryCode },
        ],
        _id: { $ne: id },
      });
      if (isCheck) {
        return _RS.conflict(
          res,
          "CONFLICT",
          "Admin already exists with this email or phone number",
          isCheck,
          startTime
        );
      }
      // const data = {
      //   email: email,
      //   mobileNumber: mobileNumber,
      //   countryCode: countryCode,
      //   name: name,
      // };
      (getPsychologist.name = name ? name : getPsychologist.name),
        (getPsychologist.userName = name ? name : getPsychologist.userName),
        (getPsychologist.phoneNumber = mobileNumber
          ? mobileNumber
          : getPsychologist.phoneNumber),
        (getPsychologist.countryCode = countryCode
          ? countryCode
          : getPsychologist.countryCode),
        (getPsychologist.email = email ? email : getPsychologist.email),
        getPsychologist.save();

      // const user = await new User(data).save();
      return _RS.ok(
        res,
        "SUCCESS",
        "Update data Successfully",
        getPsychologist,
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
      const getExpact = await Admin.findOne({ _id: req.params.id });
      if (!getExpact)
        return _RS.notFound(
          res,
          "NOTFOUND",
          "Admin not found",
          getExpact,
          startTime
        );
      (getExpact.is_active = !getExpact.is_active), getExpact.save();

      return _RS.ok(
        res,
        "SUCCESS",
        "Status Change Successfully",
        getExpact,
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
      const getExpact = await Admin.findOne({ _id: req.params.id });

      if (!getExpact)
        return _RS.notFound(
          res,
          "NOTFOUND",
          "Expact not found",
          getExpact,
          startTime
        );
      (getExpact.is_deleted = true), getExpact.save();

      return _RS.ok(
        res,
        "SUCCESS",
        "Status Change Successfully",
        getExpact,
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
      let getExpact = await Admin.findOne({ _id: req.params.id });

      if (!getExpact)
        return _RS.notFound(
          res,
          "NOTFOUND",
          "Expact not found",
          getExpact,
          startTime
        );

      return _RS.ok(
        res,
        "SUCCESS",
        "Status Change Successfully",
        getExpact,
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

      const getUser = await Admin.aggregate(query);
      // const getUser = await Admin.find({ type: req.params.type }).populate(
      //   "therapists psychologistLanguage languageId areaOfExperties subscription psychologistType"
      // );
      return _RS.ok(res, "SUCCESS", "List", getUser, new Date().getTime());
    } catch (error) {
      next(error);
    }
  }
}
