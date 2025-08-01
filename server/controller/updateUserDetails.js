const UserModel = require("../model/userModel")
const getUserDetailsFromToken = require("../helper/getUserDetailsFromToken")

async function updateUserDetails(request,response){
   try {
      const token = request.cookies.token || ""
      console.log("controller",token)
      const user = await getUserDetailsFromToken(token)
      const {name,email,password,profile_pic} = request.body

      const  updateUser = await UserModel.updateOne({_id:user._id},{
         name,
         profile_pic,
         email,
      })
      const userInformation = await UserModel.findById(user._id)

      return response.status(200).json({
         message:"user update successfully",
         data:userInformation,
         success:true
      })

     } catch (error) {
      return response.status(500).json({
         message:error.message || error,
         error:true
      })
   }
}

module.exports = updateUserDetails