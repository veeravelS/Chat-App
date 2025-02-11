const jwt = require("jsonwebtoken");
const UserModel = require("../model/userModel");

const getUserDetailsFormToken = async (token) => {
  console.log("token received", token?.cookies?.token );
  const authToken = token?.cookies?.token || token;
  if (!token) {
    return {
      message: "session out",
      logout: true,
    };
  }

  console.log("Auth token",authToken)

  const decode = await jwt.verify(authToken, process.env.JWT_SECRET_KEY);
  const user = await UserModel.findById(decode.id).select("-password");
  return user;
};

module.exports = getUserDetailsFormToken;