import _RS from "../../helpers/ResponseHelper";
import Content from "../../models/Content";

export class ContentController {
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
            name: {
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
      var myAggregate = Content.aggregate(query);
      const list = await Content.aggregatePaginate(myAggregate, options);
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

  static async editContent(req, res, next) {
    const { name, description } = req.body;
    try {
      let getContent = await Content.findOne({ _id: req.params.id });
      if (getContent) {
        getContent.name = name ? name : getContent.name;
        getContent.description = description
          ? description
          : getContent.description;
        getContent.save();
      }
      return _RS.ok(
        res,
        "SUCCESS",
        "Update Data Successfully",
        getContent,
        new Date().getTime()
      );
    } catch (error) {
      next(error);
    }
  }

  static async statusChange(req, res, next) {
    try {
      let getContent = await Content.findOne({ _id: req.params.id });
      if (getContent) {
        getContent.is_status = !getContent.is_status;
        getContent.save();
      }
      return _RS.ok(
        res,
        "SUCCESS",
        "Update Data Successfully",
        getContent,
        new Date().getTime()
      );
    } catch (error) {
      next(error);
    }
  }
  static async viewContent(req, res, next) {
    try {
      let getContent = await Content.findOne({ _id: req.params.id });
      return _RS.ok(res, "SUCCESS", "Data", getContent, new Date().getTime());
    } catch (error) {
      next(error);
    }
  }
}
