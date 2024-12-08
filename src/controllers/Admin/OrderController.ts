import _RS from "../../helpers/ResponseHelper";
import BookingActivity from "../../models/BookingActivity";
import Order from "../../models/Order";
const ObjectId = require("mongodb").ObjectId;
const startTime = new Date().getTime();
export class OrderController {
  static async list(req, res, next) {
    // const data = [
    //   {
    //     customer: "660c01837bfb83e700ef2dd2",
    //     driver: "661509e676e6f2f377f8cb1c",
    //     vehicleType: "660d62a992a17d845c3a626b",
    //     vehicleModel: "66167ad4404d156c48f67adf",
    //     vehicleMake: "6610013b76e6f2f377f8c768",
    //     vehicleNumber: "RJ01SD9654",
    //     vehicleColor: "Red",
    //     amount: 250,
    //     pickupAddress: "80/227 Mansrovar Jaipur",
    //     destinationAddress: "Vashali Nagaer Jaipur",
    //   },
    //   {
    //     customer: "660fffd676e6f2f377f8c6fb",
    //     driver: "6610011b76e6f2f377f8c74f",
    //     vehicleType: "6610012976e6f2f377f8c758",
    //     vehicleModel: "6610016a76e6f2f377f8c781",
    //     vehicleMake: "6610014176e6f2f377f8c76d",
    //     vehicleNumber: "RJ01SD9655",
    //     vehicleColor: "White",
    //     amount: 50,
    //     pickupAddress: "Sanaganer Thana",
    //     destinationAddress: "WTP",
    //   },
    //   {
    //     customer: "660fffef76e6f2f377f8c703",
    //     driver: "660d33f1106741c0502521ca",
    //     vehicleType: "6610013176e6f2f377f8c75d",
    //     vehicleModel: "6615102276e6f2f377f8cb7a",
    //     vehicleMake: "66150fb176e6f2f377f8cb71",
    //     vehicleNumber: "RJ01SD9656",
    //     vehicleColor: "Blue",
    //     amount: 150,
    //     pickupAddress: "Kumbha marg Haldi ghati Jaipur",
    //     destinationAddress: "C-scheme Jaipur",
    //   },
    // ];
    // await Order.create(data);
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

        filteredQuery.$or = [
          {
            sessionId: {
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
      if (req.query.tab !== "All" && req.query.tab) {
        filteredQuery.status = req.query.tab;
      }
      if (req.query.orderStatus && req.query.orderStatus) {
        filteredQuery.status = req.query.orderStatus;
      }

      if (req.query.start_date && req.query.end_date) {
        filteredQuery.created_at = {
          $gte: new Date(req.query.start_date + "T00:00:00Z"),
          $lte: new Date(req.query.end_date + "T23:59:59Z"),
        };
      }

      let query: any = [
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
            from: "carmodels",
            localField: "vehicleModel",
            foreignField: "_id",
            as: "vehicleModel",
          },
        },
        {
          $unwind: {
            path: "$vehicleModel",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "cartypes",
            localField: "vehicleType",
            foreignField: "_id",
            as: "vehicleType",
          },
        },
        {
          $unwind: {
            path: "$vehicleType",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "carmakes",
            localField: "vehicleMake",
            foreignField: "_id",
            as: "vehicleMake",
          },
        },
        {
          $unwind: {
            path: "$vehicleMake",
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
      var myAggregate = Order.aggregate(query);
      const list = await Order.aggregatePaginate(myAggregate, options);
      // const list = await User.find({ type: "Expact" }).sort({ created_at: -1 });
      return _RS.ok(res, "SUCCESS", "List", { list: list }, startTime);
    } catch (err) {
      next(err);
    }
  }
  // static async exportList(req, res, next) {
  //   try {
  //     const startTime = new Date().getTime();

  //     let sort: any = [["created_at", -1]];
  //     if (req.query.sort) {
  //       const map = Array.prototype.map;
  //       sort = Object.keys(req.query.sort).map((key) => [
  //         key,
  //         req.query.sort[key],
  //       ]);
  //       console.log(sort, "sort");
  //     }

  //     const options = {
  //       page: req.query.page || 1,
  //       limit: req.query.limit || 10,
  //       collation: {
  //         locale: "en",
  //       },
  //     };
  //     let filteredQuery: any = {};
  //     if (req.query.search && req.query.search.trim()) {
  //       console.log(req.query.search, "req.query.search");
  //       // filteredQuery = {
  //       //   name: {
  //       //     $regex: req.query.search,
  //       //     $options: "$i",
  //       //   },
  //       // };
  //       filteredQuery.$or = [
  //         {
  //           sessionId: {
  //             $regex: new RegExp(req.query.search),
  //             $options: "i",
  //           },
  //         },
  //         {
  //           "customer.name": {
  //             $regex: new RegExp(req.query.search),
  //             $options: "i",
  //           },
  //         },
  //         {
  //           "customer.phoneNumber": {
  //             $regex: new RegExp(req.query.search),
  //             $options: "i",
  //           },
  //         },
  //         {
  //           "customer.email": {
  //             $regex: new RegExp(req.query.search),
  //             $options: "i",
  //           },
  //         },
  //         {
  //           "psychologist.phoneNumber": {
  //             $regex: new RegExp(req.query.search),
  //             $options: "i",
  //           },
  //         },
  //         {
  //           "psychologist.name": {
  //             $regex: new RegExp(req.query.search),
  //             $options: "i",
  //           },
  //         },
  //         {
  //           "psychologist.phoneNumber": {
  //             $regex: new RegExp(req.query.search),
  //             $options: "i",
  //           },
  //         },
  //       ];
  //     }
  //     if (req.query.start_date && req.query.start_date.trim()) {
  //       filteredQuery.created_at = { $gte: new Date(req.query.start_date) };
  //     }

  //     if (req.query.end_date && req.query.end_date.trim()) {
  //       filteredQuery.created_at = { $lte: new Date(req.query.end_date) };
  //     }
  //     if (req.query.start_date && req.query.end_date) {
  //       filteredQuery.created_at = {
  //         $gte: new Date(req.query.start_date + "T00:00:00Z"),
  //         $lte: new Date(req.query.end_date + "T23:59:59Z"),
  //       };
  //     }

  //     if (req.query.start_date && req.query.end_date) {
  //       filteredQuery.created_at = {
  //         $gte: new Date(req.query.start_date + "T00:00:00Z"),
  //         $lte: new Date(req.query.end_date + "T23:59:59Z"),
  //       };
  //     }
  //     if (req.query.type && req.query.type !== "null") {
  //       filteredQuery.sessionType = req.query.type;
  //     }

  //     if (req.query.expathy && req.query.expathy.length > 0) {
  //       // console.log(req.query.psy);
  //       const serviceIds = req.query.expathy
  //         .split(",")
  //         .map((id) => ObjectId(id));
  //       // console.log(serviceIds, "serviceIds");
  //       filteredQuery.$or = [{ "customer._id": { $in: serviceIds } }];
  //     }

  //     if (req.query.psy && req.query.psy.length > 0) {
  //       // console.log(req.query.psy);
  //       const serviceIds = req.query.psy.split(",").map((id) => ObjectId(id));
  //       // console.log(serviceIds, "serviceIds");
  //       filteredQuery.$or = [{ "psychologist._id": { $in: serviceIds } }];
  //     }

  //     let query: any = [
  //       {
  //         $lookup: {
  //           from: "users",
  //           localField: "customer",
  //           foreignField: "_id",
  //           as: "customer",
  //         },
  //       },
  //       {
  //         $unwind: {
  //           path: "$customer",
  //           preserveNullAndEmptyArrays: true,
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: "users",
  //           localField: "psychologist",
  //           foreignField: "_id",
  //           as: "psychologist",
  //         },
  //       },
  //       {
  //         $unwind: {
  //           path: "$psychologist",
  //           preserveNullAndEmptyArrays: true,
  //         },
  //       },
  //       {
  //         $match: filteredQuery,
  //       },
  //       {
  //         $sort: {
  //           created_at: -1,
  //         },
  //       },
  //     ];
  //     var list = await Order.aggregate(query);
  //     // const list = await Order.aggregatePaginate(myAggregate, options);
  //     // const list = await User.find({ type: "Expact" }).sort({ created_at: -1 });
  //     return _RS.ok(res, "SUCCESS", "List", list, startTime);
  //   } catch (err) {
  //     next(err);
  //   }
  // }

  static async getActivities(req, res, next) {
    try {
      const getActivity = await BookingActivity.find({
        bookingId: req.params.id,
      });
      return _RS.ok(res, "SUCCESS", "List", getActivity, startTime);
    } catch (error) {
      next(error);
    }
  }
}
