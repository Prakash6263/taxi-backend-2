import Admin from "../models/Admin";
import User from "../models/User";
const nodemailer = require("nodemailer");
import moment = require("moment");

export class MailHelper {
  constructor() {}
  static async sendMail(userId, subject) {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });
    let mailOptions;
    let userData = await Admin.findOne({ _id: userId });
    let htmlContent = `<!DOCTYPE html>
<html lang="en">
<body style="margin:0">
<link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet"> 
<table style="border-collapse: collapse;padding: 0;margin: 0px auto;text-align: center;font-size: 17px;font-family: 'Poppins', sans-serif;
" width="600px" bgcolor="#f7f7f7">
  <thead>
    <tr>
      <td style="padding: 15px 30px 10px;">
        <a href="#"><img style="max-width: 270px;" src="http://13.50.11.124:5353/img/logo.png"></a>
      </td>
    </tr>
  </thead>
  <tbody style="background: #fff;">
    <tr>
      <td style="padding: 50px 30px;border: solid 1px #f7f7f7;">
        <img src="http://13.50.11.124:5353/img/lock.png" style="max-width: 150px;">

        <h3 style="margin: 30px auto 15px;font-size: 38px;text-transform: uppercase;color: #383838;max-width: 70%;font-weight: 900;line-height: 1.2;">Forgot your Password!</h3>
        <p style="font-size: 26px;margin-bottom: 0;line-height: 1.5;font-weight: bold;">Hello ${
          userData ? userData.name : ""
        },</p>
        <p style="margin-top: 10px;line-height: 1.5;">There was a request to change your password!</p>
        <a href="#" style="background: linear-gradient(to left, #eba35a, #185250 );color: #fff;text-decoration: none;text-transform: uppercase;padding: 20px 50px;border-radius: 5px;margin-top: 10px;display: inline-block;font-weight: 600;letter-spacing: 1px;font-size: 20px;">${
          userData ? userData.verification_code : ""
        }</a>
      </td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td style="padding: 30px;font-size: 14px;">Copyright © 2024 Taxi. All rights reserved.</td>
    </tr>
  </tfoot>
</table>
</body>


</html>


`;

    mailOptions = {
      from: process.env.MAIL_USERNAME,
      to: userData.email,
      subject: subject,
      html: htmlContent,
    };
    // Send the email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  }
  static async sendMailUser(userId, subject, password) {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });
    // Set up the email data
    let mailOptions;
    let userData = await User.findOne({ _id: userId });

    ///Add header footer into email html
    let htmlContent = `<!DOCTYPE>
<html>

<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
</head>
<body style="box-sizing: border-box; position: relative; -webkit-text-size-adjust: none; background-color: #ffffff; color: #000000; line-height: 1.4; margin: 0; padding: 0; width: 100% !important;">

    <table class="wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing: border-box; font-family: 'Poppins', sans-serif; margin: 0; padding: 0; width: 100%;">
        <tr>
            <td align="center" style="box-sizing: border-box; font-family: 'Poppins', sans-serif; position: relative;">
                <table class="content" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing: border-box; font-family: 'Poppins', sans-serif; position: relative; margin: 0; padding: 0; width: 100%;">
                    <thead>                        
                        <tr>
                            <td>
                                <table class="inner-body" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing: border-box;position: relative; -premailer-cellpadding: 0; -premailer-cellspacing: 0; -premailer-width: 570px; background-color: #f7f7f7;  margin: 0 auto; padding: 0; width: 570px;">
                                    <!-- Body content -->
                                    <tr>
                                        <td style="text-align: center;box-sizing: border-box;padding: 20px 25px;">
                                            <a href="#">
                                            <img src="http://13.50.11.124:5353/img/logo.png" class="logo" alt="Logo" style="box-sizing: border-box;position: relative;border: none;max-height: 145px;max-width: 220px;">
                                </a>
                                        </td>
                                    </tr>
                                </table>
                                
                            </td>
                        </tr>
                    </thead>

                    <!-- Email Body -->
                    <tbody>
                        <tr>
                            <td class="body" width="100%" cellpadding="0" cellspacing="0" style="box-sizing: border-box;position: relative;  margin: 0; padding: 0; width: 100%;">
                                <table class="inner-body" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing: border-box;position: relative; -premailer-cellpadding: 0; -premailer-cellspacing: 0; -premailer-width: 570px; background-color: #ffffff; margin: 0 auto; padding: 0; width: 570px;">
                                    <!-- Body content -->
                                    <tr>
                                        <td class="content-cell" style="box-sizing: border-box;position: relative; max-width: 100vw; padding: 32px; border: solid 1px #f7f7f7;">
                                            <h1 style="box-sizing: border-box;position: relative; color: #000; font-size: 22px; font-weight: bold; margin-top: 0; text-align: left;"> Hello! </h1>
                                            <p style="box-sizing: border-box;position: relative; font-size: 18px; line-height: 1.5em; margin-top: 0; text-align: left;"> Your credential details are :</p>
                                            <table class="action" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing: border-box;position: relative; margin: 30px auto; padding: 0; text-align: center; width: 100%;">
                                                <tr>
                                                    <td style="box-sizing: border-box;position: relative;">
                                                        <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing: border-box;">
                                                            <tr>
                                                                <td style="box-sizing: border-box;position: relative; padding-bottom: 15px">
                                                                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing: border-box;position: relative;">
                                                                        <tr>
                                                                            <td style="box-sizing: border-box;position: relative;  background: #f7f7f7;position: relative;padding: 15px; ">
                                                                                <h2 style="box-sizing: border-box;position: relative; color: #000; font-size: 18px; font-weight: bold; margin-bottom: 0; text-align: left; line-height: 1.5; margin-top: 0;"> <strong>User Name :</strong> <span style="font-size: 28px">${
                                                                                  userData
                                                                                    ? userData.email
                                                                                    : ""
                                                                                }</span></h2>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="box-sizing: border-box;position: relative; padding-bottom: 15px">
                                                                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing: border-box;position: relative;">
                                                                        <tr>
                                                                            <td style="box-sizing: border-box;position: relative;  background: #f7f7f7;position: relative;padding: 15px; ">
                                                                                <h2 style="box-sizing: border-box;position: relative; color: #000; font-size: 18px; font-weight: bold; margin-bottom: 0; text-align: left; line-height: 1.5; margin-top: 0;"> <strong>Password :</strong> <span style="font-size: 28px">${password}</span></h2>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                           
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                    <!-- Email Body -->
                    <tfoot>
                        <tr>
                            <td>
                                <table class="footer" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing: border-box;position: relative;  margin: 0 auto; padding: 0; text-align: center; width: 570px;background: #f7f7f7;">
                                    <tr>
                                        <td class="content-cell" align="center" style="padding: 30px;color: #000">
                                            Copyright © 2024 Taxi. All rights reserved.
                                        </td>
                                    </tr>
                               </table>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>`;

    mailOptions = {
      from: process.env.MAIL_USERNAME,
      to: userData.email,
      subject: subject,
      html: htmlContent,
    };
    // Send the email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  }

  static async sendMailUserForgot(userId, subject) {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });
    let mailOptions;
    let userData = await User.findOne({ _id: userId });
    // console.log(userData);
    let htmlContent = `<!DOCTYPE html>
<html lang="en">
<body style="margin:0">
<link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet"> 
<table style="border-collapse: collapse;padding: 0;margin: 0px auto;text-align: center;font-size: 17px;font-family: 'Poppins', sans-serif;
" width="600px" bgcolor="#f7f7f7">
  <thead>
    <tr>
      <td style="padding: 15px 30px 10px;">
        <a href="#"><img style="max-width: 270px;" src="http://153.92.4.13:5353/img/logo.png"></a>
      </td>
    </tr>
  </thead>
  <tbody style="background: #fff;">
    <tr>
      <td style="padding: 50px 30px;border: solid 1px #f7f7f7;">
        <img src="http://13.50.11.124:5353/img/lock.png" style="max-width: 150px;">

        <h3 style="margin: 30px auto 15px;font-size: 38px;text-transform: uppercase;color: #383838;max-width: 70%;font-weight: 900;line-height: 1.2;">Forgot your Password!</h3>
        <p style="font-size: 26px;margin-bottom: 0;line-height: 1.5;font-weight: bold;">Hello ${
          userData ? userData.name : ""
        },</p>
        <p style="margin-top: 10px;line-height: 1.5;">There was a request to change your password!</p>
        <a href="#" style="background: linear-gradient(to left, #eba35a, #185250 );color: #fff;text-decoration: none;text-transform: uppercase;padding: 20px 50px;border-radius: 5px;margin-top: 10px;display: inline-block;font-weight: 600;letter-spacing: 1px;font-size: 20px;">${
          userData ? userData.otp : ""
        }</a>
      </td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td style="padding: 30px;font-size: 14px;">Copyright © 2024 Taxi. All rights reserved.</td>
    </tr>
  </tfoot>
</table>
</body>


</html>


`;

    mailOptions = {
      from: process.env.MAIL_USERNAME,
      to: userData.email,
      subject: subject,
      html: htmlContent,
    };
    // Send the email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  }
  static async sendMailUserOtp(userId, subject) {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });
    let mailOptions;
    let userData = await User.findOne({ _id: userId });
    // console.log(userData);
    let htmlContent = `<!DOCTYPE html>
<html lang="en">
<body style="margin:0">
<link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet"> 
<table style="border-collapse: collapse;padding: 0;margin: 0px auto;text-align: center;font-size: 17px;font-family: 'Poppins', sans-serif;
" width="600px" bgcolor="#f7f7f7">
  <thead>
    <tr>
      <td style="padding: 15px 30px 10px;">
        <a href="#"><img style="max-width: 270px;" src="http://153.92.4.13:5353/img/logo.png"></a>
      </td>
    </tr>
  </thead>
  <tbody style="background: #fff;">
    <tr>
      <td style="padding: 50px 30px;border: solid 1px #f7f7f7;">
        <img src="http://13.50.11.124:5353/img/lock.png" style="max-width: 150px;">

        <h3 style="margin: 30px auto 15px;font-size: 38px;text-transform: uppercase;color: #383838;max-width: 70%;font-weight: 900;line-height: 1.2;">OTP!</h3>
        <p style="font-size: 26px;margin-bottom: 0;line-height: 1.5;font-weight: bold;">Hello ${
          userData ? userData.name : ""
        },</p>
        <p style="margin-top: 10px;line-height: 1.5;">There was a request to change your password!</p>
        <a href="#" style="background: linear-gradient(to left, #eba35a, #185250 );color: #fff;text-decoration: none;text-transform: uppercase;padding: 20px 50px;border-radius: 5px;margin-top: 10px;display: inline-block;font-weight: 600;letter-spacing: 1px;font-size: 20px;">${
          userData ? userData.otp : ""
        }</a>
      </td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td style="padding: 30px;font-size: 14px;">Copyright © 2024 Taxi. All rights reserved.</td>
    </tr>
  </tfoot>
</table>
</body>


</html>


`;

    mailOptions = {
      from: process.env.MAIL_USERNAME,
      to: userData.email,
      subject: subject,
      html: htmlContent,
    };
    // Send the email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  }

  static async sendVerifyMail(userId, subject) {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });
    let mailOptions;
    let userData = await User.findOne({ _id: userId });
    let htmlContent = `<!DOCTYPE html>
<html lang="en">
<body style="margin:0; background-color:#000;">
<link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet"> 
<table style="border-collapse: collapse;padding: 0;margin: 0px auto;text-align: center;font-size: 17px;font-family: 'Poppins', sans-serif;
" width="600px" bgcolor="#fff">
  <thead>
    <tr>
      <td style="padding: 15px 30px;">
        <a href="#" style="width: 100px; height: 68px; display: block; margin: auto;"><img style="width: 100%;" src="http://153.92.4.13:5353/img/logo.png"></a>
      </td>
    </tr>
  </thead>
  <tbody>
    <tr style="background: #012b28;">
      <td style="padding: 30px 30px;">
        <div class="" style="width: 100px; margin: 0 auto;">
          <img src="https://cdn.templates.unlayer.com/assets/1597218650916-xxxxc.png" style="width: 100%;">
        </div>

        <div style="margin: 8px auto; font-size: 14px; text-transform: uppercase; color: #ffffff; font-weight: 500; letter-spacing: 1px;">Verify your Email!</div>

      </td>
    </tr>
    <tr style="">
      <td style="padding: 30px 60px;">
        <div style="margin: 8px auto; font-size: 15px; color: #000; font-weight: 400;">Hii ${
          userData ? userData.name : "--"
        } ,</div>
        <div style="font-size: 14px; margin: 0; line-height: 1.5; color: #000; margin-top: 8px;">You're almost ready to get started. Please verify your email address and enjoy exclusive services with us!</div>
        <div style="margin: 24px 0;">
          <button type="button" class="" style="border-radius: 4px; padding: 12px 36px; font-size: 14px; font-weight: 600; color: #000; background-color: #ebb42c; border: none; box-shadow: none; outline: none; cursor: pointer; text-transform: uppercase;">${
            userData ? userData.otp : ""
          }</button>
        </div>
        <div style="font-size: 14px; margin: 0; line-height: 1.5; color: #000; margin-top: 8px;">Thanks, <br> The Taxi Team</div>
      </td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td style="padding: 16px 30px;font-size: 14px; background-color: #012b28; color: #fff;">Copyright © 2024 Taxi. All rights reserved.</td>
    </tr>
  </tfoot>
</table>
</body>
</html>`;

    mailOptions = {
      from: process.env.MAIL_USERNAME,
      to: userData.email,
      subject: subject,
      html: htmlContent,
    };
    // Send the email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  }

  static async sendReferalCodeMail(userId, data) {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });
    let mailOptions;
    let userData = await User.findOne({ _id: userId });
    let htmlContent = `<!DOCTYPE html>
<html lang="en">
<body style="margin:0; background-color:#000;">
<link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet"> 
<table style="border-collapse: collapse;padding: 0;margin: 0px auto;text-align: center;font-size: 17px;font-family: 'Poppins', sans-serif;
" width="600px" bgcolor="#fff">
  <thead>
    <tr>
      <td style="padding: 15px 30px;">
        <a href="#" style="width: 100px; height: 68px; display: block; margin: auto;"><img style="width: 100%;" src="http://13.50.11.124:5353/img/logo.png"></a>
      </td>
    </tr>
  </thead>
  <tbody>
    <tr style="background: #012b28;">
      <td style="padding: 30px 30px;">
        <div class="" style="width: 100px; margin: 0 auto;">
        </div>

        <div style="margin: 8px auto; font-size: 14px; text-transform: uppercase; color: #ffffff; font-weight: 500; letter-spacing: 1px;">Congrats!</div>


      </td>
    </tr>
    <tr style="">
      <td style="padding: 30px 60px;">
        <div style="margin: 8px auto; font-size: 15px; color: #000; font-weight: 400;">Hii ${
          userData ? userData.name : "--"
        } ,</div>
        <div style="font-size: 14px; margin: 0; line-height: 1.5; color: #000; margin-top: 8px;">You earned 10 euro coupon to be used in your therapy.</div>
        <div style="margin: 24px 0;">
        <p> Take your session with this Promo Code: ${data.promoCode}</p>
        </div>
        <div style="font-size: 14px; margin: 0; line-height: 1.5; color: #000; margin-top: 8px;">Thanks, <br> The Taxi Team</div>
      </td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td style="padding: 16px 30px;font-size: 14px; background-color: #012b28; color: #fff;">Copyright © 2023 Taxi. All rights reserved.</td>
    </tr>
  </tfoot>
</table>
</body>
</html>`;

    mailOptions = {
      from: process.env.MAIL_USERNAME,
      to: userData.email,
      subject: data.subject,
      html: htmlContent,
    };
    // Send the email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  }

  static async sendReportMail(data) {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });
    let mailOptions;
    let userData = await User.findOne({ _id: data.psychologist });
    let subject;
    if (userData.type == "Psychologist") {
      subject = "Report from psychologist!";
    } else if (userData.type == "Expact") {
      subject = "Report from client!";
    }
    // console.log(userData);
    let htmlContent = `<!DOCTYPE html>
    <html lang="en">
    <body style="margin:0">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet"> 
    <table style="border-collapse: collapse;padding: 0;margin: 0px auto;text-align: center;font-size: 17px;font-family: 'Poppins', sans-serif;
    " width="600px" bgcolor="#f7f7f7">
   
  <tr>
    <td style="text-align:center;margin-top:8px;padding:0 16px;">${subject}</td>
  </tr>
    <tr>
    <td style="text-align:left;padding-top:12px !important;padding:0 16px; font-weight:500;">Hello,</td>
    </tr>
    <tr>
      <td style="text-align:left;padding:0 16px;"><b>Email : </b>${
        userData ? userData.email : ""
      }</td>
    </tr>
    <tr>
      <td style="text-align:left;padding:0 16px;"><b>Subject : </b>${
        data.subject
      }</td>
    </tr>
    <tr>
      <td style="text-align:left;padding:0 16px;">
        <b>Message : </b> ${data.description}
      </td>
    </tr>
    <tr>
      <td style="text-align:left;padding:0 16px;">
        <b>Report Id : </b> ${data.reportId}
      </td>
    </tr>
    <tr>
      <td style="padding: 12px 16px;font-size: 14px; color:#fff; background:#012b28; text-align:center;">Copyright © 2023 Taxi. All rights reserved.</td>
    </tr>
    </table>
    </body>
    
    
    </html>
    
    
    `;

    mailOptions = {
      from: process.env.MAIL_USERNAME,
      to: process.env.REPORT_MAIL,
      subject: data.subject,
      html: htmlContent,
    };
    // Send the email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  }

  static async sendOTPONEMail(otp, email) {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });
    let mailOptions;

    let htmlContent = `<!DOCTYPE html>
<html lang="en">
<body style="margin:0">
<link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet"> 
<table style="border-collapse: collapse;padding: 0;margin: 0px auto;text-align: center;font-size: 17px;font-family: 'Poppins', sans-serif;
" width="600px" bgcolor="#f7f7f7">
  <thead>
    <tr>
      <td style="padding: 15px 30px 10px;">
        <a href="#"><img style="max-width: 270px;" src="http://13.50.11.124:5353/img/logo.png"></a>
      </td>
    </tr>
  </thead>
  <tbody style="background: #fff;">
    <tr>
      <td style="padding: 50px 30px;border: solid 1px #f7f7f7;">
        

        <h3 style="margin: 30px auto 15px;font-size: 38px;text-transform: uppercase;color: #383838;max-width: 70%;font-weight: 900;line-height: 1.2;">OTP</h3>
        <p style="font-size: 26px;margin-bottom: 0;line-height: 1.5;font-weight: bold;">Hello </p>
        <a href="#" style="background: linear-gradient(to left, #eba35a, #db5145);color: #fff;text-decoration: none;text-transform: uppercase;padding: 20px 50px;border-radius: 5px;margin-top: 10px;display: inline-block;font-weight: 600;letter-spacing: 1px;font-size: 20px;">${otp}</a>
      </td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td style="padding: 30px;font-size: 14px;">Copyright © 2023 Taxi. All rights reserved.</td>
    </tr>
  </tfoot>
</table>
</body>


</html>


`;

    mailOptions = {
      from: `"Taxi " <${process.env.MAIL_USERNAME}>`,
      to: email,
      subject: "OTP",
      html: htmlContent,
    };
    // Send the email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  }
}

export default MailHelper;
