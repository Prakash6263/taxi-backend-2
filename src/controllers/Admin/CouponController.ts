import _RS from "../../helpers/ResponseHelper";
import Coupon from "../../models/Coupon";

export class CouponController {
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
        // filteredQuery = {
        //   name: {
        //     $regex: req.query.search,
        //     $options: "$i",
        //   },
        // };
        filteredQuery.$or = [
          {
            promoCode: {
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
      var myAggregate = Coupon.aggregate(query);
      const list = await Coupon.aggregatePaginate(myAggregate, options);
      // const list = await User.find({ type: "Expact" }).sort({ created_at: -1 });
      return _RS.ok(res, "SUCCESS", "List", { list: list }, startTime);
    } catch (err) {
      next(err);
    }
    // try {
    //   const startTime = new Date().getTime();
    //   const list = await Coupon.find({}).sort({
    //     created_at: -1,
    //   });
    //   return _RS.ok(res, "SUCCESS", "List", { list: list }, startTime);
    // } catch (err) {
    //   next(err);
    // }
  }
  static async addDiscountCoupon(req, res, next) {
    try {
      const startTime = new Date().getTime();
      const {
        promoCode,
        endDate,
        noOfUse,
        noOfUser,
        percentage,
        maxAmount,
        minAmount,
        description,
        title,
      } = req.body;
      console.log(req.body);
      const getDiscountCoupon = await Coupon.findOne({ promoCode: promoCode });
      if (getDiscountCoupon)
        return _RS.conflict(
          res,
          "COFLICT",
          "DiscountCoupon already exist with this code",
          getDiscountCoupon,
          startTime
        );
      var type = "";

      const data = {
        promoCode,
        endDate,
        noOfUse,
        noOfUser,
        percentage,
        maxAmount,
        minAmount,
        description,
        type,
        title,
      };

      const coupon = await new Coupon(data).save();
      return _RS.created(
        res,
        "SUCCESS",
        "Add Discount Coupon Successfully",
        coupon
      );
      // return _RS.ok(res, "SUCCESS", "List", { list: list }, startTime);
    } catch (err) {
      next(err);
    }
  }
  static async editDiscountCoupon(req, res, next) {
    try {
      const startTime = new Date().getTime();
      const {
        promoCode,
        endDate,
        noOfUse,
        noOfUser,
        percentage,
        maxAmount,
        minAmount,
        description,
        title,
      } = req.body;
      const getDiscountCoupon = await Coupon.findOne({
        _id: req.params.id,
      });
      const isCheck = await Coupon.findOne({
        promoCode: promoCode,
        _id: { $ne: req.params.id },
      });
      if (!getDiscountCoupon)
        return _RS.notFound(
          res,
          "NOTFOUND",
          "Discount Coupon not found",
          getDiscountCoupon,
          startTime
        );
      if (isCheck)
        return _RS.conflict(
          res,
          "CONFLICT",
          "This promo code already added",
          getDiscountCoupon,
          startTime
        );
      var type = "";

      (getDiscountCoupon.promoCode = promoCode
        ? promoCode
        : getDiscountCoupon.promoCode),
        (getDiscountCoupon.endDate = endDate
          ? endDate
          : getDiscountCoupon.endDate),
        (getDiscountCoupon.noOfUse = noOfUse
          ? noOfUse
          : getDiscountCoupon.noOfUse),
        (getDiscountCoupon.noOfUser = noOfUser
          ? noOfUser
          : getDiscountCoupon.noOfUser),
        (getDiscountCoupon.percentage = percentage
          ? percentage
          : getDiscountCoupon.percentage),
        (getDiscountCoupon.maxAmount = maxAmount
          ? maxAmount
          : getDiscountCoupon.maxAmount),
        (getDiscountCoupon.minAmount = minAmount
          ? minAmount
          : getDiscountCoupon.minAmount),
        (getDiscountCoupon.description = description
          ? description
          : getDiscountCoupon.description),
        (getDiscountCoupon.title = title ? title : getDiscountCoupon.title),
        getDiscountCoupon.save();

      return _RS.ok(
        res,
        "SUCCESS",
        "Update Discount Coupon Successfully",
        getDiscountCoupon,
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
      const getCoupon = await Coupon.findOne({
        _id: req.params.id,
      });
      if (!getCoupon)
        return _RS.notFound(
          res,
          "NOTFOUND",
          "Coupon not found",
          getCoupon,
          startTime
        );
      (getCoupon.is_active = !getCoupon.is_active), getCoupon.save();

      return _RS.ok(
        res,
        "SUCCESS",
        "Status Change Successfully",
        getCoupon,
        startTime
      );
      // return _RS.ok(res, "SUCCESS", "List", { list: list }, startTime);
    } catch (err) {
      next(err);
    }
  }

  static async view(req, res, next) {
    try {
      const startTime = new Date().getTime();
      const id = req.params.id;
      const getCoupon = await Coupon.findOne({
        _id: req.params.id,
      }).populate("subscription");
      if (!getCoupon)
        return _RS.notFound(
          res,
          "NOTFOUND",
          "Coupon not found",
          getCoupon,
          startTime
        );

      return _RS.ok(res, "SUCCESS", "data", getCoupon, startTime);
      // return _RS.ok(res, "SUCCESS", "List", { list: list }, startTime);
    } catch (err) {
      next(err);
    }
  }
}
