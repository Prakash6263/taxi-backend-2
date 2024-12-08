import _RS from "../../helpers/ResponseHelper";
import CancelReason from "../../models/CancelReason";

export class CancelReasonController {
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
            title: {
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

      let query: any = [
        {
          $match: filteredQuery,
        },

        {
          $sort: {
            created_at: -1,
          },
        },
      ];
      var myAggregate = CancelReason.aggregate(query);
      const list = await CancelReason.aggregatePaginate(myAggregate, options);
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
      const { title } = req.body;
      const data = {
        title: title,
      };
      const reason = await new CancelReason(data).save();
      return _RS.created(res, "SUCCESS", "Add Reason Successfully", reason);
      // return _RS.ok(res, "SUCCESS", "List", { list: list }, startTime);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      const startTime = new Date().getTime();
      const id = req.params.id;
      const deletedReason = await CancelReason.findByIdAndDelete(id);
      if (!deletedReason) {
        return _RS.notFound(
          res,
          "NOTFOUND",
          "Reason not found",
          null,
          startTime
        );
      }

      return _RS.ok(
        res,
        "Success",
        "Reason deleted successfully",
        deletedReason,
        startTime
      );
    } catch (err) {
      next(err);
    }
  }
  static async statusChange(req, res, next) {
    try {
      const startTime = new Date().getTime();
      const id = req.params.id;
      const getReason = await CancelReason.findOne({
        _id: req.params.id,
      });
      if (!getReason)
        return _RS.notFound(
          res,
          "NOTFOUND",
          "Reason not found",
          getReason,
          startTime
        );
      (getReason.is_status = !getReason.is_status), getReason.save();

      return _RS.ok(
        res,
        "SUCCESS",
        "Status Change Successfully",
        getReason,
        startTime
      );
      // return _RS.ok(res, "SUCCESS", "List", { list: list }, startTime);
    } catch (err) {
      next(err);
    }
  }
  static async edit(req, res, next) {
    try {
      const startTime = new Date().getTime();
      const { title } = req.body;
      const id = req.params.id;

      const getBanner = await CancelReason.findOne({ _id: id });
      console.log(getBanner);
      if (!getBanner)
        return _RS.notFound(
          res,
          "NOTFOUND",
          "Banner not found",
          getBanner,
          startTime
        );
      (getBanner.title = title ? title : getBanner.title), getBanner.save();

      // const user = await new User(data).save();
      return _RS.ok(
        res,
        "SUCCESS",
        "Update data Successfully",
        getBanner,
        startTime
      );
      // return _RS.ok(res, "SUCCESS", "List", { list: list }, startTime);
    } catch (err) {
      next(err);
    }
  }
}
