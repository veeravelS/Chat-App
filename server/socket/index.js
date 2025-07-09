const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const app = express();
const getUserDetailsFromToken = require("../helper/getUserDetailsFromToken");
const UserModel = require("../model/userModel");
const mongoose = require("mongoose");
const getConversation = require("../helper/getConversation");
const {
  ConversationModel,
  MessageModel,
} = require("../model/conversationModel");
// Socket connection
const server = http.createServer(app);
const allowedOrigins = process.env.FRONTEND_URL.split(",");
const io = new Server(server, {
  cors: {
     origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
    credentials: true,
  },
});
//online user
const onlineUser = new Set();

io.on("connection", async (socket) => {
  console.log("connect user", socket.id);
  const token = socket.handshake.auth.token;
  console.log("token", token);
  //current user details
  const user = await getUserDetailsFromToken(token);

  //create a room
  socket.join(user?._id?.toString());
  onlineUser.add(user?._id?.toString());
  io.emit("onlineUser", Array.from(onlineUser));

  socket.on("message-page", async (userId) => {
    console.log("userId", userId);
    const userDetails = await UserModel.findById(userId).select("-password");
    const payload = {
      _id: userDetails._id,
      name: userDetails.name,
      email: userDetails.email,
      profile_pic: userDetails.profile_pic,
      online: onlineUser.has(userId),
    };
    socket.emit("message-user", payload);

    //get previous message
    const getConversationMessage = await ConversationModel.findOne({
      $or: [
        {
          sender: user?._id,
          receiver: userId,
        },
        {
          sender: userId,
          receiver: user?._id,
        },
      ],
    }).populate({ path: "messages", options: { sort: { createdAt: -1 } } });
    socket.emit("message", getConversationMessage?.messages);
  });

  //new message
  socket.on("new message", async (data) => {
    console.log("new message", data);

    //check conversation is available both user

    let conversation = await ConversationModel.findOne({
      $or: [
        {
          sender: data?.sender,
          receiver: data?.receiver,
        },
        {
          sender: data?.receiver,
          receiver: data?.sender,
        },
      ],
    });
    console.log("conversation", conversation);
    console.log("ConversationModel", ConversationModel);
 
    //if conversation is not available
    if (!conversation) {
      const createConversation = new ConversationModel({
        sender: data?.sender,
        receiver: data?.receiver,
      });
      conversation = await createConversation.save();
    }
    console.log("data", data);
    const message = new MessageModel({
      text: data.text,
      sender: data.sender,
      imageUrl: data.imageUrl,
      videoUrl: data.videoUrl,
      messageByUserId: data.msgByUserId,
    });
    const saveMessage = await message.save();
    console.log("Saved Message:", saveMessage);
    const updateConversation = await ConversationModel.findOneAndUpdate(
      { _id: conversation?._id },
      { $push: { messages: saveMessage?._id } },
      { new: true } // ✅ Ensure updated conversation is returned
    ).populate({
      path: "messages",
      options: { sort: { createdAt: -1 } }, // ✅ Ensure messages are populated
    });
    console.log("updateConversation", updateConversation);
    const getConversationMessage = await ConversationModel.findOne({
      $or: [
        {
          sender: data?.sender,
          receiver: data?.receiver,
        },
        {
          sender: data?.receiver,
          receiver: data?.sender,
        },
      ],
    }).populate({ path: "messages", options: { sort: { createdAt: -1 } } });
    console.log("Fetched Messages:", getConversationMessage?.messages);
    console.log("sender", data);
    io.to(data?.sender).emit("message", getConversationMessage.messages);
    io.to(data?.receiver).emit("message", getConversationMessage.messages);

    //send conversation
    const conversationSender = await getConversation(data?.sender.toString());
    const conversationReceiver = await getConversation(data?.receiver.toString());
    io.to(data?.sender.toString()).emit("conversation", conversationSender);
    io.to(data?.receiver.toString()).emit("conversation", conversationReceiver);
  });

  // sidebar
  socket.on("sidebar", async (currentUserId) => {
    console.log("current user", currentUserId);
    const conversation = await getConversation(currentUserId);
    socket.emit("conversation", conversation);
  });

  socket.on("seen", async (msgByUserId) => {
    try {
      const conversation = await ConversationModel.findOne({
        $or: [
          { sender: user?._id.toString(), receiver: msgByUserId },
          { sender: msgByUserId, receiver: user?._id.toString() },
        ],
      });
  
      if (!conversation) return;
  
      const conversationMessageId = conversation?.messages || [];
      console.log("conversationMessageId", conversationMessageId);
  
      await MessageModel.updateMany(
        { 
          _id: { "$in": conversationMessageId }, 
          messageByUserId: { "$ne": new mongoose.Types.ObjectId(user?._id) } // ✅ Ensure only other user's messages are updated
        },
        { "$set": { seen: true } }
      );
  
      // Fetch updated messages in the correct order
      const updatedConversation = await ConversationModel.findOne({
        $or: [
          { sender: user?._id, receiver: msgByUserId },
          { sender: msgByUserId, receiver: user?._id }
        ],
      }).populate({ path: "messages", options: { sort: { createdAt: -1 } } }); // ✅ Oldest to newest order
  
      // Send updated conversation
      io.to(user?._id.toString()).emit("conversation", await getConversation(user?._id.toString()));
      io.to(msgByUserId).emit("conversation", await getConversation(msgByUserId));
      
      // Send ordered messages
      io.to(user?._id.toString()).emit("message", updatedConversation?.messages || []);
      io.to(msgByUserId).emit("message", updatedConversation?.messages || []);
  
    } catch (error) {
      console.error("Error in seen event:", error);
    }
  });
  // disconnect
  socket.on("disconnect", () => {
    onlineUser.delete(user?._id?.toString());
    console.log("disconnect user", socket.id);
    io.emit("onlineUser", Array.from(onlineUser)); 
  });
});

module.exports = {
  app,
  server,
};