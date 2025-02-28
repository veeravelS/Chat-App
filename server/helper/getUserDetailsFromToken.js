const jwt = require("jsonwebtoken");
const UserModel = require("../model/userModel");

const getUserDetailsFromToken = async (token) => {
  try {
    console.log("Token received:", token?.cookies?.token);
    
    const authToken = token?.cookies?.token || token;
    if (!authToken) {
      return {
        message: "Session expired",
        logout: true,
      };
    }

    console.log("Auth token:", authToken);

    // Verify the token
    const decoded = jwt.verify(authToken, process.env.JWT_SECRET_KEY);
    if (!decoded?.id) {
      return {
        message: "Invalid token",
        logout: true,
      };
    }

    // Fetch user details from the database
    const user = await UserModel.findById(decoded.id).select("-password");
    if (!user) {
      return {
        message: "User not found",
        logout: true,
      };
    }

    return user;
  } catch (error) {
    console.error("JWT Error:", error);

    if (error.name === "TokenExpiredError") {
      return {
        message: "Session expired. Please log in again.",
        logout: true,
      };
    }

    return {
      message: "Authentication failed",
      logout: true,
    };
  }
};
module.exports = getUserDetailsFromToken;
