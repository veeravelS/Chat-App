const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const app = express();
const getUserDetailsFromToken = require("../helper/getUserDetailsFromToken");
const UserModel = require("../model/userModel");
const {ConversationModel,MessageModel} = require("../model/conversationModel");
  console.log("ConversationModel",ConversationModel)
// Socket connection
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
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
  socket.join(user?._id);
  onlineUser.add(user?._id?.toString());
  io.emit("onlineUser", Array.from(onlineUser));

  socket.on("message-page", async(userId) => {
    console.log("userId", userId);
    const userDetails = await UserModel.findById(userId).select("-password")
    const payload = {
      _id : userDetails._id,
      name : userDetails.name,
      email : userDetails.email,
      profile_pic : userDetails.profile_pic,
      online : onlineUser.has(userId)
    }
    socket.emit("message-user",payload)
  });

  //new message 
  socket.on('new message',async(data)=>{
    console.log("new message",data);

    //check conversation is available both user

    let conversation = await ConversationModel.findOne({
      "$or":[{
        sender:data?.sender,receiver:data?.receiver
      },{
        sender:data?.receiver,receiver:data?.sender
      }]
    })
    console.log("conversation",conversation);
    console.log("ConversationModel",ConversationModel);

    if(!conversation){
      const createConversation = new ConversationModel({
        sender : data?.sender,
        receiver : data?.receiver
      })
      conversation = await createConversation.save()
    }
    console.log("data",data);
    const message = new MessageModel({
      text:data.text,
      imageUrl:data.imageUrl,
      videoUrl:data.videoUrl,
      messageByUserId:data.msgByUserId
    })
    const saveMessage = await message.save();
    console.log("Saved Message:", saveMessage);
    const updateConversation = await ConversationModel.findOneAndUpdate(
      { _id: conversation?._id },
      { "$push": { messages: saveMessage?._id } },
      { new: true } // ✅ Ensure updated conversation is returned
    ).populate({
      path: "messages",
      options: { sort: { createdAt: -1 } } // ✅ Ensure messages are populated
    }); 
    console.log(updateConversation)
    const getConversationMessage = await ConversationModel.findOne({
      "$or":[{
        sender:data?.sender,receiver:data?.receiver
      },{
        sender:data?.receiver,receiver:data?.sender
      }]
    }).populate({path:'messages',options:{sort:{createdAt : -1}}})
    console.log("Fetched Messages:", getConversationMessage?.messages); 
    io.to(data?.sender).emit('message',getConversationMessage.messages)
    io.to(data?.receiver).emit('message',getConversationMessage.messages)
  })

  //disconnect
  socket.on("disconnect", () => {
    onlineUser.delete(user?._id);
    console.log("disconnect user", socket.id);
  });
});

module.exports = {
  app,
  server,
};