import { Router } from "express";
import AuthValidation from "../../validators/app/AuthValidation";
import { AuthController } from "../../controllers/User/AuthController";
import Authentication from "../../Middlewares/Authnetication";
import { UserController } from "../../controllers/Admin/UserController";

class AuthRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.post();
    this.get();
  }

  public post() {
    this.router.post(
      "/login",
      AuthValidation.loginValidation,
      AuthController.login
    );
    this.router.post(
      "/login-new",
      // AuthValidation.loginValidation,
      AuthController.loginNew
    );
    this.router.post(
      "/sign-up",
      AuthValidation.signUpValidation,
      AuthController.signUp
    );
    this.router.post(
      "/forget-password",
      AuthValidation.forgetPasswordValidation,
      AuthController.forgetpassword
    );
    this.router.post(
      "/reset-password",
      AuthValidation.resetPasswordValidation,
      AuthController.resetPassword
    );
    this.router.post(
      "/forget-password-new",
      // AuthValidation.forgetPasswordValidation,
      AuthController.forgetpasswordNew
    );
    this.router.post(
      "/reset-password-new",
      // AuthValidation.resetPasswordValidation,
      AuthController.resetPasswordNew
    );
    this.router.post(
      "/verify-otp",
      AuthValidation.verifyOTPValidation,
      AuthController.verifyOTP
    );
    this.router.post(
      "/verify-otp-new",
      // AuthValidation.verifyOTPValidation,
      AuthController.verifyOTPNew
    );
    this.router.post(
      "/sign-up-new",
      // AuthValidation.signUpValidation,
      AuthController.signUpNew
    );
    this.router.post(
      "/verify-otp-authenticate",
      AuthValidation.verifyOTPValidation,
      AuthController.verifyOTPForAutentication
    );
    this.router.post(
      "/verify-otp-authenticate-new",
      // AuthValidation.verifyOTPValidation,
      AuthController.verifyOTPForAutenticationNew
    );
    this.router.post(
      "/social-signup",
      AuthValidation.socialSignUpValidation,
      AuthController.socialSignUp
    );
    this.router.post(
      "/resend-otp",
      AuthValidation.resendOtpValidation,
      AuthController.resendOtp
    );
    this.router.post(
      "/resend-otp-new",
      // AuthValidation.resendOtpValidation,
      AuthController.resendOtpNew
    );
  }
  public get() {
    this.router.get("/logout", Authentication.user, AuthController.logout);
  }
}

export default new AuthRoutes().router;
