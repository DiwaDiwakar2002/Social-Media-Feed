const express = require("express");
const router = express.Router();
const { createUser, createUserLogin, getUserInfo, userLogOut, userData } = require("../Controller/user.controller");

router.post("/register", createUser);
router.post("/login", createUserLogin);

router.get("/profile", getUserInfo);
router.get("/user-data", userData);

// logout
router.post("/logout", userLogOut);

module.exports = router;
