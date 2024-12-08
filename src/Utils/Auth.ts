import * as Bcrypt from "bcrypt";
import * as Jwt from "jsonwebtoken";
import path = require("path");

class Auth {
  constructor() {}
  public MAX_TOKEN_TIME = 600000;
  async generateOtp(size: number = 4) {
    const currentTime = new Date().getTime();
    const next10min = currentTime + 10 * 60 * 1000;
    const otpExpiresTime = new Date(next10min);

    let otp = "";
    let val;
    val = Math.floor(1000 + Math.random() * 9000);
    val = String(val);
    otp = val.substring(0, 4);

    const otpData = {
      otp: parseInt(otp),
      otpExpiresTime: otpExpiresTime,
    };

    return otpData;
  }

  async decodeJwt(token) {
    return new Promise((resolve, reject) => {
      Jwt.verify(token, process.env.JWT_SECRET || 'taxi', (err, data) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(data);
        }
      });
    });
  }

  async getToken(data, expiresIn, next) {
    try {
      return Jwt.sign(data, process.env.JWT_SECRET || 'taxi', {
        expiresIn,
      });
    } catch (err) {
      return next(err);
    }
  }

  async dateDiffInDays(date1, date2) {
    // Convert the dates to Date objects
    const date1Obj: any = new Date(date1);
    const date2Obj: any = new Date(date2);

    // Calculate the difference in milliseconds
    const diffInMs = Math.abs(date2Obj - date1Obj);

    // Calculate the difference in days
    const msPerDay = 24 * 60 * 60 * 1000;
    const diffInDays = Math.floor(diffInMs / msPerDay);

    return diffInDays;
  }
  async comparePassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      Bcrypt.compare(candidatePassword, userPassword, (err, isSame) => {
        if (err) {
          reject(err);
        } else if (!isSame) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  async encryptPassword(password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      Bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          reject(err);
        } else {
          resolve(hash);
        }
      });
    });
  }
}
let respObj = new Auth();
export default respObj;
