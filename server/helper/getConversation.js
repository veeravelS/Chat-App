const { ConversationModel } = require("../model/conversationModel")

const getConversation = async(currentUserId)=>{
    if(currentUserId){
        const currentUserConversation = await ConversationModel.find({
          "$or":[
            {sender : currentUserId},
            {receiver : currentUserId}
          ]
        }).sort({updatedAt : -1}).populate( 'messages'
        ).populate('sender').populate('receiver')
        console.log("Fetched conversation:", JSON.stringify(currentUserConversation, null, 2));
        console.log('currentUserConversation',currentUserConversation)
        const fetchConversation = JSON.stringify(currentUserConversation, null, 2);
        const parseConversation = JSON.parse(fetchConversation);
      const conversation = parseConversation.map((conv)=>{
        const countUnseenMsg = conv.messages.reduce((prev,curr)=>{
          const msgByUserId  = curr?.messageByUserId?.toString();
          console.log("msgByUserId",msgByUserId); 
          if(msgByUserId !== currentUserId){
          return prev + (curr.seen ? 0 : 1);
          }
          else
          {
            return prev;
          }
        },0)
        return {
          _id : conv?._id,
          sender : conv?.sender,
          receiver : conv?.receiver,
          unseenMsg : countUnseenMsg,
          lastMsg : conv.messages[conv?.messages?.length - 1]
        }
      }
      )
      return conversation;
      }
      else{
        return []
      }
}

module.exports  = getConversation;