import _RS from "../../helpers/ResponseHelper";
import Rides from "../../models/Rides";
const ObjectId = require("mongodb").ObjectId;
export class HotelRidesController {
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
        filteredQuery.$or = [
          {
            customerName: {
              $regex: new RegExp(req.query.search),
              $options: "i",
            },
          },
          {
            customerPhoneNumber: {
              $regex: new RegExp(req.query.search),
              $options: "i",
            },
          },
          {
            customerCountryCode: {
              $regex: new RegExp(req.query.search),
              $options: "i",
            },
          },
        ];
      }
      if (req.query.start_date && req.query.end_date) {
        filteredQuery.createdAt = {
          $gte: new Date(req.query.start_date),
          $lte: new Date(req.query.end_date),
        };
      }

      if (req.query.start_date && req.query.start_date.trim()) {
        filteredQuery.createdAt = { $gte: new Date(req.query.start_date) };
      }

      if (req.query.end_date && req.query.end_date.trim()) {
        filteredQuery.createdAt = { $lte: new Date(req.query.end_date) };
      }
      if (req.query.id) {
        filteredQuery["hotel._id"] = ObjectId(req.query.id);
      }
      let query: any = [
        {
          $lookup: {
            from: "users",
            localField: "hotel",
            foreignField: "_id",
            as: "hotel",
          },
        },
        {
          $unwind: {
            path: "$hotel",
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
      var myAggregate = Rides.aggregate(query);
      const list = await Rides.aggregatePaginate(myAggregate, options);
      return _RS.ok(res, "SUCCESS", "List", { list: list }, startTime);
    } catch (err) {
      next(err);
    }
  }
  static async add(req, res, next) {
    try {
      const startTime = new Date().getTime();
      const {
        customerName,
        customerPhoneNumber,
        customerCountryCode,
        pickupAddress,
        destinationAddress,
        hotel,
        paymentType,
        rideTypes,
      } = req.body;
      const data = {
        customerName,
        customerPhoneNumber,
        customerCountryCode,
        pickupAddress,
        destinationAddress,
        hotel,
        paymentType,
        rideTypes,
      };
      await new Rides(data).save();
      return _RS.created(res, "SUCCESS", "Add Rides Successfully", data);
      // return _RS.ok(res, "SUCCESS", "List", { list: list }, startTime);
    } catch (err) {
      next(err);
    }
  }
  static async edit(req, res, next) {
    try {
      const startTime = new Date().getTime();
      const {
        customerName,
        customerPhoneNumber,
        customerCountryCode,
        pickupAddress,
        destinationAddress,
        hotel,
        paymentType,
        rideTypes,
      } = req.body;
      const id = req.params.id;

      const getData = await Rides.findOne({ _id: id });
      console.log(getData);
      if (!getData)
        return _RS.notFound(
          res,
          "NOTFOUND",
          "Rides not found",
          getData,
          startTime
        );
      (getData.customerName = customerName
        ? customerName
        : getData.customerName),
        (getData.customerPhoneNumber = customerPhoneNumber
          ? customerPhoneNumber
          : getData.customerPhoneNumber),
        (getData.customerCountryCode = customerCountryCode
          ? customerCountryCode
          : getData.customerCountryCode),
        (getData.pickupAddress = pickupAddress
          ? pickupAddress
          : getData.pickupAddress),
        (getData.destinationAddress = destinationAddress
          ? destinationAddress
          : getData.destinationAddress),
        (getData.hotel = hotel ? hotel : getData.hotel),
        (getData.paymentType = paymentType ? paymentType : getData.paymentType),
        (getData.rideTypes = rideTypes ? rideTypes : getData.rideTypes),
        getData.save();

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
      const getData = await Rides.findOne({
        _id: req.params.id,
      });
      if (!getData)
        return _RS.notFound(
          res,
          "NOTFOUND",
          "Rides not found",
          getData,
          startTime
        );
      (getData.is_status = !getData.is_status), getData.save();

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
}
