import { Server, Socket } from "socket.io";
import * as Jwt from "jsonwebtoken";
import User from "../models/User";
import { RideService } from "./RideService";
import { BookingController } from "../controllers/User/BookingController";
import { ChatController } from "../controllers/chat/ChatController";

export class SocketService {
  io: Server;
  sockets: { [key: string]: Socket } = {};
  onlineUsers: string[] = [];
  blockData: any;

  constructor() {
    this.io = null!;
    this.blockData = null;
  }

  init(server: any) {
    this.io = new Server(server, {
      maxHttpBufferSize: 100000000,
      connectTimeout: 5000,
      transports: ["websocket", "polling"],
      pingInterval: 25000,
      pingTimeout: 5000,
    });
  }

  async provideSocket(id: string) {
    console.log("Provide Socket For ID", id);
    return this.sockets[id];
  }

  globalSocket() {
    return this.io;
  }

  async connect() {
    this.io.use(async (socket: Socket, next) => {
      try {
        const query: any = socket.handshake.query;
        const token: string = query.token;

        if (!token) {
          console.log("Token not present");
          return next(new Error("Authentication error"));
        }

        Jwt.verify(token, "taxi", async (err, decoded: any) => {
          if (err) {
            console.error("JWT verification failed:", err);
            return next(new Error("Authentication error"));
          } else {
            try {
              const currentUser = await User.findById(decoded._id).lean();
              if (!currentUser) {
                return next(new Error("User not found"));
              }
              socket.data.user = currentUser;
              next();
            } catch (err) {
              console.error("User lookup failed:", err);
              next(err);
            }
          }
        });
      } catch (error) {
        next(error);
      }
    });

    this.io.on("connection", (socket: Socket) => {
      const userId = socket.data.user._id;
      this.onlineUsers.push(socket.id);
      this.sockets[userId] = socket;

      // for testing purpose
      socket.on("testConnection", (data, callback) => {
        console.log("test connection success....", data);
        socket.emit(
          "newMessage",
          { receiverId: "some-user-id", message: "Hello from client!" },
          (response) => {
            console.log("Message sent:", response);
          }
        );
      });

      socket.on("acceptOrReject", (data, callback) => {
        console.log(data,"<<<datadatadatadata()");
        data.driverId = userId.toString();
        BookingController.acceptReject(
          data,
          callback,
          data.customerId,
          this.io
        );
      });

      socket.on("getBookingDriverEmit", (data, callback) => {
        data.senderId = userId;
        BookingController.getBookingDriverEmit(
          data,
          callback,
          data.customerId,
          this.io
        );
      });

      socket.on("locationUpdate", (data, callback) => {
        data.driverId = userId;
        BookingController.updateLocation(
          data,
          callback,
          data.customerId,
          this.io
        );
      });

      socket.on("statusUpdate", (data, callback) => {
        data.driverId = userId;
        BookingController.statusUpdate(
          data,
          callback,
          data.customerId,
          this.io
        );
      });

      socket.on("verifyOtpBooking", (data, callback) => {
        data.driverId = userId;
        BookingController.verifyOtpBooking(
          data,
          callback,
          data.customerId,
          this.io
        );
      });

      socket.on("sendMessage", (data, callback) => {
        data.senderId = userId;
        ChatController.sendMessage(data, callback, data.receiverId, this.io);
      });

      socket.on("chatHistory", (data, callback) => {
        data.senderId = userId;
        ChatController.chatHistory(data, callback);
      });

      // socket.on("chatList", (data, callback) => {
      //   data.senderId = userId;
      //   ChatController.chatList(data, callback);
      // });

      socket.on("readMessage", (data, callback) => {
        data.senderId = userId;
        ChatController.readMessage(data, callback);
      });

      // socket.on("acceptRide", (data, callback) => {
      //   data.driverId = userId;
      //   RideService.acceptRide(data, callback);
      // });

      socket.on("readUserLatLong", (data, callback) => {
        data.senderId = userId;
        ChatController.sendMessage(data, callback, data.receiverId, this.io);
      });

      socket.on("disconnect", () => {
        console.log("User Disconnected.");
        const userId = socket.data.user._id;
        delete this.sockets[userId];
        this.onlineUsers = this.onlineUsers.filter((id) => id !== socket.id);
        console.log("Online Users After Disconnect", this.onlineUsers.length);
      });
    });
  }
}

const socketObj = new SocketService();
export default socketObj;
