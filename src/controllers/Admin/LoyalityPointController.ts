import _RS from "../../helpers/ResponseHelper";
import LoyalityPoint from "../../models/LoyalityPoint";

export class LoyalityPointController {
  static async getLoyalityData(req, res, next) {
    try {
      const startTime = new Date().getTime();
      const list = await LoyalityPoint.findOne({});
      return _RS.ok(res, "SUCCESS", "List", list, startTime);
    } catch (err) {
      next(err);
    }
  }
  static async edit(req, res, next) {
    try {
      const startTime = new Date().getTime();
      const {
        redemptionRate,
        loyalityPointRedemption,
        conversionRate,
        loyalityPointConversion,
      } = req.body;

      const data = {
        redemptionRate,
        loyalityPointRedemption,
        conversionRate,
        loyalityPointConversion,
      };

      let updateData = await LoyalityPoint.findOne({});
      if (updateData) {
        (updateData.redemptionRate = redemptionRate
          ? redemptionRate
          : updateData.redemptionRate),
          (updateData.loyalityPointRedemption = loyalityPointRedemption
            ? loyalityPointRedemption
            : updateData.loyalityPointRedemption),
          (updateData.conversionRate = conversionRate
            ? conversionRate
            : updateData.conversionRate),
          (updateData.loyalityPointConversion = loyalityPointConversion
            ? loyalityPointConversion
            : updateData.loyalityPointConversion),
          updateData.save();
      }

      // await new LoyalityPoint(data).save();
      return _RS.ok(
        res,
        "SUCCESS",
        "Update data Successfully",
        updateData,
        startTime
      );
      // return _RS.ok(res, "SUCCESS", "List", { list: list }, startTime);
    } catch (err) {
      next(err);
    }
  }
}
