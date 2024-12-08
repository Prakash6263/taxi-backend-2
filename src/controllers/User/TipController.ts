import _RS from "../../helpers/ResponseHelper";
import Tip from "../../models/Tip";
import * as mongoose from "mongoose";
import TipAmount from "../../models/TipAmount";
const startTime = new Date().getTime();
export class TipController {
  /**
   * @api {post} /api/app/tip/add-tip  Add Tip
   * @apiVersion 1.0.0
   * @apiName Add Tip
   * @apiGroup App-TIP
   * @apiHeader {String} Authorization Pass jwt token.
   * @apiParam {Number} amount  amount.
   * @apiParam {String} driverId  driverId.
   * @apiParamExample {json} Normal-signUp-Request-Example:
   * {"amount":20,"driverId":""}
   * @apiSuccessExample {json} Success-Response:
   *{"status":200,"statusText":"SUCCESS","message":"add tip","data":[]}
   */
  static async addTip(req, res, next) {
    const { driverId, amount } = req.body;
    try {
      const data = {
        driverId,
        amount,
        customerId: req.user.id,
      };
      await new Tip(data).save();
      return _RS.ok(res, "Success", "Add Tip", {}, startTime);
    } catch (error) {}
  }
  /**
   * @api {get} /api/app/tip/get-tip  Get Tip
   * @apiVersion 1.0.0
   * @apiName Get Tip
   * @apiGroup App-TIP
   * @apiHeader {String} Authorization Pass jwt token.
   * @apiSuccessExample {json} Success-Response:
   *{"status":200,"statusText":"SUCCESS","message":"get Tip","data":[]}
   */
  static async getTip(req, res, next) {
    const { driverId, amount } = req.body;
    try {
      const getTip = await Tip.find({ customerId: req.user.id }).populate(
        "driverId"
      );
      return _RS.ok(res, "Success", " get Tip", getTip, startTime);
    } catch (error) {}
  }
  /**
   * @api {get} /api/app/tip/get-tip-amount  Get Tip Amount
   * @apiVersion 1.0.0
   * @apiName Get Tip Amount
   * @apiGroup App-TIP
   * @apiHeader {String} Authorization Pass jwt token.
   * @apiSuccessExample {json} Success-Response:
   * {"status":200,"statusText":"Success","message":" get Tip Amount","data":{"data":[{"is_status":true,"_id":"663092b7f0362d4c04a585c1","amount":10,"created_at":"2024-04-30T06:41:59.552Z","updated_at":"2024-04-30T06:41:59.552Z","__v":0},{"is_status":true,"_id":"663092b7f0362d4c04a585c4","amount":5,"created_at":"2024-04-30T06:41:59.553Z","updated_at":"2024-04-30T06:41:59.553Z","__v":0},{"is_status":true,"_id":"663092b7f0362d4c04a585c2","amount":20,"created_at":"2024-04-30T06:41:59.553Z","updated_at":"2024-04-30T06:41:59.553Z","__v":0},{"is_status":true,"_id":"663092b7f0362d4c04a585c3","amount":30,"created_at":"2024-04-30T06:41:59.553Z","updated_at":"2024-04-30T06:41:59.553Z","__v":0}]},"exeTime":25438}
   */
  static async getTipAmountList(req, res, next) {
    try {
      const getTipAmount = await TipAmount.find().sort({ amount: 1 });
      return _RS.ok(res, "Success", " get Tip Amount", getTipAmount, startTime);
    } catch (error) {}
  }
}
