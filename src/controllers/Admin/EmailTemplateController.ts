import _RS from "../../helpers/ResponseHelper";
import EmailTemplate from "../../models/EmailTemplate";

class EmailTemplateController {
  static async editEmailTemplate(req, res, next) {
    const { name, subject, description } = req.body;
    const id = req.params.id;
    try {
      let emailTemplates = await EmailTemplate.findOne({
        _id: id,
      });

      emailTemplates.name = name ? name : emailTemplates.name;
      emailTemplates.subject = subject ? subject : emailTemplates.subject;
      emailTemplates.body = description ? description : emailTemplates.body;

      emailTemplates.save();
      return _RS.ok(
        res,
        "SUCCESS",
        "Update email templates successfully",
        emailTemplates,
        new Date().getTime()
      );
    } catch (error) {
      next(error);
    }
  }

  static async emailTemplateList(req, res, next) {
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
          {
            subject: {
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
        filteredQuery.is_status = { $in: booleanValues };
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
      var myAggregate = EmailTemplate.aggregate(query);
      const list = await EmailTemplate.aggregatePaginate(myAggregate, options);

      return _RS.ok(res, "SUCCESS", "list", list, new Date().getTime());
    } catch (error) {
      next(error);
    }
  }

  static async statusChange(req, res, next) {
    try {
      let emailTemplates = await EmailTemplate.findOne({ _id: req.params.id });
      if (!emailTemplates) {
        let msg = res.__("Email templates not found.");
        return _RS.notFound(
          res,
          "notFound",
          msg,
          emailTemplates,
          new Date().getTime()
        );
      }

      emailTemplates.is_status = !emailTemplates.is_status;
      emailTemplates.save();
      return _RS.ok(
        res,
        "SUCCESS",
        "update Successfully",
        emailTemplates,
        new Date().getTime()
      );
    } catch (error) {
      next(error);
    }
  }
  static async viewEmailTemplate(req, res, next) {
    try {
      let emailTemplates = await EmailTemplate.findOne({ _id: req.params.id });
      if (!emailTemplates) {
        let msg = res.__("Email templates not found.");
        return _RS.notFound(
          res,
          "notFound",
          msg,
          emailTemplates,
          new Date().getTime()
        );
      }
      return _RS.ok(
        res,
        "SUCCESS",
        "get",
        emailTemplates,
        new Date().getTime()
      );
    } catch (error) {
      next(error);
    }
  }
}

export default EmailTemplateController;
