import { Server } from "./server";
import * as cron from "node-cron";
const server: any = require("http").Server(new Server().app);
import socketObj from "./services/SocketService";
import { CronController } from "./controllers/CronController";
let port = process.env.PORT || 9211;
server.listen(port, () => {
  console.log(`server is listening at port ${port}`);
  socketObj.init(server);
  socketObj.connect();
  console.log("Socket Connected");
});

cron.schedule("* * * * *", async function () {
  // await CronController.sendNotification();
  // await CronController.deleteNotCompleteBooking();
});
