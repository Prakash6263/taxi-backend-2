import _RS from "../../helpers/ResponseHelper";
import Coupon from "../../models/Coupon";
import CouponSummary from "../../models/CouponSummary";
const startTime = new Date().getTime();
export class PromoCodeController {
  /**
   * @api {get} /api/app/user/get-promo-code/:id get-promo-code
   * @apiVersion 1.0.0
   * @apiName get-promo-code
   * @apiHeader {String} Authorization Pass jwt token.
   * @apiGroup App-User-Address
   */
  static async getPromoCode(req, res, next) {
    try {
      const getPromoCOde = await Coupon.find({ is_active: true });
      return _RS.ok(res, "Success", "Get Promo Code", getPromoCOde, startTime);
    } catch (error) {
      next(error);
    }
  }

  static async applyPromoCode(req,res,next) {
    try {
      const user_id = req.user.id
      const coupon_id = req.body.coupon_id;
      const promoAlreadyApply = await CouponSummary.findOne({ is_active: true ,coupon_id:coupon_id,user_id:user_id});
      if(promoAlreadyApply){
        return _RS.ok(res, "Success", "Promo Code Already Applied", {}, startTime);
      }else{
        let getPromoCOde = await Coupon.findOne({ is_active: true ,_id:coupon_id});
        // getPromoCOde.noOfUse=getPromoCOde.noOfUse+1;
        // getPromoCOde.noOfUser=getPromoCOde.noOfUser+1;
        const data={
          user_id,
          coupon_id,
          status: "apply",
          maxAmount:getPromoCOde.maxAmount,
          minAmount:getPromoCOde.minAmount,
          promoCode:getPromoCOde.promoCode,
          description:getPromoCOde.description,
          title:getPromoCOde.title,
          percentage:getPromoCOde.percentage
        }
        
        await new CouponSummary(data).save();
      }
      
      return _RS.ok(res, "Success", "Promo Code Applied", {}, startTime);

    } catch (error) {
      next(error)
    }
  }

  
}
