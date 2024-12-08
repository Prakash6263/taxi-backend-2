// import { validate } from "../../helpers/ValidationHelper";
import * as Joi from "joi";
import { NextFunction } from "express";
// import { ReqInterface, ResInterface } from "../../interfaces/RequestInterface"
// import _RS from "../../helpers/ResponseHelper"
import { validate } from "../../helpers/ValidationHelper";
import { ReqInterface, ResInterface } from "../../interfaces/RequestInterface";
enum UserTypeRole {
  Expact = "Expact",
  Psychologist = "Psychologist",
}
enum LoginTypeRole {
  Email = "Email",
  Google = "Google",
  Facebook = "Facebook",
  Apple = "Apple",
}
class AuthValidation {
  static async loginValidation(
    req: ReqInterface,
    res: ResInterface,
    next: NextFunction
  ) {
    const schema = Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      type: Joi.string().required(),
      deviceToken: Joi.string().optional().allow("", null),
      voipToken: Joi.string().optional().allow("", null),
      deviceType: Joi.string().optional().allow("", null),
      IdAddress: Joi.string().optional().allow("", null),
      geoLocation: Joi.string().optional().allow("", null),
      latitude: Joi.number().optional().allow("", null),
      longitude: Joi.number().optional().allow("", null),
    });
    const isValid = await validate(req.body, res, schema);
    if (isValid) {
      next();
    }
  }
  static async signUpValidation(
    req: ReqInterface,
    res: ResInterface,
    next: NextFunction
  ) {
    const schema = Joi.object().keys({
      email: Joi.string().required().email(),
      // password: Joi.string().regex(strongPasswordRegex).error(stringPassswordError).required(),
      password: Joi.string().required().messages({
        "string.empty": `Password cannot be empty`,
        "any.required": `Password is required`,
      }),
      name: Joi.string().required(),
      type: Joi.string().required(),
      loginType: Joi.string().required(),
      deviceToken: Joi.string().optional().allow("", null),
      deviceType: Joi.string().optional().allow("", null),
      voipToken: Joi.string().optional().allow("", null),
      latitude: Joi.number().optional().allow("", null),
      longitude: Joi.number().optional().allow("", null),
    });
    const isValid = await validate(req.body, res, schema);
    if (isValid) {
      next();
    }
  }
  static async socialSignUpValidation(
    req: ReqInterface,
    res: ResInterface,
    next: NextFunction
  ) {
    const schema = Joi.object().keys({
      email: Joi.string().optional().email().allow("", null),
      name: Joi.string().optional().allow("", null),
      type: Joi.string().required(),
      profileImage: Joi.string().optional().allow("", null),
      loginType: Joi.string().required(),
      deviceToken: Joi.string().optional().allow("", null),
      socialId: Joi.string().required().allow("", null),
      voipToken: Joi.string().optional().allow("", null),
      geoLocation: Joi.string().optional().allow("", null),
      IdAddress: Joi.string().optional().allow("", null),
      deviceType: Joi.string().optional().allow("", null),
      latitude: Joi.number().optional().allow("", null),
      longitude: Joi.number().optional().allow("", null),
    });
    const isValid = await validate(req.body, res, schema);
    if (isValid) {
      next();
    }
  }
  static async resendOtpValidation(
    req: ReqInterface,
    res: ResInterface,
    next: NextFunction
  ) {
    const schema = Joi.object().keys({
      email: Joi.string().required(),
      type: Joi.string().required(),
    });
    const isValid = await validate(req.body, res, schema);
    if (isValid) {
      next();
    }
  }

  static async profileValidation(
    req: ReqInterface,
    res: ResInterface,
    next: NextFunction
  ) {
    const schema = Joi.object().keys({
      name: Joi.string().required(),
      phoneNumber: Joi.string()
        .required()
        .pattern(/^[0-9]+$/)
        .max(15)
        .min(9),
    });
    const isValid = await validate(req.body, res, schema);
    if (isValid) {
      next();
    }
  }
  static async forgetPasswordValidation(
    req: ReqInterface,
    res: ResInterface,
    next: NextFunction
  ) {
    const schema = Joi.object().keys({
      email: Joi.string().required().email(),
    });
    const isValid = await validate(req.body, res, schema);
    if (isValid) {
      next();
    }
  }
  static async verifyOTPValidation(
    req: ReqInterface,
    res: ResInterface,
    next: NextFunction
  ) {
    const schema = Joi.object().keys({
      email: Joi.string().required().email(),
      otp: Joi.string().required(),
    });
    const isValid = await validate(req.body, res, schema);
    if (isValid) {
      next();
    }
  }
  static async resetPasswordValidation(
    req: ReqInterface,
    res: ResInterface,
    next: NextFunction
  ) {
    const schema = Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    });
    const isValid = await validate(req.body, res, schema);
    if (isValid) {
      next();
    }
  }
}

export default AuthValidation;
