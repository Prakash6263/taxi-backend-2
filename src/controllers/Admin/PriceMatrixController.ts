import _RS from "../../helpers/ResponseHelper";
import PriceMatrix from "../../models/PriceMatrix";

export class PriceMatrixController {
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
            name: {
              $regex: new RegExp(req.query.search),
              $options: "i",
            },
          },
          {
            "type.name": {
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
          $gte: new Date(req.query.start_date),
          $lte: new Date(req.query.end_date),
        };
      }
      if (req.query.status && req.query.status.trim()) {
        var arrayValues = req.query.status.split(",");
        var booleanValues = arrayValues.map(function (value) {
          return value.toLowerCase() === "true";
        });
        filteredQuery.is_status = { $in: booleanValues };
      }
      let query: any = [
        {
          $lookup: {
            from: "cartypes",
            localField: "type",
            foreignField: "_id",
            as: "type",
          },
        },
        {
          $unwind: {
            path: "$type",
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
      var myAggregate = PriceMatrix.aggregate(query);
      const list = await PriceMatrix.aggregatePaginate(myAggregate, options);
      // const list = await User.find({ type: "Expact" }).sort({ created_at: -1 });
      return _RS.ok(res, "SUCCESS", "List", { list: list }, startTime);
    } catch (err) {
      next(err);
    }
    // try {
    //   const startTime = new Date().getTime();
    //   const list = await User.find({ type: "Psychologist" }).sort({
    //     created_at: -1,
    //   });
    //   return _RS.ok(res, "SUCCESS", "List", { list: list }, startTime);
    // } catch (err) {
    //   next(err);
    // }
  }
  static async add(req, res, next) {
    try {
      const startTime = new Date().getTime();
      const { price, type } = req.body;
      const data = {
        price: price,
        type: type,
      };
      const addData = await new PriceMatrix(data).save();
      return _RS.created(res, "SUCCESS", "Add PriceMatrix Successfully", data);
      // return _RS.ok(res, "SUCCESS", "List", { list: list }, startTime);
    } catch (err) {
      next(err);
    }
  }
  static async edit(req, res, next) {
    try {
      const startTime = new Date().getTime();
      const { price, type } = req.body;
      const id = req.params.id;

      const getData = await PriceMatrix.findOne({ _id: id });
      console.log(getData);
      if (!getData)
        return _RS.notFound(
          res,
          "NOTFOUND",
          "PriceMatrix not found",
          getData,
          startTime
        );
      (getData.price = price ? price : getData.price),
        (getData.type = type ? type : getData.type),
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
      const getData = await PriceMatrix.findOne({
        _id: req.params.id,
      });
      if (!getData)
        return _RS.notFound(
          res,
          "NOTFOUND",
          "PriceMatrix not found",
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
