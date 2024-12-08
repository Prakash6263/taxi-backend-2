import _RS from "../../helpers/ResponseHelper";
import { getLanguageStrings } from "../../locale/index";
import UserNotification from "../../models/UserNotification";
import * as mongoose from "mongoose";
const startTime = new Date().getTime();
export class NotificationController {
  /**
   * @api {get} /api/app/notification/get-list?limit=1&page=2 Notification List
   * @apiVersion 1.0.0
   * @apiHeader {string} Authorization Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.......................
   * @apiName Notification List
   * @apiGroup Notification API
   * @apiSuccessExample {json} Success-Response:
   *{"status":200,"statusText":"SUCCESS","message":"NotificationList","data":{"docs":[{"_id":"661a47060645269aaae044f2","type":"Admin","image":null,"allUser":false,"is_read":false,"user":"661a2f234446a74948fe55c0","title":"Hello","message":"Hello","created_at":"2024-04-13T08:49:10.822Z","updated_at":"2024-04-13T08:49:10.822Z","__v":0}],"totalDocs":1,"limit":10,"page":1,"totalPages":1,"pagingCounter":1,"hasPrevPage":false,"hasNextPage":false,"prevPage":null,"nextPage":null},"exeTime":182237}

   */
  static async notificationList(req, res, next) {
    const userLanguage = req.user.appLanguage ?? "en";
    const strings = getLanguageStrings(userLanguage);
    const id = req.user.id;
    console.log(id,"<<<id");
    try {
      const options = {
        page: req.query.page || 1,
        limit: req.query.limit || 10,
      };
      let query: any = [
        {
          $match: {
            user: new mongoose.Types.ObjectId(id),
          },
        },
        {
          $sort: {
            created_at: -1,
          },
        },
      ];
      var myAggregate = UserNotification.aggregate(query);
      const list = await UserNotification.aggregatePaginate(
        myAggregate,
        options
      );
      return _RS.ok(
        res,
        "SUCCESS",
        strings["NotificationList"],
        list,
        startTime
      );
    } catch (error) {
      next(error);
    }
  }
  /**
   * @api {put} /api/app/notification/read-notification?notificationId=6576f6076af77b38a16a77eb Read Notification
   * @apiVersion 1.0.0
   * @apiHeader {string} Authorization Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.......................
   * @apiName read-notification
   * @apiGroup Notification API
   * @apiSuccessExample {json} Success-Response:
   *{"status":200,"message":"Read Notification","data":{}}
   */
  static async readNotification(req, res, next) {
    const userLanguage = req.user.appLanguage ?? "en";
    const strings = getLanguageStrings(userLanguage);
    const notificationId = req.query.notificationId;
    const id = req.user.id;
    try {
      if (notificationId) {
        await UserNotification.findOneAndUpdate(
          { _id: notificationId },
          { is_read: true }
        );
      } else {
        await UserNotification.updateMany(
          { user: id },
          { $set: { is_read: true } },
          { multi: true }
        );
      }
      return _RS.ok(res, "SUCCESS", strings["ReadNotification"], {}, startTime);
    } catch (error) {
      next(error);
    }
  }
  /**
   * @api {delete} /api/app/notification/delete-notification?notificationId=63731fbae74f02ba9ba64ad6 Delete Notification
   * @apiVersion 1.0.0
   * @apiHeader {string} Authorization Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.......................
   * @apiName delete-notification
   * @apiGroup Notification API
   * @apiSuccessExample {json} Success-Response:
   * {"status":200,"message":"Delete Notification","data":{}}
   */
  static async deleteNotification(req, res, next) {
    const userLanguage = req.user.appLanguage ?? "en";
    const strings = getLanguageStrings(userLanguage);
    const id = req.user.id;
    const notificationId = req.query.notificationId;
    try {
      if (notificationId) {
        await UserNotification.findOneAndDelete({ _id: notificationId });
      } else {
        await UserNotification.deleteMany({ user: id });
      }

      return _RS.ok(
        res,
        "SUCCESS",
        strings["DeleteNotification"],
        {},
        startTime
      );
    } catch (error) {
      next(error);
    }
  }
}
