const UserModel = require("../model/userModel")
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function loginUser(request,response){
    try {
        const {email,password} = request.body;
        const user = await UserModel.findOne({email});

        if(!user){
            return response.status(400).json({
                message : "User not exist",
                error : true
            })
        }
         const verifyPassword = await bcryptjs.compare(password,user.password);
         if(!verifyPassword){
            return response.status(400).json({
                message : "Please check password",
                error : true
            })
        }
        const tokenData ={
            id : user._id,
            email : user.email 
        }
        const token = await jwt.sign(tokenData,process.env.JWT_SECRET_KEY,{expiresIn:"1d"});
        const cookieOption ={
            http:true,
            secure:true
        }
        return response.cookie('token',token,cookieOption).status(200).json({
            message : "Login successfully",
            token:token,
            data: { _id: user._id, name: user.name, email: user.email, profile_pic: user.profile_pic },
            success:true
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}

module.exports = loginUser