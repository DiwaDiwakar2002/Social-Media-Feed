const express = require("express");
const router = express.Router();
const { createUser, createUserLogin, getUserInfo, userLogOut, userData, getUserList, userDelete } = require("../Controller/user.controller");

router.post("/register", createUser);
router.post("/login", createUserLogin);

router.get("/profile", getUserInfo);
router.get("/user-data", userData);
router.get('/user-list', getUserList)

// delete user
router.delete('/user-delete/:id', userDelete)  

// logout
router.post("/logout", userLogOut);

module.exports = router;
