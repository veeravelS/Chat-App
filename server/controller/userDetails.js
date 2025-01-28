const getUserDetailsFromToken = require("../helper/getUserDetailsFromToken")

async function userDetails(request,response){
   try {
      const token = request.cookies.token || ""
      const user = await getUserDetailsFromToken(token)
      if(!token){
         return response.status(401).json({
            message:"token is missing",
            error:true
         })
      }
      return response.status(200).json({
         message:"user detail",
         data:user
      })
      
   } catch (error) {
      return response.status(500).json({
         message:error.message || error,
         error:true
      })
   }
}

module.exports = userDetails