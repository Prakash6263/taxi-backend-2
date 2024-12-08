import User from "../../models/User";
import _RS from "../../helpers/ResponseHelper";
import { date } from "joi";
import Subscription from "../../models/Subscription";
import { env } from "../../environments/Env";
const express = require("express");
export class SubscriptionController {
  static async list(req, res, next) {
    try {
      const startTime = new Date().getTime();
      const list = await Subscription.find({}).sort({
        created_at: -1,
      });
      return _RS.ok(res, "SUCCESS", "List", { list: list }, startTime);
    } catch (err) {
      next(err);
    }
  }
  static async addSubscription(req, res, next) {
    try {
      const startTime = new Date().getTime();
      const {
        dueDate,
        cancellationDate,
        type,
        price,
        session,
        validMonth,
        language,
        benefitsList,
        month,
      } = req.body;
      const getSubscription = await Subscription.findOne({
        type: type,
        is_active: true,
      });
      if (getSubscription)
        return _RS.conflict(
          res,
          "COFLICT",
          "Subscription already exist with this type",
          getSubscription,
          startTime
        );
      const data = {
        dueDate,
        cancellationDate,
        type,
        price,
        session,
        validMonth,
        language,
        totalPrice: price * session,
        benefits: benefitsList,
        month: month,
      };
      const user = await new Subscription(data).save();
      return _RS.created(res, "SUCCESS", "Add Subscription Successfully", user);
      // return _RS.ok(res, "SUCCESS", "List", { list: list }, startTime);
    } catch (err) {
      next(err);
    }
  }
  static async editSubscription(req, res, next) {
    try {
      const startTime = new Date().getTime();
      const {
        dueDate,
        cancellationDate,
        type,
        price,
        session,
        validMonth,
        language,
        benefitsList,
        month,
      } = req.body;
      const getSubscription = await Subscription.findOne({
        _id: req.params.id,
      });
      if (!getSubscription)
        return _RS.notFound(
          res,
          "NOTFOUND",
          "Subscription not found",
          getSubscription,
          startTime
        );
      const isCHeck = await Subscription.findOne({
        type: type,
        is_active: true,
        _id: { $ne: req.params.id },
      });
      if (isCHeck)
        return _RS.conflict(
          res,
          "COFLICT",
          "Subscription already exist with this type",
          isCHeck,
          startTime
        );

      (getSubscription.dueDate = dueDate ? dueDate : getSubscription.dueDate),
        (getSubscription.cancellationDate = cancellationDate
          ? cancellationDate
          : getSubscription.cancellationDate),
        (getSubscription.type = type ? type : getSubscription.type),
        (getSubscription.price = price ? price : getSubscription.price),
        (getSubscription.session = session ? session : getSubscription.session),
        (getSubscription.validMonth = validMonth
          ? validMonth
          : getSubscription.validMonth),
        (getSubscription.session = session ? session : getSubscription.session),
        (getSubscription.language = language
          ? language
          : getSubscription.language);
      getSubscription.month = month ? month : getSubscription.month;
      (getSubscription.totalPrice =
        getSubscription.price * getSubscription.session),
        (getSubscription.benefits = benefitsList ? benefitsList : []);
      getSubscription.save();

      return _RS.ok(
        res,
        "SUCCESS",
        "Update Subscription Successfully",
        getSubscription,
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
      const getSubscription = await Subscription.findOne({
        _id: req.params.id,
      });
      if (!getSubscription)
        return _RS.notFound(
          res,
          "NOTFOUND",
          "Subscription not found",
          getSubscription,
          startTime
        );

      const checkSunscriptionExists = await Subscription.findOne({
        type: getSubscription.type,
        is_active: true,
        _id: { $ne: getSubscription._id },
      });

      if (checkSunscriptionExists) {
        return _RS.ok(
          res,
          "SUCCESS",
          "Status not change because already created this type of plan",
          getSubscription,
          startTime
        );
      }
      (getSubscription.is_active = !getSubscription.is_active),
        getSubscription.save();

      return _RS.ok(
        res,
        "SUCCESS",
        "Status Change Successfully",
        getSubscription,
        startTime
      );
      // return _RS.ok(res, "SUCCESS", "List", { list: list }, startTime);
    } catch (err) {
      next(err);
    }
  }
  static async viewSubscription(req, res, next) {
    try {
      const startTime = new Date().getTime();
      const id = req.params.id;
      const getExpact = await Subscription.findOne({
        _id: req.params.id,
      }).populate("therapists psychologistLanguage languageId areaOfExperties");
      if (!getExpact)
        return _RS.notFound(
          res,
          "NOTFOUND",
          "Expact not found",
          getExpact,
          startTime
        );

      return _RS.ok(
        res,
        "SUCCESS",
        "Status Change Successfully",
        getExpact,
        startTime
      );
      // return _RS.ok(res, "SUCCESS", "List", { list: list }, startTime);
    } catch (err) {
      next(err);
    }
  }
}
