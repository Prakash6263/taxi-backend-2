// import { validate } from "../../helpers/ValidationHelper";
import * as Joi from "joi";
import { NextFunction } from "express";
// import { ReqInterface, ResInterface } from "../../interfaces/RequestInterface"
// import _RS from "../../helpers/ResponseHelper"
import { validate } from "../helpers/ValidationHelper";
import { ReqInterface, ResInterface } from "../interfaces/RequestInterface";
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
      type: Joi.string()
        .required()
        .validate([UserTypeRole.Expact, UserTypeRole.Psychologist]),
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
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required()
        .messages({
          "string.pattern.base": `Password should be between 3 to 30 characters and contain letters or numbers only`,
          "string.empty": `Password cannot be empty`,
          "any.required": `Password is required`,
        }),
      userName: Joi.string().required(),
      type: Joi.string()
        .required()
        .validate([UserTypeRole.Expact, UserTypeRole.Psychologist]),
      loginType: Joi.string()
        .required()
        .validate([
          LoginTypeRole.Email,
          LoginTypeRole.Facebook,
          LoginTypeRole.Apple,
          LoginTypeRole.Google,
        ]),
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
}

export default AuthValidation;
