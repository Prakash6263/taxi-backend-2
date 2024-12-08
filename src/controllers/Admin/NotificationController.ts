import _RS from "../../helpers/ResponseHelper";
import EmailTemplate from "../../models/EmailTemplate";
import Notification from "../../models/Notification";
import User from "../../models/User";
import UserNotification from "../../models/UserNotification";
import NotificationService from "../../services/NotificationService";

class NotificationController {
  static async notificationList(req, res, next) {
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
            title: {
              $regex: new RegExp(req.query.search),
              $options: "i",
            },
          },
          {
            message: {
              $regex: new RegExp(req.query.search),
              $options: "i",
            },
          },
          {
            type: {
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
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user",
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
      var myAggregate = Notification.aggregate(query);
      const list = await Notification.aggregatePaginate(myAggregate, options);

      return _RS.ok(res, "SUCCESS", "list", list, new Date().getTime());
    } catch (error) {
      next(error);
    }
  }
  static async addNotification(req, res, next) {
    try {
      const startTime = new Date().getTime();
      const { type, title, message, selectUser, allUser,notificationtype } = req.body;
      const data = {
        type: type,
        notificationtype: notificationtype,
        title: title,
        message: message,
        user: selectUser,
        allUser,
      };
      const user = await new Notification(data).save();
      const getAllUSer = await User.find({
        is_deleted: false,
        is_active: true,
      });
      selectUser && selectUser.length > 0
        ? selectUser.map(async (data) => {
            UserNotification.create({
              user: data,
              title: title,
              message: message,
              notificationtype: notificationtype,
            });
            await NotificationService.sendNotification(data, title);
          })
        : getAllUSer.length > 0 &&
          getAllUSer.map(async (user) => {
            UserNotification.create({
              user: user._id,
              title: title,
              message: message,
              notificationtype: notificationtype,
            });
            await NotificationService.sendNotification(user._id, title);
          });
      return _RS.created(res, "SUCCESS", "Add Notification Successfully", user);
      // return _RS.ok(res, "SUCCESS", "List", { list: list }, startTime);
    } catch (err) {
      next(err);
    }
  }
  static async viewNotification(req, res, next) {
    try {
      let getNotification = await Notification.findOne({
        _id: req.params.id,
      }).populate("user");
      return _RS.ok(
        res,
        "SUCCESS",
        "Data",
        getNotification,
        new Date().getTime()
      );
    } catch (error) {
      next(error);
    }
  }
}

export default NotificationController;
