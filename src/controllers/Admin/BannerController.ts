import _RS from "../../helpers/ResponseHelper";
import Banner from "../../models/Banner";

export class BannerController {
  static async list(req, res, next) {
    try {
      const startTime = new Date().getTime();
      const list = await Banner.find({}).sort({
        created_at: -1,
      });
      return _RS.ok(res, "SUCCESS", "List", { list: list }, startTime);
    } catch (err) {
      next(err);
    }
  }
  static async addBanner(req, res, next) {
    try {
      const startTime = new Date().getTime();
      const { title, imageUrl } = req.body;
      const data = {
        title: title,
        image: imageUrl,
      };
      const banner = await new Banner(data).save();
      return _RS.created(res, "SUCCESS", "Add Banner Successfully", banner);
      // return _RS.ok(res, "SUCCESS", "List", { list: list }, startTime);
    } catch (err) {
      next(err);
    }
  }
  static async editBanner(req, res, next) {
    try {
      const startTime = new Date().getTime();
      const { title, imageUrl } = req.body;
      const id = req.params.id;

      const getBanner = await Banner.findOne({ _id: id });
      console.log(getBanner);
      if (!getBanner)
        return _RS.notFound(
          res,
          "NOTFOUND",
          "Banner not found",
          getBanner,
          startTime
        );
      // const data = {
      //   email: email,
      //   mobileNumber: mobileNumber,
      //   countryCode: countryCode,
      //   name: name,
      // };
      (getBanner.title = title ? title : getBanner.title),
        (getBanner.image = imageUrl ? imageUrl : getBanner.image),
        getBanner.save();

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
  static async statusChange(req, res, next) {
    try {
      const startTime = new Date().getTime();
      const id = req.params.id;
      const getBanner = await Banner.findOne({
        _id: req.params.id,
      });
      if (!getBanner)
        return _RS.notFound(
          res,
          "NOTFOUND",
          "Banner not found",
          getBanner,
          startTime
        );
      (getBanner.is_status = !getBanner.is_status), getBanner.save();

      return _RS.ok(
        res,
        "SUCCESS",
        "Status Change Successfully",
        getBanner,
        startTime
      );
      // return _RS.ok(res, "SUCCESS", "List", { list: list }, startTime);
    } catch (err) {
      next(err);
    }
  }
}
