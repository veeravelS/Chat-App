const express = require('express')
const registerUser = require('../controller/registerUser')
const checkEmail = require('../controller/checkEmail')
const checkPassword = require('../controller/checkPassword')
const logout = require('../controller/logout')
const updateUserDetails = require('../controller/updateUserDetails')
const userDetails = require("../controller/userDetails")
const searchUser = require("../controller/searchUser")
const loginUser = require("../controller/loginUser") 
const router = express.Router()

//create user api
router.post("/register",registerUser)
// user login
router.post("/login",loginUser)
//check user email
router.post("/email",checkEmail)
//check user password
router.post("/password",checkPassword)
//user details
router.get("/user-details",userDetails)
//user logout
router.get("/logout",logout)
//user update User Detail
router.post("/update-user",updateUserDetails)
//search user
router.post("/search-user",searchUser)

module.exports = router