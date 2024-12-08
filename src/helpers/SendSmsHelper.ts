import { env } from "../environments/Env";
const twilio = require("twilio");
export const sendSMS = async (to: any, body: any) => {
  const accountSid = "ACa5144ce5fa5c6376cf0ac82cc91728b6";
  const authToken = "162ee1be86ed4b5057581c2b469fdc8a";
  const twilioNumber = process.env.TWILIO_NUMBER
    ? process.env.TWILIO_NUMBER
    : "+14175453385";

  const client = new twilio(accountSid, authToken);
  console.log(to, "to");
  try {
    const message = await client.messages.create({
      body: body,
      to: "+" + to,
      from: "+14175453385'",
    });
    console.log("SMS has been sent successfully", message);
    return true;
  } catch (error) {
    console.error("Somthing went wrong, Error is", error);
    return false;
  }
};
