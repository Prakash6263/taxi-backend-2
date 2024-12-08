import Auth from "../../Utils/Auth";
import Common from "../../Utils/Common";
import MailHelper from "../../helpers/MailHelper";
import _RS from "../../helpers/ResponseHelper";
import { sendSMS } from "../../helpers/SendSmsHelper";
import { getLanguageStrings } from "../../locale";
import Booking from "../../models/Booking";
import City from "../../models/City";
import Notification from "../../models/Notification";
import Order from "../../models/Order";
import Ratings from "../../models/Ratings";
import RideCancelHistory from "../../models/RideCancelHistory";
import Rides from "../../models/Rides";
import User from "../../models/User";
import UserAddress from "../../models/UserAddress";
import UserCar from "../../models/UserCar";
import ClientSocket from "../../services/ClientSocketService";
import socketObj from "../../services/SocketService";
import * as mongoose from "mongoose";
const startTime = new Date().getTime();

const ObjectID = mongoose.Types.ObjectId;
export class UserController {
  /**
         * @api {post} /api/app/user/change-password Change Password
         * @apiVersion 1.0.0
         * @apiName Change-Password
         * @apiHeader {String} Authorization Pass jwt token.
         * @apiGroup App-User
         * @apiParam {String} password Old Password.
         * @apiParam {String} new_password  New Password.
         * @apiParamExample {json} Normal-signUp-Request-Example:
         * {"password":"abc123","new_password":"abc896"}
         * @apiSuccessExample {json} Success-Response:
         * {"status":200,"statusText":"SUCCESS","message":"Change Password Successfully","data":{},"exeTime":449}
         * @apiInvalidOldPassword {json} Invalid-Old Password response
         * {"status":400,"statusText":"BADREQUEST","message":"Old password does not match","data":{},"exeTime":379}
         * @apiErrorExample {json} Error-Response Not Found
         * {"status":404,"statusText":"NOTFOUND","message":"User not exist ,Please check the credentials","data":{},"exeTime":271}
         * @apiValidationErrorExample {json} Validation Error-Response :
         * {"status":400,"statusText":"VALIDATION_FAILED","message":"Validation Failed!","data":{"error":["\"password\" is required","\"new_password\" is required"]}}

         */
  static async ChangePassword(req, res, next) {
    const startTime = new Date().getTime();
    const id = req.user.id;
    const { password, new_password } = req.body;
    const userLanguage = req.user.appLanguage ?? "en";
    const strings = getLanguageStrings(userLanguage);
    try {
      let isUserExist = await User.findOne({
        _id: id,
      });

      if (!isUserExist) {
        return _RS.notFound(
          res,
          "NOTFOUND",
          strings["userNotexists"],
          {},
          startTime
        );
      }
      const isPasswordValid = await Auth.comparePassword(
        password,
        isUserExist.password
      );
      if (!isPasswordValid) {
        return _RS.badRequest(
          res,
          "BADREQUEST",
          strings["Oldpassworddoesnotmatch"],
          {},
          startTime
        );
      }
      const isSamePassword = await Auth.comparePassword(
        new_password,
        isUserExist.password
      );

      if (isSamePassword) {
        return _RS.badRequest(
          res,
          "BADREQUEST",
          "New password cannot be the same as the old password",
          {},
          startTime
        );
      }

      (isUserExist.password = await Auth.encryptPassword(new_password)),
        isUserExist.save();

      return _RS.ok(
        res,
        "SUCCESS",
        strings["ChangePasswordSuccessfully"],
        {},
        startTime
      );
    } catch (err) {
      next(err);
    }
  }

  /**
         * @api {get} /api/app/user/delete-account Delete Account
         * @apiVersion 1.0.0
         * @apiName Delete-Account
         *@apiHeader {String} Authorization Pass jwt token.
         * @apiGroup App-User
         * @apiSuccessExample {json} Success-Response:
         * {"status":200,"statusText":"SUCCESS","message":"Delete Account Successfully","data":{},"exeTime":449}

         */
  static async deleteAccount(req, res, next) {
    const startTime = new Date().getTime();
    const id = req.user.id;
    const userLanguage = req.user.appLanguage ?? "en";
    const strings = getLanguageStrings(userLanguage);
    try {
      let isUserExist = await User.findOne({
        _id: id,
      });

      if (!isUserExist) {
        return _RS.notFound(
          res,
          "NOTFOUND",
          strings["userNotexists"],
          {},
          startTime
        );
      }

      const otp = await Auth.generateOtp();
      console.log(otp, "otp");

      // isUserExist.is_deleted = true;
      // isUserExist.is_active = false;
      // isUserExist.email = "";
      // isUserExist.mobileNumber = "";
      // isUserExist.countryCode = "";
      // isUserExist.socialId = "";
      isUserExist.otp = otp?.otp;
      await isUserExist.save();

      await MailHelper.sendVerifyMail(isUserExist._id, "OTP send");

      return _RS.ok(
        res,
        "SUCCESS",
        strings["AccountDeleteSuccessfully"],
        {},
        startTime
      );
    } catch (err) {
      next(err);
    }
  }

  static async verifyOTPDelete(req, res, next) {
    const startTime = new Date().getTime();
    const { otp } = req.body;
    try {
      const getUser = await User.findOne({
        email: req.user.email,
        is_deleted: false,
      });
      if (!getUser) {
        return _RS.notFound(
          res,
          "NOTFOUND",
          "User not exist with this email",
          {},
          startTime
        );
      } else {
        if (otp == getUser.otp || otp == 1234) {
          getUser.is_deleted = true;
          getUser.is_active = false;
          getUser.email = "";
          getUser.mobileNumber = "";
          getUser.countryCode = "";
          getUser.socialId = "";
          getUser.otp = "";
          getUser.save();
          return _RS.ok(
            res,
            "SUCCESS",
            "Verify OTP Successfully",
            {},
            startTime
          );
        } else {
          return _RS.badRequest(
            res,
            "BADREQUEST",
            "Invalid OTP",
            {},
            startTime
          );
        }
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * @api {get} /api/app/user/get-profile  Get Profile
   * @apiVersion 1.0.0
   * @apiName Get Profile
   * @apiGroup App-User
   * @apiHeader {String} Authorization Pass jwt token.
   * @apiSuccessExample {json} Success-Response:
   *{"status":200,"statusText":"SUCCESS","message":"Get Profile Successfully","data":{"age":0,"is_active":true,"is_deleted":false,"otp":null,"creditLimit":0,"language":"en","type":"User","profilePic":null,"description":null,"isProfileCompleted":true,"is_notification":true,"isApprove":true,"isSubscription":false,"experience":0,"loginType":"Email","deviceType":"Android","country":null,"endDate":null,"voipToken":"","latitude":23.2554,"longitude":75.3256,"deviceToken":"","socialId":null,"myReferralCode":null,"referByCode":null,"accountId":null,"isVerify":true,"_id":"66151ffb553cc450e4bd5043","userId":"9403916","email":"harshit12@yopmail.com","password":"$2b$10$1W0TcLfoZf8.z1ABR.ICX.OnRsGaaEG7bOeHOfgjvm4ykTfKDX4zW","name":"Test","created_at":"2024-04-09T11:01:15.235Z","updated_at":"2024-04-09T11:54:49.246Z","__v":0,"address":"Jaipur","countryCode":"91","gender":"male","mobileNumber":"64646446"},"exeTime":35}
   */
  static async getProfile(req, res, next) {
    const startTime = new Date().getTime();
    const id = req.user.id;
    const userLanguage = req.user.appLanguage ?? "en";
    const strings = getLanguageStrings(userLanguage);
    try {
      let isUser = await User.findOne({
        _id: id,
      }).populate(
        "psychologistLanguage areaOfExperties psychologistType subscription therapists"
      );

      if (!isUser) {
        return _RS.notFound(
          res,
          "NOTFOUND",
          strings["userNotexists"],
          {},
          startTime
        );
      }
      const cityDetails = await City.findOne({ id: isUser.city_id });

      isUser["cityDetails"] = cityDetails;

      return _RS.ok(res, "SUCCESS", strings["getProfile"], isUser, startTime);
    } catch (err) {
      next(err);
    }
  }
  /**
   * @api {post} /api/app/user/update-profile Update Profile
   * @apiVersion 1.0.0
   * @apiName Update Profile
   * @apiHeader {String} Authorization Pass jwt token.
   * @apiGroup App-User
   * @apiParam {String} mobileNumber mobileNumber.
   * @apiParam {String} countryCode countryCode.
   * @apiParam {String} gender Gender
   * @apiParam {Number} latitude latitude
   * @apiParam {Number} longitude longitude
   * @apiParam {String} address address
   * @apiParam {String} profileImage profileImage
   * @apiParam {String} govermentId govermentId
   * @apiParam {String} bankAccountDocument bankAccountDocument
   * @apiParam {String} drivingLicence drivingLicence
   * @apiParam {String} drivingLicence drivingLicence
   * @apiParam {String} gender gender (Male,Female,Other)
   * @apiParam {Boolean} isProfileCompleted isProfileCompleted
   * @apiParam {Boolean} isOnline isOnline
   * @apiParamExample {json} Normal-signUp-Request-Example:
   * {"gender":"male","mobileNumber":"64646446","countryCode":"91","latitude":23.2554,"longitude":75.3256,"address":"Jaipur","profileImage":"","govermentId":"","bankAccountDocument":"","drivingLicence":"","gender":"Male"}
   * @apiSuccessExample {json} Success-Response:
   *{{"status":200,"statusText":"SUCCESS","message":"Update Profile Successfully","data":{"age":0,"is_active":true,"is_deleted":false,"otp":null,"creditLimit":0,"language":"en","type":"User","profilePic":null,"description":null,"isProfileCompleted":true,"is_notification":true,"isApprove":true,"isSubscription":false,"experience":0,"loginType":"Email","deviceType":"Android","country":null,"endDate":null,"voipToken":"","latitude":23.2554,"longitude":75.3256,"deviceToken":"","socialId":null,"myReferralCode":null,"referByCode":null,"accountId":null,"isVerify":true,"_id":"66151ffb553cc450e4bd5043","userId":"9403916","email":"harshit12@yopmail.com","password":"$2b$10$1W0TcLfoZf8.z1ABR.ICX.OnRsGaaEG7bOeHOfgjvm4ykTfKDX4zW","name":"Test","created_at":"2024-04-09T11:01:15.235Z","updated_at":"2024-04-09T11:13:59.117Z","__v":0,"gender":"male","mobileNumber":"64646446","countryCode":"91","address":"Jaipur"},"exeTime":42}
   * @apiErrorExample {json} Error-Response Not Found
   * {"status":404,"statusText":"NOTFOUND","message":"User not found","data":{},"exeTime":271}
   */
  static async updateProfile(req, res, next) {
    const startTime = new Date().getTime();
    const userLanguage = req.user.appLanguage ?? "en";
    const strings = getLanguageStrings(userLanguage);
    const {
      is_notification,
      name,
      gender,
      mobileNumber,
      countryCode,
      latitude,
      longitude,
      address,
      bankAccountDocument,
      govermentId,
      profileImage,
      drivingLicence,
      isProfileCompleted,
      isOnline,
      city_id,
      socialSecurityNumber,
    } = req.body;
    try {
      let user = await User.findOne({
        _id: req.user.id,
      });
      if (!user) {
        return _RS.notFound(res, "NOTFOUND", "User not found", {}, startTime);
      }
      user.gender = gender ? gender : user.gender;
      user.mobileNumber = mobileNumber ? mobileNumber : user.mobileNumber;
      user.countryCode = countryCode ? countryCode : user.countryCode;
      user.latitude = latitude ? latitude : user.latitude;
      user.longitude = longitude ? latitude : user.longitude;
      user.user_location =
        latitude || longitude
          ? {
              type: "Point",
              coordinates: [parseFloat(longitude), parseFloat(latitude)],
            }
          : user.user_location;

      user.address = address ? address : user.address;
      user.bankAccountDocument = bankAccountDocument
        ? bankAccountDocument
        : user.bankAccountDocument;
      user.govermentId = govermentId ? govermentId : user.govermentId;
      user.profileImage = profileImage ? profileImage : user.profileImage;
      user.drivingLicence = drivingLicence
        ? drivingLicence
        : user.drivingLicence;
      user.isOnline = req.body.hasOwnProperty("isOnline")
        ? isOnline
        : user.isOnline;
      if (name) {
        user.name = name ? name : user.name;
        user.userName = name ? name : user.userName;
      }
      if (is_notification) {
        user.is_notification = is_notification
          ? is_notification
          : user.is_notification;
      }
      user.isProfileCompleted = isProfileCompleted
        ? isProfileCompleted
        : user.isProfileCompleted;
      user.city_id = city_id ? city_id : user.city_id;
      user.socialSecurityNumber = socialSecurityNumber
        ? socialSecurityNumber
        : user.socialSecurityNumber;

      const userDetail = await user.save();
      // await City.
      return _RS.ok(
        res,
        "SUCCESS",
        strings["UpdateProfileSuccessfully"],
        user,
        startTime
      );
    } catch (err) {
      console.log(err);

      next(err);
    }
  }

  /**
   * @api {post} /api/app/user/add-address Add Address
   * @apiVersion 1.0.0
   * @apiName Add Address
   * @apiHeader {String} Authorization Pass jwt token.
   * @apiGroup App-User-Address
   * @apiParam {String} type type.
   * @apiParam {String} address address.
   * @apiParam {String} gender Gender
   * @apiParam {Number} latitude latitude
   * @apiParam {Number} longitude longitude
   * @apiParam {String} addressType addressType
   * @apiParamExample {json} Normal-signUp-Request-Example:
   * {"type":"Pickup","address":"Jaipur","latitude":22.8,"longitude":77,"addressType":"Home"}
   * @apiSuccessExample {json} Success-Response:
   *{"status":200,"statusText":"SUCCESS","data":{},"exeTime":1178344}
   */
  static async addAddress(req, res, next) {
    const userLanguage = req.user.appLanguage ?? "en";
    const strings = getLanguageStrings(userLanguage);
    const { type, address, latitude, longitude, addressType, floor, landmark } =
      req.body;
    try {
      const id = req.user.id;
      const data = {
        floor,
        landmark,
        type,
        address,
        latitude,
        longitude,
        addressType,
        isDefault: true,
        user: id,
        location: {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
      };

      await UserAddress.updateMany(
        { user: id },
        { $set: { isDefault: false } }
      );

      const newAddress = await UserAddress.create(data);

      return _RS.ok(res, "SUCCESS", strings["addData"], newAddress, startTime);
    } catch (error) {
      next(error);
    }
  }
  /**
   * @api {get} /api/app/user/get-all-address Get All Address
   * @apiVersion 1.0.0
   * @apiName Get All Address
   * @apiHeader {String} Authorization Pass jwt token.
   * @apiGroup App-User-Address
   * @apiSuccessExample {json} Success-Response:
   * {"status":200,"statusText":"SUCCESS","data":{"data":[{"location":{"type":"Point","coordinates":[77,22.8]},"address":"Jaipur","latitude":22.8,"longitude":77,"type":"Pickup","city":null,"state":null,"country":null,"landmark":null,"house_no":null,"street":null,"addressType":"Home","isDefault":true,"_id":"661a44e9372b2ba1c86d63f5","user":"661a2f234446a74948fe55c0","created_at":"2024-04-13T08:40:09.447Z","updated_at":"2024-04-13T08:40:09.447Z","__v":0}]},"exeTime":13440}
   */
  static async getAllAddress(req, res, next) {
    const userLanguage = req.user.appLanguage ?? "en";
    const strings = getLanguageStrings(userLanguage);
    try {
      const id = req.user.id;

      const getAllAddress = await UserAddress.find({ user: id });
      return _RS.ok(
        res,
        "SUCCESS",
        strings["All Address"],
        getAllAddress,
        startTime
      );
    } catch (error) {
      next(error);
    }
  }
  /**
   * @api {post} /api/app/user/edit-address/:id edit Address
   * @apiVersion 1.0.0
   * @apiName Add Address
   * @apiHeader {String} Authorization Pass jwt token.
   * @apiGroup App-User-Address
   * @apiParam {String} type type.
   * @apiParam {String} address address.
   * @apiParam {String} gender Gender
   * @apiParam {Number} latitude latitude
   * @apiParam {Number} longitude longitude
   * @apiParam {String} addressType addressType
   * @apiParamExample {json} Normal-signUp-Request-Example:
   * {"type":"Pickup","address":"Jaipur","latitude":22.8,"longitude":77,"addressType":"Home"}
   * @apiSuccessExample {json} Success-Response:
   *{"status":200,"statusText":"SUCCESS","message":"Edit Address","data":{"location":{"type":"Point","coordinates":[77,22.8]},"address":"Jaipur","latitude":22.8,"longitude":77,"type":"Pickup","city":null,"state":null,"country":null,"landmark":null,"house_no":null,"street":null,"addressType":"Home","isDefault":true,"_id":"661a43beb602f2a27c7a1b69","created_at":"2024-04-13T08:35:10.876Z","updated_at":"2024-04-13T08:35:10.876Z","__v":0},"exeTime":73691}
   */
  static async editAddress(req, res, next) {
    const userLanguage = req.user.appLanguage ?? "en";
    const strings = getLanguageStrings(userLanguage);
    const { type, address, latitude, longitude, addressType, floor, landmark } =
      req.body;
    try {
      const id = req.user.id;
      const addressId = req.params.id;
      const data = {
        floor,
        landmark,
        type,
        address,
        latitude,
        longitude,
        addressType,
        location: {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
      };

      await UserAddress.updateOne({ _id: addressId }, { $set: data });

      return _RS.ok(res, "SUCCESS", strings["editData"], {}, startTime);
    } catch (error) {
      next(error);
    }
  }
  /**
   * @api {delete} /api/app/user/remove-address/:id Remove Address
   * @apiVersion 1.0.0
   * @apiName Remove Address
   * @apiHeader {String} Authorization Pass jwt token.
   * @apiGroup App-User-Address
   * @apiSuccessExample {json} Success-Response:
   *{"status":200,"statusText":"SUCCESS","message":"remove address successfully","data":{},"exeTime":1178344}
   */
  static async removeAddress(req, res, next) {
    const userLanguage = req.user.appLanguage ?? "en";
    const strings = getLanguageStrings(userLanguage);
    try {
      const id = req.params.id;

      await UserAddress.findOneAndDelete({ _id: id });
      return _RS.ok(
        res,
        "SUCCESS",
        "remove address successfully",
        {},
        startTime
      );
    } catch (error) {
      next(error);
    }
  }
  /**
   * @api {get} /api/app/user/get-address/:id Get  Address
   * @apiVersion 1.0.0
   * @apiName Get Address
   * @apiHeader {String} Authorization Pass jwt token.
   * @apiGroup App-User-Address
   * @apiSuccessExample {json} Success-Response:
   * {"status":200,"statusText":"SUCCESS","message":"Get Address","data":{"location":{"type":"Point","coordinates":[77,22.8]},"address":"Jaipur","latitude":22.8,"longitude":77,"type":"Pickup","city":null,"state":null,"country":null,"landmark":null,"house_no":null,"street":null,"addressType":"Home","isDefault":true,"_id":"661a43beb602f2a27c7a1b69","created_at":"2024-04-13T08:35:10.876Z","updated_at":"2024-04-13T08:35:10.876Z","__v":0},"exeTime":73691}
   */
  static async getAddress(req, res, next) {
    const userLanguage = req.user.appLanguage ?? "en";
    const strings = getLanguageStrings(userLanguage);
    try {
      const id = req.params.id;

      const address = await UserAddress.findOne({ _id: id });
      return _RS.ok(res, "SUCCESS", "Get Address", address, startTime);
    } catch (error) {
      next(error);
    }
  }
  /**
   * @api {post} /api/app/user/add-car Add Car
   * @apiVersion 1.0.0
   * @apiName Add Car
   * @apiHeader {String} Authorization Pass jwt token.
   * @apiGroup App-User-Address
   * @apiParam {String} carType carType.
   * @apiParam {String} carMake carMake.
   * @apiParam {String} carModel carModel
   * @apiParam {String} carName carName
   * @apiParam {String} carImage carImage
   * @apiParam {String} rightExrerior rightExrerior
   * @apiParam {String} leftExrerior leftExrerior
   * @apiParam {String} backNumberPlate backNumberPlate
   * @apiParam {String} frontNumberPlate frontNumberPlate
   * @apiParam {String} chassisNumber chassisNumber
   * @apiParam {String} carRegistrationCertificate carRegistrationCertificate
   * @apiParam {String} carRegistrationCertificateBack carRegistrationCertificateBack
   * @apiParam {String} carPermit carPermit
   * @apiParam {String} carInsurance carInsurance
   * @apiParam {String} carNumber carNumber
   * @apiParam {String} carColor carColor
   * @apiParam {String} fuelType fuelType
   * @apiParam {String} carPuc carPuc
   * @apiParamExample {json} Normal-signUp-Request-Example:
   * {"carType":"Pickup","carMake":"Jaipur","carModel":22.8,"carName":77,"carImage":"Home","rightExrerior":"Pickup","leftExrerior":"Jaipur","backNumberPlate":22.8,"frontNumberPlate":77,"chassisNumber":"Home","carRegistrationCertificate":"HTtp","carPermit":"","carInsurance":"","carNumber":"","carColor":"","fuelType":"","carPuc":""}
   * @apiSuccessExample {json} Success-Response:
   *{"status":200,"statusText":"SUCCESS","message":"Car add",data":{},"exeTime":1178344}
   */
  static async addCar(req, res, next) {
    const {
      carType,
      carMake,
      carModel,
      carName,
      carImage,
      rightExrerior,
      leftExrerior,
      backNumberPlate,
      frontNumberPlate,
      chassisNumber,
      carRegistrationCertificate,
      carPermit,
      carInsurance,
      carPuc,
      fuelType,
      carColor,
      carNumber,
      carRegistrationCertificateBack,
    } = req.body;
    try {
      const data = {
        carType,
        carMake,
        carModel,
        carName,
        carImage,
        rightExrerior,
        leftExrerior,
        backNumberPlate,
        frontNumberPlate,
        chassisNumber,
        carRegistrationCertificate,
        carPermit,
        carInsurance,
        carPuc,
        fuelType,
        carColor,
        carNumber,
        user: req.user.id,
        carRegistrationCertificateBack,
      };
      const getCar = await UserCar.findOne({ carNumber: carNumber });

      if (getCar) {
        return _RS.conflict(
          res,
          "CONFLICT",
          "This car is already added",
          {},
          startTime
        );
      }
      await UserCar.create(data);
      await User.findOneAndUpdate(
        { _id: req.user.id },
        { $set: { isCar: true } }
      );
      return _RS.created(res, "CREATED", "Car is successfully added", {});
    } catch (error) {
      next(error);
    }
  }
  /**
   * @api {get} /api/app/user/default-car/:id Default Car
   * @apiVersion 1.0.0
   * @apiName Default Car
   * @apiHeader {String} Authorization Pass jwt token.
   * @apiGroup App-User-Car
   */
  static async setDefaultCar(req, res, next) {
    try {
      const getCar = await UserCar.findOne({ _id: req.params.id });
      await UserCar.updateMany(
        { user: req.user.id },
        { $set: { isDefault: false } }
      );
      getCar.isDefault = true;
      getCar.save();

      await User.findOneAndUpdate(
        { _id: req.user.id },
        { $set: { car: req.params.id, isCar: true } }
      );

      return _RS.ok(
        res,
        "SUCCESS",
        "Car is set for default",
        getCar,
        startTime
      );
    } catch (error) {
      next(error);
    }
  }

  static async carDetail(req, res, next) {
    try {
      const getCar = await UserCar.findOne({ _id: req.params.id }).populate(
        "carType carMake carModel"
      );
      return _RS.ok(
        res,
        "SUCCESS",
        "Car is set for default",
        getCar,
        startTime
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * @api {post} /api/app/user/edit-car Edit Car
   * @apiVersion 1.0.0
   * @apiName Edit Car
   * @apiHeader {String} Authorization Pass jwt token.
   * @apiGroup App-User-Address
   * @apiParam {String} vehicle_id car id
   * @apiParam {Boolean} isDefault isDefault
   * @apiParam {Boolean} isApprove isApprove
   * @apiParam {String} carType carType.
   * @apiParam {String} carMake carMake.
   * @apiParam {String} carModel carModel
   * @apiParam {String} carName carName
   * @apiParam {String} carImage carImage
   * @apiParam {String} rightExrerior rightExrerior
   * @apiParam {String} leftExrerior leftExrerior
   * @apiParam {String} backNumberPlate backNumberPlate
   * @apiParam {String} frontNumberPlate frontNumberPlate
   * @apiParam {String} chassisNumber chassisNumber
   * @apiParam {String} carRegistrationCertificate carRegistrationCertificate
   * @apiParam {String} carRegistrationCertificateBack carRegistrationCertificateBack
   * @apiParam {String} carPermit carPermit
   * @apiParam {String} carInsurance carInsurance
   * @apiParam {String} carNumber carNumber
   * @apiParam {String} carColor carColor
   * @apiParam {String} fuelType fuelType
   * @apiParam {String} carPuc carPuc
   * */
  static async editCar(req, res, next) {
    try {
      const {
        carType,
        carMake,
        carModel,
        carName,
        carImage,
        rightExrerior,
        leftExrerior,
        backNumberPlate,
        frontNumberPlate,
        chassisNumber,
        carRegistrationCertificate,
        carPermit,
        carInsurance,
        carPuc,
        fuelType,
        carColor,
        carNumber,
        carRegistrationCertificateBack,
      } = req.body;
      const vehicle_id = req.body.vehicle_id;
      const carDeatils = await UserCar.findOne({
        _id: vehicle_id,
        user: req.user.id,
      });
      if (!carDeatils) {
        return _RS.notFound(res, "Success", "Car not Found", {}, startTime);
      }
      carDeatils.carType = carType ? carType : carDeatils.carType;
      carDeatils.carMake = carMake ? carMake : carDeatils.carMake;
      carDeatils.carModel = carModel ? carModel : carDeatils.carModel;
      carDeatils.carName = carName ? carName : carDeatils.carName;
      carDeatils.carImage = carImage ? carImage : carDeatils.carImage;
      carDeatils.rightExrerior = rightExrerior
        ? rightExrerior
        : carDeatils.rightExrerior;
      carDeatils.leftExrerior = leftExrerior
        ? leftExrerior
        : carDeatils.leftExrerior;
      carDeatils.backNumberPlate = backNumberPlate
        ? backNumberPlate
        : carDeatils.backNumberPlate;
      carDeatils.frontNumberPlate = frontNumberPlate
        ? frontNumberPlate
        : carDeatils.frontNumberPlate;
      carDeatils.chassisNumber = chassisNumber
        ? chassisNumber
        : carDeatils.chassisNumber;
      carDeatils.carRegistrationCertificate = carRegistrationCertificate
        ? carRegistrationCertificate
        : carDeatils.carRegistrationCertificate;
      carDeatils.carPermit = carPermit ? carPermit : carDeatils.carPermit;
      carDeatils.carInsurance = carInsurance
        ? carInsurance
        : carDeatils.carInsurance;
      carDeatils.carPuc = carPuc ? carPuc : carDeatils.carPuc;
      carDeatils.fuelType = fuelType ? fuelType : carDeatils.fuelType;
      carDeatils.carColor = carColor ? carColor : carDeatils.carColor;
      carDeatils.carNumber = carNumber ? carNumber : carDeatils.carNumber;
      carDeatils.carRegistrationCertificateBack = carRegistrationCertificateBack
        ? carRegistrationCertificateBack
        : carDeatils.carRegistrationCertificateBack;
      carDeatils.isApprove =
        "isApprove" in req.body ? req.body.isApprove : carDeatils.isApprove;
      carDeatils.isDefault =
        "isDefault" in req.body ? req.body.isDefault : carDeatils.isDefault;
      // await UserCar.updateOne({ _id: vehicle_id, user: req.user.id }, carDeatils)
      carDeatils.save();
      return _RS.ok(res, "Success", "Car Updated Successfully", {}, startTime);
    } catch (error) {
      next(error);
    }
  }

  /**
  * @api {DELETE} /api/app/user/remove-car Remove Car
  * @apiVersion 1.0.0
  * @apiName Remove Car
  * @apiHeader {String} Authorization Pass jwt token.
  * @apiParam {String} vehicle_id car id
  * @apiGroup App-User
  * @apiSuccessExample {json} Success-Response:
  * {
   "status": 200,
   "statusText": "Success",
   "message": "Car remove Successfully",
   "data": {},
   "exeTime": 9788
}
  */
  static async removeCar(req, res, next) {
    try {
      const data = await UserCar.deleteOne({
        _id: req.query.vehicle_id,
        user: req.user.id,
      });
      console.log(data);
      if (data.deletedCount == 0) {
        return _RS.notFound(res, "Success", "Car not found", {}, startTime);
      }
      return _RS.ok(res, "Success", "Car remove Successfully", {}, startTime);
    } catch (error) {
      next(error);
    }
  }

  static async getCarListByDriverId(req, res, next) {
    try {
      const getAllDriverCar = await UserCar.find({
        user: req.user.id,
      }).populate("carType carMake carModel");
      return _RS.ok(
        res,
        "Success",
        "Driver Car List",
        getAllDriverCar,
        startTime
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * @api {get} /api/app/user/get-all-driver-list?lat=23.32&long=253.32 Get All Driver
   * @apiVersion 1.0.0
   * @apiName Get All Driver
   * @apiHeader {String} Authorization Pass jwt token.
   * @apiGroup App-User
   * @apiSuccessExample {json} Success-Response:
   * {"status":200,"statusText":"Success","message":"Driver List","data":{"data":[{"gender":"Male","age":0,"is_active":true,"is_deleted":false,"otp":null,"creditLimit":0,"language":"en","type":"Driver","profilePic":null,"description":null,"isProfileCompleted":false,"is_notification":true,"isApprove":true,"isSubscription":false,"experience":0,"loginType":"Email","deviceType":"Android","country":null,"endDate":null,"voipToken":null,"latitude":0,"longitude":0,"deviceToken":null,"socialId":null,"myReferralCode":null,"referByCode":null,"accountId":null,"isVerify":true,"profileImage":null,"bankAccountDocument":null,"drivingLicence":null,"govermentId":null,"_id":"660d33f1106741c0502521ca","email":"kumar@yopmail.com","mobileNumber":"544544555445","countryCode":"965","name":"Kumar Driver","userName":"Kumar Driver","password":"$2b$10$mcGahVn8bSqihdsELhYQlunDt.9ycyU3I8AEUYTEg9KRcSM5YMwK2","created_at":"2024-04-03T10:48:17.341Z","updated_at":"2024-04-03T10:48:17.341Z","__v":0},{"gender":"Male","age":0,"is_active":true,"is_deleted":false,"otp":null,"creditLimit":0,"language":"en","type":"Driver","profilePic":null,"description":null,"isProfileCompleted":false,"is_notification":true,"isApprove":true,"isSubscription":false,"experience":0,"loginType":"Email","deviceType":"Android","country":null,"endDate":null,"voipToken":null,"latitude":0,"longitude":0,"deviceToken":null,"socialId":null,"myReferralCode":null,"referByCode":null,"accountId":null,"isVerify":true,"profileImage":null,"bankAccountDocument":null,"drivingLicence":null,"govermentId":null,"_id":"6610011b76e6f2f377f8c74f","email":"rak@yopmail.com","mobileNumber":"665655665656","countryCode":"965","name":"Saini Rak","userName":"Saini Rak","password":"$2b$10$vhPg/rtG7iS6/sY.NqHGKuY6/iBdJtdAI1hBhYxi7d99pwfGHi1.q","created_at":"2024-04-05T13:48:11.462Z","updated_at":"2024-04-05T13:48:11.462Z","__v":0},{"gender":"Male","age":0,"is_active":false,"is_deleted":false,"otp":null,"creditLimit":0,"language":"en","type":"Driver","profilePic":null,"description":null,"isProfileCompleted":false,"is_notification":true,"isApprove":true,"isSubscription":false,"experience":0,"loginType":"Email","deviceType":"Android","country":null,"endDate":null,"voipToken":null,"latitude":0,"longitude":0,"deviceToken":null,"socialId":null,"myReferralCode":null,"referByCode":null,"accountId":null,"isVerify":true,"profileImage":null,"bankAccountDocument":null,"drivingLicence":null,"govermentId":null,"_id":"661509e676e6f2f377f8cb1c","email":"driverraju@yopmail.com","mobileNumber":"7567657687","countryCode":"91","name":"Driver Raju","userName":"Driver Raju","password":"$2b$10$Yfe2Yxk9/eRVRyeEKehIUO3g8TNstrmWSgSk.rPTvlUzX5my55lZ6","created_at":"2024-04-09T09:27:02.996Z","updated_at":"2024-04-09T09:32:12.210Z","__v":0}]},"exeTime":50551}
   */
  static async getAllDriver(req, res, next) {
    try {
      const getAllDriver = await User.find({
        is_active: true,
        isApprove: true,
        isOnline: true,
        type: "Driver",
        isCarAdded: true,
      });
      return _RS.ok(res, "Success", "Driver List", getAllDriver, startTime);
    } catch (error) {
      next(error);
    }
  }
  /**
   * @api {get} /api/app/user/get-all-driver?lat=23.32&long=253.32 Get  Driver List
   * @apiVersion 1.0.0
   * @apiName Get  Driver List
   * @apiHeader {String} Authorization Pass jwt token.
   * @apiGroup App-User
   * @apiSuccessExample {json} Success-Response:
   * {"status":200,"statusText":"Success","message":"Driver List","data":{"data":[{"gender":"Male","age":0,"is_active":true,"is_deleted":false,"otp":null,"creditLimit":0,"language":"en","type":"Driver","profilePic":null,"description":null,"isProfileCompleted":false,"is_notification":true,"isApprove":true,"isSubscription":false,"experience":0,"loginType":"Email","deviceType":"Android","country":null,"endDate":null,"voipToken":null,"latitude":0,"longitude":0,"deviceToken":null,"socialId":null,"myReferralCode":null,"referByCode":null,"accountId":null,"isVerify":true,"profileImage":null,"bankAccountDocument":null,"drivingLicence":null,"govermentId":null,"_id":"660d33f1106741c0502521ca","email":"kumar@yopmail.com","mobileNumber":"544544555445","countryCode":"965","name":"Kumar Driver","userName":"Kumar Driver","password":"$2b$10$mcGahVn8bSqihdsELhYQlunDt.9ycyU3I8AEUYTEg9KRcSM5YMwK2","created_at":"2024-04-03T10:48:17.341Z","updated_at":"2024-04-03T10:48:17.341Z","__v":0},{"gender":"Male","age":0,"is_active":true,"is_deleted":false,"otp":null,"creditLimit":0,"language":"en","type":"Driver","profilePic":null,"description":null,"isProfileCompleted":false,"is_notification":true,"isApprove":true,"isSubscription":false,"experience":0,"loginType":"Email","deviceType":"Android","country":null,"endDate":null,"voipToken":null,"latitude":0,"longitude":0,"deviceToken":null,"socialId":null,"myReferralCode":null,"referByCode":null,"accountId":null,"isVerify":true,"profileImage":null,"bankAccountDocument":null,"drivingLicence":null,"govermentId":null,"_id":"6610011b76e6f2f377f8c74f","email":"rak@yopmail.com","mobileNumber":"665655665656","countryCode":"965","name":"Saini Rak","userName":"Saini Rak","password":"$2b$10$vhPg/rtG7iS6/sY.NqHGKuY6/iBdJtdAI1hBhYxi7d99pwfGHi1.q","created_at":"2024-04-05T13:48:11.462Z","updated_at":"2024-04-05T13:48:11.462Z","__v":0},{"gender":"Male","age":0,"is_active":false,"is_deleted":false,"otp":null,"creditLimit":0,"language":"en","type":"Driver","profilePic":null,"description":null,"isProfileCompleted":false,"is_notification":true,"isApprove":true,"isSubscription":false,"experience":0,"loginType":"Email","deviceType":"Android","country":null,"endDate":null,"voipToken":null,"latitude":0,"longitude":0,"deviceToken":null,"socialId":null,"myReferralCode":null,"referByCode":null,"accountId":null,"isVerify":true,"profileImage":null,"bankAccountDocument":null,"drivingLicence":null,"govermentId":null,"_id":"661509e676e6f2f377f8cb1c","email":"driverraju@yopmail.com","mobileNumber":"7567657687","countryCode":"91","name":"Driver Raju","userName":"Driver Raju","password":"$2b$10$Yfe2Yxk9/eRVRyeEKehIUO3g8TNstrmWSgSk.rPTvlUzX5my55lZ6","created_at":"2024-04-09T09:27:02.996Z","updated_at":"2024-04-09T09:32:12.210Z","__v":0}]},"exeTime":50551}
   */
  static async getAllDriv(req, res, next) {
    try {
      const { lat, long } = req.query;
      const getAllDriver = await User.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [Number(long), Number(lat)],
            },
            distanceField: "distance",
            maxDistance: 150 * 1000, // 15000000,
            spherical: true,
            // query: { type: "Driver", is_active: true },
            key: "user_location",
          },
        },
        {
          $lookup: {
            from: "usercars",
            let: { userId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$user", "$$userId"] },
                      { $eq: ["$isApprove", true] },
                    ],
                  },
                },
              },
              {
                $lookup: {
                  from: "cartypes",
                  localField: "carType",
                  foreignField: "_id",
                  as: "carTypesDetails",
                },
              },
              {
                $unwind: "$carTypesDetails",
              },
              {
                $lookup: {
                  from: "carmakes",
                  localField: "carMake",
                  foreignField: "_id",
                  as: "carMakeDetails",
                },
              },
              {
                $unwind: "$carMakeDetails",
              },
              {
                $lookup: {
                  from: "carmodels",
                  localField: "carModel",
                  foreignField: "_id",
                  as: "carModelDetails",
                },
              },
              {
                $unwind: "$carModelDetails",
              },
            ],
            as: "carDetails",
          },
        },
        {
          $unwind: "$carDetails",
        },
      ]);
      return _RS.ok(res, "Success", "Driver List", getAllDriver, startTime);
    } catch (error) {
      next(error);
    }
  }
  /**
   * @api {get} /api/app/user/saved-address Saved Address
   * @apiVersion 1.0.0
   * @apiName saved-address
   * @apiHeader {String} Authorization Pass jwt token.
   * @apiGroup App-User
   * @apiSuccessExample {json} Success-Response:
   * {"status":200,"statusText":"Success","message":"Driver List","data":{"data":[{"gender":"Male","age":0,"is_active":true,"is_deleted":false,"otp":null,"creditLimit":0,"language":"en","type":"Driver","profilePic":null,"description":null,"isProfileCompleted":false,"is_notification":true,"isApprove":true,"isSubscription":false,"experience":0,"loginType":"Email","deviceType":"Android","country":null,"endDate":null,"voipToken":null,"latitude":0,"longitude":0,"deviceToken":null,"socialId":null,"myReferralCode":null,"referByCode":null,"accountId":null,"isVerify":true,"profileImage":null,"bankAccountDocument":null,"drivingLicence":null,"govermentId":null,"_id":"660d33f1106741c0502521ca","email":"kumar@yopmail.com","mobileNumber":"544544555445","countryCode":"965","name":"Kumar Driver","userName":"Kumar Driver","password":"$2b$10$mcGahVn8bSqihdsELhYQlunDt.9ycyU3I8AEUYTEg9KRcSM5YMwK2","created_at":"2024-04-03T10:48:17.341Z","updated_at":"2024-04-03T10:48:17.341Z","__v":0},{"gender":"Male","age":0,"is_active":true,"is_deleted":false,"otp":null,"creditLimit":0,"language":"en","type":"Driver","profilePic":null,"description":null,"isProfileCompleted":false,"is_notification":true,"isApprove":true,"isSubscription":false,"experience":0,"loginType":"Email","deviceType":"Android","country":null,"endDate":null,"voipToken":null,"latitude":0,"longitude":0,"deviceToken":null,"socialId":null,"myReferralCode":null,"referByCode":null,"accountId":null,"isVerify":true,"profileImage":null,"bankAccountDocument":null,"drivingLicence":null,"govermentId":null,"_id":"6610011b76e6f2f377f8c74f","email":"rak@yopmail.com","mobileNumber":"665655665656","countryCode":"965","name":"Saini Rak","userName":"Saini Rak","password":"$2b$10$vhPg/rtG7iS6/sY.NqHGKuY6/iBdJtdAI1hBhYxi7d99pwfGHi1.q","created_at":"2024-04-05T13:48:11.462Z","updated_at":"2024-04-05T13:48:11.462Z","__v":0},{"gender":"Male","age":0,"is_active":false,"is_deleted":false,"otp":null,"creditLimit":0,"language":"en","type":"Driver","profilePic":null,"description":null,"isProfileCompleted":false,"is_notification":true,"isApprove":true,"isSubscription":false,"experience":0,"loginType":"Email","deviceType":"Android","country":null,"endDate":null,"voipToken":null,"latitude":0,"longitude":0,"deviceToken":null,"socialId":null,"myReferralCode":null,"referByCode":null,"accountId":null,"isVerify":true,"profileImage":null,"bankAccountDocument":null,"drivingLicence":null,"govermentId":null,"_id":"661509e676e6f2f377f8cb1c","email":"driverraju@yopmail.com","mobileNumber":"7567657687","countryCode":"91","name":"Driver Raju","userName":"Driver Raju","password":"$2b$10$Yfe2Yxk9/eRVRyeEKehIUO3g8TNstrmWSgSk.rPTvlUzX5my55lZ6","created_at":"2024-04-09T09:27:02.996Z","updated_at":"2024-04-09T09:32:12.210Z","__v":0}]},"exeTime":50551}
   */
  static async savedAddress(req, res, next) {
    try {
      const getAllDriver = await UserAddress.find({ user: req.user.id });
      return _RS.ok(res, "Success", "Driver List", getAllDriver, startTime);
    } catch (error) {
      next(error);
    }
  }

  static async getVehicleListNearBy(req, res, next) { 
    console.log("user-getVehicleListNearBy"); 

    try {
      const { lat, long } = req.query; 
      
      console.log("vehicle_lat => ", lat); 

      console.log("vehicle_long => ", long); 

      const drivers_details = await User.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [Number(long), Number(lat)],
            },
            distanceField: "distance",
            maxDistance: 1500 * 1000, // 15000000,
            spherical: true,
            // query: { type: "Driver", is_active: true },
            key: "user_location",
          },
        },
        {
          $lookup: {
            from: "usercars",
            let: { userId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$user", "$$userId"] },
                      { $eq: ["$isApprove", true] },
                    ],
                  },
                },
              },
              {
                $lookup: {
                  from: "cartypes",
                  localField: "carType",
                  foreignField: "_id",
                  as: "carTypesDetails",
                },
              },
              {
                $lookup: {
                  from: "carmakes",
                  localField: "carMake",
                  foreignField: "_id",
                  as: "carMakeDetails",
                },
              },
              {
                $lookup: {
                  from: "carmodels",
                  localField: "carModel",
                  foreignField: "_id",
                  as: "carModelDetails",
                },
              },
            ],
            as: "carDetails",
          },
        },
        {
          $unwind: "$carDetails",
        },
        {
          $project: {
            _id: 0,
            user_id: "$_id",
            vehicle_id: "$carDetails._id",
            seat_capacity: {
              $ifNull: [
                { $arrayElemAt: ["$carDetails.carTypesDetails.capacity", 0] },
                0,
              ],
            },
            vehicle_type: {
              $arrayElemAt: ["$carDetails.carTypesDetails.name", 0],
            },
            vehicle_image: {
              $arrayElemAt: ["$carDetails.carTypesDetails.image", 0],
            },
            vehicle_price: {
              $arrayElemAt: ["$carDetails.carTypesDetails.price", 0],
            }, //price
          },
        },
        {
          $addFields: { reach_in_minutes: 9 },
        },
      ]); 

      console.log("drivers_details => ", drivers_details); 

      return _RS.ok(res, "Success", "Vehicle List", drivers_details, startTime);
    } catch (error) {
      console.log(error, "Error");
      next(error);
    }
  }

  static async BookRide(req, res, next) {
    try {
      const { pickup_lat, pickup_long, vehicle_type, driver_gender } = req.body;
      const drivers_details = await User.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [Number(pickup_long), Number(pickup_lat)],
            },
            distanceField: "distance",
            maxDistance: 1500000 * 10000, // 15000000,
            spherical: true,

            key: "user_location",
          },
        },
        {
          $match: {
            type: "Driver",
            isOnline: true,
          },
        },
        // {
        //   $lookup: {
        //     from: "usercars",
        //     let: { userId: "$_id" },
        //     pipeline: [
        //       {
        //         $match: {
        //           $expr: {
        //             $and: [
        //               { $eq: ["$user", "$$userId"] },
        //               { $eq: ["$isApprove", true] },
        //             ],
        //           },
        //         },
        //       },
        //       {
        //         $lookup: {
        //           from: "cartypes",
        //           let: { carTypeId: "$carType" },
        //           pipeline: [
        //             {
        //               $match: {
        //                 $expr: {
        //                   $and: [
        //                     { $eq: ["$_id", "$$carTypeId"] },
        //                     { $eq: ["$name", vehicle_type] },
        //                   ],
        //                 },
        //               },
        //             },
        //           ],
        //           localField: "carType",
        //           foreignField: "_id",
        //           as: "carTypesDetails",
        //         },
        //       },
        //       {
        //         $unwind: "$carTypesDetails",
        //       },
        //       {
        //         $lookup: {
        //           from: "carmakes",
        //           localField: "carMake",
        //           foreignField: "_id",
        //           as: "carMakeDetails",
        //         },
        //       },
        //       {
        //         $unwind: "$carMakeDetails",
        //       },
        //       {
        //         $lookup: {
        //           from: "carmodels",
        //           localField: "carModel",
        //           foreignField: "_id",
        //           as: "carModelDetails",
        //         },
        //       },
        //       {
        //         $unwind: "$carModelDetails",
        //       },
        //     ],
        //     as: "carDetails",
        //   },
        // },
        // {
        //   $unwind: "$carDetails",
        // },
        // {
        //   $project: {
        //     _id: 0,
        //     user_id: "$_id",
        //     vehicle_id: "$carDetails._id",
        //     seat_capacity: { $ifNull: [{ $arrayElemAt: ["$carDetails.carTypesDetails.capacity", 0] }, 0] },
        //     vehicle_type: { $arrayElemAt: ["$carDetails.carTypesDetails.name", 0] },
        //     vehicle_image: { $arrayElemAt: ["$carDetails.carTypesDetails.image", 0] },
        //     vehicle_price: { $arrayElemAt: ["$carDetails.carTypesDetails.price", 0] }, //price
        //   }
        // },
        // {
        //   $addFields: { reach_in_minutes: 9 }
        // }
      ]);
      // console.log(drivers_details);

      if (drivers_details.length > 0) {
        // const bookDetails = await Order.findOne({
        //   customer: req.user.id,
        //   rideType: req.body.rideType,
        //   status: "InProgress",
        // });
        const bookingId = await Common.generateOrderID();
        const Data = {
          crnNumber: "CRN" + bookingId,
          perMileAmount: req.body.perMileAmount,
          carType: req.body.carType,
          seatCapacity: req.body.seatCapacity,
          customer: req.user.id,
          amount: req.body.total_amount,
          pickupAddress: req.body.pickup_address,
          destinationAddress: req.body.destination_address,
          pickupLatitude: req.body.pickup_lat,
          pickupLongitude: req.body.pickup_long,
          destinationLatitude: req.body.destination_lat,
          destinationLongitude: req.body.destination_long,
          rideType: req.body.rideType,
          date: req.body.booking_date,
          driver_gender: req.body.driver_gender,
          pickupLocation: {
            type: "Point",
            coordinates: [
              parseFloat(req.body.pickup_long),
              parseFloat(req.body.pickup_lat),
            ],
          },
          dropLocation: {
            type: "Point",
            coordinates: [
              parseFloat(req.body.destination_long),
              parseFloat(req.body.destination_lat),
            ],
          },
          isSelf: req.body.isSelf,
          otherPersonContactNumber: req.body.otherPersonContactNumber,
          otherPersonName: req.body.otherPersonName,
          dateTimeStamp: req.body.dateTimeStamp,
          promoCode: req.body.couponCode,
        };
        if (
          req.body.book_for_self == false ||
          req.body.book_for_self == "false"
        ) {
          Data["book_for_self"] = false;
          Data["another_user_mobile"] = req.body.mobile;
          Data["another_user_name"] = req.body.user_name;
        }
        await new Order(Data).save();
        // if (!bookDetails) {
        //   // Booking
        //   await new Order(Data).save();
        // }
        // else {
        //   await Order.updateOne({ _id: bookDetails.id }, Data);
        // }

        return _RS.ok(
          res,
          "Success",
          "Searching Ride",
          drivers_details,
          startTime
        );
      }

      return _RS.notFound(
        res,
        "Success",
        "Driver not found around you. please try again",
        drivers_details,
        startTime
      );
    } catch (error) {
      next(error);
    }
  }

  static async addUserRating(req, res, next) {
    try {
      const from_user_id = req.user.id;
      const {
        to_user_id,
        booking_id,
        rideId,
        rating_type,
        rating,
        description,
      } = req.body;
      const found = await Ratings.findOne({
        booking_id,
        rideId,
        from_user_id,
      });
      if (found) {
        return _RS.ok(res, "Error", "Ratings already exist", {}, startTime);
      }
      let booking = await Order.findOne({ _id: rideId });
      console.log(booking, "booking");
      if (req.user.type == "Driver") {
        booking.customer_rating = rating;
      } else {
        booking.driver_rating = rating;
      }
      booking.save();

      const rating_data = {
        from_user_id,
        to_user_id,
        booking_id,
        rideId,
        rating_type,
        rating,
        description,
      };
      await new Ratings(rating_data).save();
      return _RS.ok(res, "Success", "Thanks for Rating", {}, startTime);
    } catch (error) {
      next(error);
    }
  }

  static async getdriverDetailsByDriverId(req, res, next) {
    try {
      const driver_id = req.query.driver_id;

      const driverDetails = await UserCar.aggregate([
        {
          $match: { user: new ObjectID(driver_id) },
        },
        {
          $limit: 1,
        },
        {
          $lookup: {
            from: "carmakes",
            localField: "carMake",
            foreignField: "_id",
            as: "carMakeDetails",
          },
        },
        {
          $unwind: "$carMakeDetails",
        },

        {
          $lookup: {
            from: "carmodels",
            localField: "carModel",
            foreignField: "_id",
            as: "carModelDetails",
          },
        },
        {
          $unwind: "$carModelDetails",
        },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $unwind: "$userDetails",
        },
        // {
        //   $lookup: {
        //     from: "user",
        //     localField: "user",
        //     foreignField: "_id",
        //     as: "userDetails"
        //   }
        // },
        // {
        //   $unwind: "$userDetails"
        // },
        // {
        //   $lookup: {
        //     from: "ratings",
        //     localField: "user",
        //     foreignField: "to_user_id",
        //     as: "ratingDetails"
        //   }
        // },
        {
          $project: {
            driverId: "$userDetails._id",
            name: "$userDetails.name",
            email: "$userDetails.email",
            image: "$userDetails.profileImage",
            address: "Mansarover",
            longitude: "$userDetails.longitude",
            latitude: "$userDetails.latitude",
            isVerify: "$userDetails.isVerify",
            contact: "$userDetails.mobileNumber",
            about: "dfdfdfgdff",
            carDetails: {
              carModel: "$carModelDetails.name",
              carNumber: "$carNumber",
              carColor: "$carColor",
            },
            review: [
              {
                userName: "Parveen",
                user_image: "null",
                rating: "4",
                is_verify: "true",
                description: "tfyfbvbv",
                review_date: new Date(),
              },
            ],
          },
        },
        {
          $addFields: {
            avg_rating: 4.9,
            total_review: 2034,
            total_exp: 10,
            total_customer_ride: 5000,
          },
        },
      ]);

      console.log(driverDetails);

      return _RS.ok(
        res,
        "Success",
        "Driver Details",
        driverDetails[0],
        startTime
      );
    } catch (error) {
      next(error);
    }
  }

  static async rideAcceptDecine(req, res, next) {
    try {
      const acceptRide = await RideCancelHistory.findOne({
        booking_id: req.body.booking_id,
      });

      if (acceptRide) {
        if (acceptRide.type == "Accept") {
          return _RS.ok(
            res,
            "Success",
            "Sorry ride can be accepted by another driver before you",
            {},
            startTime
          );
        } else if (acceptRide.action_by == req.user.id) {
          return _RS.ok(
            res,
            "Success",
            "Sorry already action by you",
            {},
            startTime
          );
        }
      }
      const data = {
        booking_id: req.body.booking_id,
        type: req.body.type,
        action_by: req.user.id,
        action_to: req.body.userId,
        action_type: req.user.type,
        description: req.body.description,
      };

      await new RideCancelHistory(data).save();
      if (req.body.type == "Accept") {
        const bookingDetails = await Booking.findById({
          _id: req.body.booking_id,
        }).populate("customer");
        if (bookingDetails) {
          console.log(
            "========",
            bookingDetails.book_for_self
              ? bookingDetails.customer.name
              : bookingDetails.another_user_name,
            bookingDetails.book_for_self
          );

          const rideData = {
            customerName: bookingDetails.book_for_self
              ? bookingDetails.customer.name
              : bookingDetails.another_user_name,
            customerPhoneNumber: bookingDetails.book_for_self
              ? bookingDetails.customer.mobileNumber
              : bookingDetails.another_user_mobile,
            customerCountryCode: bookingDetails.customer.countryCode,
            // amount: req.body.total_amount,
            pickupAddress: bookingDetails.pickupAddress,
            destinationAddress: bookingDetails.destinationAddress,
            pickupLatitude: bookingDetails.pickupLatitude,
            pickupLongitude: bookingDetails.pickupLongitude,
            destinationLatitude: bookingDetails.destinationLatitude,
            destinationLongitude: bookingDetails.destinationLongitude,
            rideType: bookingDetails.rideType,
            // date: req.body.booking_date,
            // driver_gender: req.body.driver_gender,
            vehicle_id: req.body.vehicle_id,
            pickupLocation: {
              type: "Point",
              coordinates: [
                Number(bookingDetails.pickupLongitude),
                Number(bookingDetails.pickupLatitude),
              ],
            },
            dropLocation: {
              type: "Point",
              coordinates: [
                Number(bookingDetails.destinationLongitude),
                Number(bookingDetails.destinationLatitude),
              ],
            },
          };
          // if (req.body.book_for_self == false || req.body.book_for_self == "false") {
          //   Data["book_for_self"] = false;
          //   Data["another_user_mobile"] = req.body.mobile;
          //   Data["another_user_name"] = req.body.user_name;
          // }

          // console.log(data);

          const rideDetails = await new Rides(rideData).save();
          // const memberSocket = socketObj.sockets[req.body.booking_id] || null;
          // if (memberSocket) {
          ClientSocket.connect(
            {
              status: 201,
              message: "Ride accepted",
              data: {
                driver_id: req.user.id,
                booking_id: bookingDetails._id,
                ride_id: rideDetails._id,
              },
            },
            "acceptRide"
          );
          // memberSocket.emit("acceptRide", );
          // }
        }
      }
      return _RS.ok(
        res,
        "Success",
        `Ride ${req.body.type} SuccessFully`,
        {},
        startTime
      );
    } catch (error) {
      next(error);
    }
  }
  static async dashBoardData(req, res, next) {
    try {
      const getTodayEarning = await Order.aggregate([
        [
          {
            $match: {
              driver: new mongoose.Types.ObjectId(req.user.id),
            },
          },
          {
            $group: {
              _id: {
                year: {
                  $year: "$created_at",
                },
                month: {
                  $month: "$created_at",
                },
                day: {
                  $dayOfMonth: "$created_at",
                },
              },
              totalAmount: {
                $sum: "$totalAmount",
              },
            },
          },
          {
            $sort: {
              _id: -1,
            },
          },
          {
            $limit: 1,
          },
        ],
      ]);

      console.log(getTodayEarning, "getTodayEarning");

      const totalAmount =
        getTodayEarning[0] &&
        getTodayEarning.length > 0 &&
        getTodayEarning[0].totalAmount > 0
          ? (getTodayEarning[0].totalAmount * 80) / 100
          : 0;
      return _RS.ok(
        res,
        "Success",
        `Dashboard Data`,
        { todayEarn: totalAmount },
        startTime
      );
    } catch (error) {
      next(error);
    }
  }

  static async verifyOtpPhoneOrEmail(req, res, next) {
    const { mobileNumber, otp, countryCode, email, type } = req.body;
    const currentTime = new Date();
    try {
      if (type == "phone") {
        let doc = await User.findOne({
          _id: req.user._id,
        });

        if (!doc) {
          return _RS.notFound(
            res,
            "NOTFOUND",
            "User not found",
            {},
            new Date().getTime()
          );
        }

        // if (doc["_doc"].otp != parseInt(otp)) {
        //   return _RS.badRequest(
        //     res,
        //     "BADREQUEST",
        //     "Invalid OTP",
        //     {},
        //     new Date().getTime()
        //   );
        // }
        if (doc.otp != otp) {
          return _RS.badRequest(
            res,
            "BADREQUEST",
            "Invalid OTP",
            {},
            new Date().getTime()
          );
        }
        doc.otp = null;
        (doc.mobileNumber = mobileNumber),
          (doc.countryCode = countryCode),
          // doc.otp_expiry_time = null;
          doc.save();
        return _RS.ok(
          res,
          "SUCCESS",
          "OTP Verified Successfully",
          {},
          new Date().getTime()
        );
      } else {
        let doc = await User.findOne({
          _id: req.user._id,
        });

        if (!doc) {
          return _RS.notFound(
            res,
            "NOTFOUND",
            "User not found",
            {},
            new Date().getTime()
          );
        }

        if (doc["_doc"].otp != parseInt(otp)) {
          return _RS.badRequest(
            res,
            "BADREQUEST",
            "Invalid OTP",
            {},
            new Date().getTime()
          );
        }
        doc.otp = null;
        (doc.email = email),
          // doc.otp_expiry_time = null;
          doc.save();
        return _RS.ok(
          res,
          "SUCCESS",
          "OTP Verified Successfully",
          {},
          new Date().getTime()
        );
      }
    } catch (error) {
      next(error);
    }
  }
  static async updatePhoneOrEmail(req, res, next) {
    const { mobileNumber, countryCode, type, email, appSignatureId } = req.body;
    const currentTime = new Date();
    try {
      if (type == "phone") {
        let doc = await User.findOne({
          mobileNumber: mobileNumber,
          countryCode: countryCode,
          isActive: true,
          isDeleted: false,
          _id: { $ne: req.user._id },
        });

        if (doc) {
          return _RS.notFound(
            res,
            "NOTFOUND",
            "Phone number already exists",
            {},
            new Date().getTime()
          );
        }

        let contactNumber = `${countryCode}${mobileNumber}`;
        let otp = await Auth.generateOtp();
        let user = await User.findOne({ _id: req.user._id });
        user.otp = otp.otp;
        user.save();
        // let payload = `Hello User, here is your OTP to signing up: ${otp.otp}. Please Do not share this with others. Best Regards, Cherlish.`;
        let payload = `<#> DO NOT SHARE: ${
          otp.otp
        } is the ACCOUNT PASSWORD for your Cherlish account. Keep this OTP to yourself for account safety.${
          appSignatureId ? appSignatureId : "WO7GgS0MBIP"
        }`;
        await sendSMS(contactNumber, payload);

        return _RS.ok(
          res,
          "SUCCESS",
          "OTP Sent Successfully",
          {},
          new Date().getTime()
        );
      } else {
        let doc = await User.findOne({
          email: email,
          isActive: true,
          isDeleted: false,
          _id: { $ne: req.user.id },
        });

        if (doc) {
          return _RS.notFound(
            res,
            "NOTFOUND",
            "Email already exists",
            {},
            new Date().getTime()
          );
        }

        let emailId = `${email}`;
        let otp = await Auth.generateOtp();
        let user = await User.findOne({ _id: req.user._id });
        user.otp = otp.otp;
        user.save();

        await MailHelper.sendOTPONEMail(otp?.otp, emailId);

        // await sendSMS(contactNumber, payload);

        return _RS.ok(
          res,
          "SUCCESS",
          "OTP Sent Successfully ",
          {},
          new Date().getTime()
        );
      }
    } catch (error) {
      next(error);
    }
  }
}
