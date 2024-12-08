import _RS from "../helpers/ResponseHelper";
import Auth from "../Utils/Auth";
import User from "../models/User";
import Admin from "../models/Admin";

// import Admin from "../models/adminModel"
class Authentication {
  constructor() {}

  static async user(req, res, next) {
    // console.log(req.headers.cookie,"req.cookie.access_token")
    const startTime = new Date().getTime();
    try {
      let token;
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        token = req.headers.authorization.split(" ")[1];
      }
      // if (
      //   req.headers.cookie &&
      //   req.headers.cookie.startsWith("token=")
      // ) {
      //   token = req.headers.cookie.split("token=")[1];
      // }

      if (!token) {
        return _RS.unAuthenticated(
          res,
          "UNAUTHORIZE",
          "UNAUTHORIZE",
          {},
          startTime,
          0
        );
      }

      const decoded: any = await Auth.decodeJwt(token);
      const currentUser = await User.findById(decoded._id);

      // console.log(decoded, "decoded");
      if (!currentUser) {
        return _RS.notFound(
          res,
          "NOTFOUND",
          "User not exist",
          currentUser,
          startTime
        );
      }
      if (!currentUser.is_active) {
        return _RS.unAuthorize(
          res,
          "FORBIDDEN",
          "Account Deactivated Please contact to admin",
          {},
          startTime
        );
      }
      if (currentUser.is_deleted) {
        return _RS.unAuthorize(
          res,
          "FORBIDDEN",
          "Account Delete Please Use another email",
          {},
          startTime
        );
      }
      req.user = currentUser;
      req.user.id = decoded.id;
      next();
    } catch (err) {
      return next(err);
    }
  }
  static async admin(req, res, next) {
    // console.log(req.headers.cookie,"req.cookie.access_token")
    const startTime = new Date().getTime();
    try {
      let token;
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        token = req.headers.authorization.split(" ")[1];
      }
      if (!token) {
        return _RS.unAuthenticated(
          res,
          "UNAUTHORIZE",
          "UNAUTHORIZE",
          {},
          startTime,
          0
        );
      }

      const decoded: any = await Auth.decodeJwt(token);

      const currentUser = await Admin.findById(decoded.id);

      if (!currentUser) {
        return _RS.notFound(
          res,
          "NOTFOUND",
          "User not exist",
          currentUser,
          startTime
        );
      }

      req.user = currentUser;
      req.user.id = decoded.id;
      next();
    } catch (err) {
      return next(err);
    }
  }
}

export default Authentication;
