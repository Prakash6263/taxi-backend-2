import * as mongoose from "mongoose";
import * as formidable from "formidable";
import socketObj from "../../services/SocketService";
import Chat from "../../models/Chat";
import User from "../../models/User";

export class ChatController {
  static async sendMessage(data, callback, socket, io) {
    const receiverId = data.receiverId;

    let messageData: any = {
      sender_id: data.senderId || null,
      receiver_id: data.receiverId || null,
      booking_id: data.bookingId || null,
      message: data.message,
      type: data.type || "text",
      url: data.url || null,
    };

    let chatMessage = await new Chat(messageData).save();

    let lastChat: any = await Chat.findById(chatMessage._id).populate([
      { path: "sender_id" },
      { path: "receiver_id" },
    ]);

    const memberSocket = socketObj.sockets[receiverId] || null;

    if (memberSocket) {
      memberSocket.emit("receiveMessage", {
        status: 201,
        message: "Message has been sent successfully.",
        data: lastChat,
      });
    }

    callback({ status: 201, message: "Message sent.", data: lastChat });
  }

  static async chatHistory(data, callback) {
    try {
      const options = {
        page: data.page || 1,
        limit: 10,
      };

      let query = [
        {
          $match: {
            $or: [
              {
                sender_id: new mongoose.Types.ObjectId(
                  data.senderId.toString()
                ),
                receiver_id: new mongoose.Types.ObjectId(
                  data.receiverId.toString()
                ),
                booking_id: new mongoose.Types.ObjectId(
                  data.bookingId.toString()
                ),
              },
              {
                sender_id: new mongoose.Types.ObjectId(
                  data.receiverId.toString()
                ),
                receiver_id: new mongoose.Types.ObjectId(
                  data.senderId.toString()
                ),
                booking_id: new mongoose.Types.ObjectId(
                  data.bookingId.toString()
                ),
              },
            ],
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "sender_id",
            foreignField: "_id",
            as: "sender_id",
          },
        },
        {
          $unwind: {
            path: "$sender_id",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "receiver_id",
            foreignField: "_id",
            as: "receiver_id",
          },
        },
        {
          $unwind: {
            path: "$receiver_id",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $sort: {
            created_at: -1,
          },
        },
      ];

      const myAggregate = Chat.aggregate(query);
      const chatList = await Chat.aggregatePaginate(myAggregate, options);

      callback({
        status: 200,
        message: "Chat get successfully.",
        data: chatList,
      });
    } catch (e: any) {
      callback({
        status: 500,
        message: "Intenal server error.",
        data: e._message,
      });
    }
  }

  static async readMessage(data, callback) {
    try {
      let chat: any = await Chat.findById(data.chat_id);
      chat.is_read = true;
      chat.save();

      callback({
        status: 200,
        message: "Message readed successfully.",
        data: chat,
      });
    } catch (e: any) {
      callback({
        status: 500,
        message: "Intenal server error.",
        data: e._message,
      });
    }
  }

  static async chatList(data, callback, socket) {
    try {
      let limit = data.limit || 10;

      const options = {
        page: data.page || 1,
        limit: 3,
        collation: {
          locale: "en",
        },
        lean: true,
        sort: {
          created_at: -1,
        },
      };

      let query = [
        {
          $match: {
            type: { $in: ["Specialist", "Dealer"] },
            is_active: true,
            is_verify: true,
            is_deleted: false,
            _id: { $ne: data.senderId },
          },
        },
      ];

      const myAggregate = User.aggregate(query);
      const userList = await User.aggregatePaginate(myAggregate, options);

      callback({
        status: 200,
        message: "Chat list get successfully.",
        data: userList,
      });
    } catch (e: any) {
      callback({
        status: 500,
        message: "Intenal server error.",
        data: e._message,
      });
    }
  }
}
