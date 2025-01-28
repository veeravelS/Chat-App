const express = require('express')
const registerUser = require('../controller/registerUser')
const checkEmail = require('../controller/checkEmail')
const checkPassword = require('../controller/checkPassword')
const getUserDetailsFormToken = require('../helper/getUserDetailsFromToken')
const logout = require('../controller/logout')
const updateUserDetails = require('../controller/updateUserDetails')
const router = express.Router()

//create user api
router.post("/register",registerUser)
//check user email
router.post("/email",checkEmail)
//check user password
router.post("/password",checkPassword)
//user details
router.get("/user-details",getUserDetailsFormToken)
//user logout
router.get("/logout",logout)
//user update User Detail
router.post("update-user",updateUserDetails)

module.exports = router