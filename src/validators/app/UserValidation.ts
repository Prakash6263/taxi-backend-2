// import { validate } from "../../helpers/ValidationHelper";
import * as Joi from "joi";
import { NextFunction } from "express";
// import { ReqInterface, ResInterface } from "../../interfaces/RequestInterface"
// import _RS from "../../helpers/ResponseHelper"
import { validate } from "../../helpers/ValidationHelper";
import { ReqInterface, ResInterface } from "../../interfaces/RequestInterface";

class UserValidation {
  static async applyDiscount(
    req: ReqInterface,
    res: ResInterface,
    next: NextFunction
  ) {
    const schema = Joi.object().keys({
      subscription: Joi.string().required(),
      promoCode: Joi.string().required(),
    });
    const isValid = await validate(req.body, res, schema);
    if (isValid) {
      next();
    }
  }
  static async payNow(
    req: ReqInterface,
    res: ResInterface,
    next: NextFunction
  ) {
    const schema = Joi.object().keys({
      subscription: Joi.string().required(),
      promoCode: Joi.string().optional().allow("", null),
      totalAmount: Joi.number().precision(2).required(),
      amount: Joi.number().precision(2).required(),
      discountAmount: Joi.number().precision(2).optional().allow("", null),
      paymentId: Joi.string().required(),
    });
    const isValid = await validate(req.body, res, schema);
    if (isValid) {
      next();
    }
  }
  static async bookingSession(
    req: ReqInterface,
    res: ResInterface,
    next: NextFunction
  ) {
    const schema = Joi.object().keys({
      day: Joi.string().required(),
      to: Joi.string().required(),
      from: Joi.string().required(),
      date: Joi.date().required(),
      type: Joi.string().required(),
    });
    const isValid = await validate(req.body, res, schema);
    if (isValid) {
      next();
    }
  }
  static async rescheduleSession(
    req: ReqInterface,
    res: ResInterface,
    next: NextFunction
  ) {
    const schema = Joi.object().keys({
      day: Joi.string().required(),
      to: Joi.string().required(),
      from: Joi.string().required(),
      date: Joi.date().required(),
      type: Joi.string().required(),
      sessionId: Joi.string().required(),
    });
    const isValid = await validate(req.body, res, schema);
    if (isValid) {
      next();
    }
  }
  static async rating(
    req: ReqInterface,
    res: ResInterface,
    next: NextFunction
  ) {
    const schema = Joi.object().keys({
      session: Joi.string().required(),
      rating: Joi.number().required(),
      review: Joi.string().optional().allow("", null),
    });
    const isValid = await validate(req.body, res, schema);
    if (isValid) {
      next();
    }
  }
  static async report(
    req: ReqInterface,
    res: ResInterface,
    next: NextFunction
  ) {
    const schema = Joi.object().keys({
      subject: Joi.string().required(),
      description: Joi.string().optional().allow("", null),
    });
    const isValid = await validate(req.body, res, schema);
    if (isValid) {
      next();
    }
  }
}

export default UserValidation;
