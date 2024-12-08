import _RS from "../../helpers/ResponseHelper";
import Transaction from "../../models/Transaction";
const ObjectId = require("mongodb").ObjectId;
export class TransactionController {
  static async list(req, res, next) {
    try {
      const startTime = new Date().getTime();

      let sort: any = [["createdAt", -1]];
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
        filteredQuery.$or = [
          {
            transactionId: {
              $regex: new RegExp(req.query.search),
              $options: "i",
            },
          },
          {
            "customer.name": {
              $regex: new RegExp(req.query.search),
              $options: "i",
            },
          },
          {
            "customer.phoneNumber": {
              $regex: new RegExp(req.query.search),
              $options: "i",
            },
          },
          {
            "customer.email": {
              $regex: new RegExp(req.query.search),
              $options: "i",
            },
          },
          {
            "driver.phoneNumber": {
              $regex: new RegExp(req.query.search),
              $options: "i",
            },
          },
          {
            "driver.name": {
              $regex: new RegExp(req.query.search),
              $options: "i",
            },
          },
          {
            "driver.phoneNumber": {
              $regex: new RegExp(req.query.search),
              $options: "i",
            },
          },
        ];
      }
      if (req.query.start_date && req.query.start_date.trim()) {
        filteredQuery.created_at = { $gte: new Date(req.query.start_date) };
      }
      if (req.query.end_date && req.query.end_date.trim()) {
        filteredQuery.created_at = { $lte: new Date(req.query.end_date) };
      }
      if (req.query.start_date && req.query.end_date) {
        filteredQuery.created_at = {
          $gte: new Date(req.query.start_date + "T00:00:00Z"),
          $lte: new Date(req.query.end_date + "T23:59:59Z"),
        };
      }

      if (req.query.customer && req.query.customer.length > 0) {
        const serviceIds = req.query.customer
          .split(",")
          .map((id) => ObjectId(id));
        // console.log(serviceIds, "serviceIds");
        filteredQuery.$or = [{ "customer._id": { $in: serviceIds } }];
      }

      if (req.query.carType && req.query.carType.length > 0) {
        // console.log(req.query.psy);
        const serviceIds = req.query.carType
          .split(",")
          .map((id) => ObjectId(id));
        filteredQuery.$or = [{ "carType._id": { $in: serviceIds } }];
      }
      if (req.query.driver && req.query.driver.length > 0) {
        // console.log(req.query.psy);
        const serviceIds = req.query.driver
          .split(",")
          .map((id) => ObjectId(id));
        filteredQuery.$or = [{ "driver._id": { $in: serviceIds } }];
      }
      let query: any = [
        {
          $lookup: {
            from: "users",
            localField: "customer",
            foreignField: "_id",
            as: "customer",
          },
        },
        {
          $unwind: {
            path: "$customer",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "driver",
            foreignField: "_id",
            as: "driver",
          },
        },
        {
          $unwind: {
            path: "$driver",
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
          $match: filteredQuery,
        },
        {
          $sort: {
            updated_at: -1,
          },
        },
      ];
      var myAggregate = Transaction.aggregate(query);
      const list = await Transaction.aggregatePaginate(myAggregate, options);
      // const list = await User.find({ type: "Expact" }).sort({ created_at: -1 });
      return _RS.ok(res, "SUCCESS", "List", { list: list }, startTime);
    } catch (err) {
      next(err);
    }
  }
  static async getList(req, res, next) {
    try {
      let filteredQuery: any = {};
      if (req.query.search && req.query.search.trim()) {
        console.log(req.query.search, "req.query.search");
        filteredQuery.$or = [
          {
            transactionId: {
              $regex: new RegExp(req.query.search),
              $options: "i",
            },
          },
          {
            "customer.name": {
              $regex: new RegExp(req.query.search),
              $options: "i",
            },
          },
          {
            "customer.phoneNumber": {
              $regex: new RegExp(req.query.search),
              $options: "i",
            },
          },
          {
            "customer.email": {
              $regex: new RegExp(req.query.search),
              $options: "i",
            },
          },
          {
            "psychologist.phoneNumber": {
              $regex: new RegExp(req.query.search),
              $options: "i",
            },
          },
          {
            "psychologist.name": {
              $regex: new RegExp(req.query.search),
              $options: "i",
            },
          },
          {
            "psychologist.phoneNumber": {
              $regex: new RegExp(req.query.search),
              $options: "i",
            },
          },
        ];
      }
      if (req.query.start_date && req.query.start_date.trim()) {
        filteredQuery.created_at = { $gte: new Date(req.query.start_date) };
      }
      if (req.query.end_date && req.query.end_date.trim()) {
        filteredQuery.created_at = { $lte: new Date(req.query.end_date) };
      }
      if (req.query.start_date && req.query.end_date) {
        filteredQuery.created_at = {
          $gte: new Date(req.query.start_date + "T00:00:00Z"),
          $lte: new Date(req.query.end_date + "T23:59:59Z"),
        };
      }

      if (req.query.customer && req.query.customer.length > 0) {
        // console.log(req.query.psy);
        const serviceIds = req.query.customer
          .split(",")
          .map((id) => ObjectId(id));
        // console.log(serviceIds, "serviceIds");
        filteredQuery.$or = [{ "customer._id": { $in: serviceIds } }];
      }

      if (req.query.carType && req.query.carType.length > 0) {
        // console.log(req.query.psy);
        const serviceIds = req.query.carType
          .split(",")
          .map((id) => ObjectId(id));
        // console.log(serviceIds, "serviceIds");
        filteredQuery.$or = [{ "carType._id": { $in: serviceIds } }];
      }
      if (req.query.driver && req.query.driver.length > 0) {
        // console.log(req.query.psy);
        const serviceIds = req.query.driver
          .split(",")
          .map((id) => ObjectId(id));
        // console.log(serviceIds, "serviceIds");
        filteredQuery.$or = [{ "driver._id": { $in: serviceIds } }];
      }
      let query: any = [
        {
          $lookup: {
            from: "users",
            localField: "customer",
            foreignField: "_id",
            as: "customer",
          },
        },
        {
          $unwind: {
            path: "$customer",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "psychologist",
            foreignField: "_id",
            as: "psychologist",
          },
        },
        {
          $unwind: {
            path: "$psychologist",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: filteredQuery,
        },
        {
          $sort: {
            updated_at: -1,
          },
        },
      ];
      const getUser = await Transaction.aggregate(query);
      // const getUser = await Transaction.find({ filter }).populate("customer");
      return _RS.ok(res, "SUCCESS", "List", getUser, new Date().getTime());
    } catch (error) {
      next(error);
    }
  }
}
