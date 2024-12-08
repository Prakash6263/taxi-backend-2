import FileUpload from "../helpers/FileUpload";
import { v4 as uuidv4 } from "uuid";
import _RS from "../helpers/ResponseHelper";
import User from "../models/User";
import CarMake from "../models/CarMake";
import CarType from "../models/CarType";
import ContactData from "../models/ContactData";
import CarModel from "../models/CarModel";
import State from "../models/State";
import Country from "../models/Country";
import City from "../models/City";
import CancelReason from "../models/CancelReason";
import Content from "../models/Content";
const path = require("path");
const startTime = new Date().getTime();

export class CommonController {
  /**
   * @api {post} /api/common/image-upload Image Upload
   * @apiVersion 1.0.0
   * @apiName Image Upload 
   * @apiGroup App-Common
   * @apiParam {File} profilePic Profile Pic
   * @apiSuccessExample {json} Success-Response:
   *{
    "status": 200,
    "statusText": "SUCCESS",
    "message": "Image Uploaded Successfully",
    "data": {
        "upload": "taxi/profile/image_1685013073538.png"
    },
    "exeTime": 0
}


   */
  static async uploadImage(req, res, next) {
    try {
      const { image } = req.body.files;
      let pathNEw: any = "taxi/profile";
      const fileExtension = path.extname(image.name);
      console.log(fileExtension, "fileExtension");
      const upload = await FileUpload.uploadInS3(image, pathNEw, fileExtension);
      // const upload = await new Digital().uploadImage(image, "path");
      // const signedUrl = await new Digital().getSignedS3Urls(upload);
      return _RS.ok(
        res,
        "SUCCESS",
        "Image Uploaded Successfully",
        { upload },
        new Date()
      );
      // console.log(upload);
    } catch (error) {}
  }
  static async userList(req, res, next) {
    const { type } = req.params;
    try {
      const getList = await User.find({
        type: type,
        is_deleted: false,
        is_active: true,
        isVerify: true,
      }).sort({ name: 1 });
      return _RS.ok(res, "SUCCESS", "list", getList, new Date().getTime());
    } catch (error) {
      next(error);
    }
  }

  /**
   * @api {get} /api/common/make-list Make List
   * @apiVersion 1.0.0
   * @apiName Make List
   * @apiGroup App-Common
   */
  static async makeList(req, res, next) {
    const { type } = req.params;
    try {
      const getList = await CarMake.find({
        is_status: true,
      }).sort({ name: 1 });
      return _RS.ok(res, "SUCCESS", "list", getList, new Date().getTime());
    } catch (error) {
      next(error);
    }
  }
  /**
   * @api {get} /api/common/type-list Type List
   * @apiVersion 1.0.0
   * @apiName Type List
   * @apiGroup App-Common
   */
  static async typeList(req, res, next) {
    const { type } = req.params;
    try {
      const getList = await CarType.find({
        is_status: true,
      }).sort({ name: 1 });
      return _RS.ok(res, "SUCCESS", "list", getList, new Date().getTime());
    } catch (error) {
      next(error);
    }
  }
  /**
   * @api {get} /api/common/model-list/:id Model List
   * @apiVersion 1.0.0
   * @apiName Model List
   * @apiGroup App-Common
   */
  static async modelList(req, res, next) {
    const { type } = req.params;
    try {
      const getList = await CarModel.find({
        make: req.params.id,
        is_status: true,
      }).sort({ name: 1 });
      return _RS.ok(res, "SUCCESS", "list", getList, new Date().getTime());
    } catch (error) {
      next(error);
    }
  }

  static async storeContactData(req, res, next) {
    console.log(req.body.contactData, "kkkk");
    const { name, phone, country, city, postalCode, contactData } = req.body;
    try {
      const data = JSON.parse(contactData);
      data &&
        data.length > 0 &&
        data.map(async (item) => {
          console.log(item, "item");
          const { name, phone, country, city, postalCode } = item;
          const data = {
            name,
            phone,
            country,
            city,
            postalCode,
          };
          await new ContactData(data).save();
        });
      // const data = {
      //   name,
      //   phone,
      //   country,
      //   city,
      //   postalCode,
      // };
      // const addData = await new ContactData(data).save();
      return _RS.ok(res, "SUCCESS", "list", {}, new Date().getTime());
    } catch (error) {
      console.log(error, "error");
      next(error);
    }
  }

  /**
   * @api {get} /api/common/country Counrty List
   * @apiVersion 1.0.0
   * @apiName Country List
   * @apiGroup App-Common
   */
  static async getCountry(req, res, next) {
    try {
      let countryList = await Country.find().sort({ name: 1 });

      return _RS.ok(
        res,
        "SUCCESS",
        "Country list retrieved successfully",
        countryList,
        startTime
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * @api {get} /api/common/state/:country_id State List
   * @apiVersion 1.0.0
   * @apiName State List
   * @apiGroup App-Common
   */
  static async getState(req, res, next) {
    try {
      const country_id = req.params.country_id;

      let stateList = await State.find({ country_id: country_id }).sort({
        name: 1,
      });

      return _RS.ok(
        res,
        "SUCCESS",
        "State list retrieved successfully",
        stateList,
        startTime
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * @api {get} /api/common/city City List
   * @apiVersion 1.0.0
   * @apiName State List
   * @apiGroup App-Common
   * @apiQuery {Number} country_id eg.- 91
   */
  static async getCityFromPhoneCode(req, res, next) {
    try {
      let cityList = await Country.aggregate([
        {
          $match: { phone_code: req.query.country_id },
        },
        {
          $lookup: {
            from: "cities",
            localField: "id",
            foreignField: "country_id",
            as: "citiesDetails",
          },
        },
      ]);
      //  = await City.find(query).sort({ name: 1 });

      return _RS.ok(
        res,
        "SUCCESS",
        "City list retrieved successfully",
        cityList,
        startTime
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * @api {get} /api/common/get-cancel-reason  Get Cancel Reason
   * @apiVersion 1.0.0
   * @apiName Get Cancel Reason
   * @apiGroup App-Common
   * @apiSuccessExample {json} Success-Response:
   * {"status":200,"statusText":"Success","message":" get Cancel Reason","data":{"data":[{"is_status":true,"is_deleted":false,"_id":"66308c96babf0f8b3482bfff","title":"Other","created_at":"2024-04-30T06:15:50.135Z","updated_at":"2024-04-30T06:15:50.135Z","__v":0},{"is_status":true,"is_deleted":false,"_id":"66308c96babf0f8b3482c001","title":"Driver Is not meet","created_at":"2024-04-30T06:15:50.249Z","updated_at":"2024-04-30T06:15:50.249Z","__v":0}]},"exeTime":150157}
   */
  static async getCancelReason(req, res, next) {
    try {
      const getData = await CancelReason.find({
        is_status: true,
      });
      return _RS.ok(res, "Success", " get Cancel Reason", getData, startTime);
    } catch (error) {}
  }
  /**
   * @api {get} /api/common/get-content/:slug  Get content
   * @apiVersion 1.0.0
   * @apiName Get content
   * @apiGroup App-Common
   * @apiSuccessExample {json} Success-Response:
   * {"status":200,"statusText":"Success","message":" get Content","data":{"data":[{"is_status":true,"_id":"6613cb6022e791cc72fa1905","isActive":true,"isDeleted":false,"name":"FAQ","description":"<p><strong>Terms &amp; Conditions</strong></p><p><br></p><p>Welcome to Cherlish – your next dating station! Before you start swiping, please take a moment to read and understand our terms and conditions. By using our app, you agree to abide by these rules.</p><p>&nbsp;</p><p><strong>1. Eligibility:</strong></p><p>·&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;You must be at least 18 years old to use this app.</p><p>·&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;You are responsible for providing accurate information about yourself.</p><p><strong>2. App Usage:</strong></p><p>·&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This app is for personal, non-commercial use only.</p><p>·&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;No impersonation, harassment, or harmful activities are allowed.</p><p><strong>3. User Conduct:</strong></p><p>·&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Be respectful, kind, and considerate to other users.</p><p>·&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Do not post offensive, explicit, or inappropriate content.</p><p><strong>4. Privacy:</strong></p><ul><li>·&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;We respect your privacy. Please review our Privacy Policy for detailed information.</li></ul>","slug":"faq","createdAt":"2023-10-16T05:45:27.115Z","updatedAt":"2024-03-27T13:32:11.124Z","__v":1,"faq":[{"answer":"English One Answer","_id":"64e6da87f57c963fc0e8259c","question":"English One Question"},{"answer":"English Two Answer","_id":"64e6e5f4323f0030c017228c","question":"English Two Question"},{"question":"English third Question","answer":"English Third Question"}],"is_active":true,"is_delete":false,"updated_at":"2024-04-08T11:43:29.945Z"}]},"exeTime":6248}
   */
  static async getContent(req, res, next) {
    try {
      const getData = await Content.find({
        slug: req.params.slug,
      });
      return _RS.ok(res, "Success", " get Content", getData, startTime);
    } catch (error) {}
  }
  static async factoryReset(req, res, next) {
    try {
      const getData = await User.deleteMany({
        type: "Hotel",
      });
      return _RS.ok(res, "Success", " get Content", {}, startTime);
    } catch (error) {}
  }
  static async getAllDriver(req, res, next) {
    try {
      const getAllDriver = await User.find({ type: "Driver" });
      return _RS.ok(res, "Success", "Driver List", getAllDriver, startTime);
    } catch (error) {
      next(error);
    }
  }
  
}
