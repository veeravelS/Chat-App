const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({
   sender :{
      type:String,
      default:""
   },
   imageUrl :{
      type:String,
      default:""
   },
   videoUrl :{
      type:String,
      default:""
   },
   seen :{
      type:Boolean,
      default:false
   },
},{
   timestamps:true
})


const conversationSchema = new mongoose.Schema({
   sender :{
      type:mongoose.Schema.ObjectId,
      required:true,
      ref:'User'
   },
   receiver :{
      type:mongoose.Schema.ObjectId,
      required:true,
      ref:'User'
   },
   message :{
      type:mongoose.Schema.ObjectId,
      ref:'message'
   }
},{
   timestamps:true
})

const messageModel = mongoose.model("Message",messageSchema)
const conversationModel = mongoose.model("Conversation",conversationSchema)

modules.exports = {
   messageModel,
   conversationModel
}
