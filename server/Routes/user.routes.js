const express = require("express");
const router = express.Router();
const { createUser, createUserLogin, getUserInfo } = require("../Controller/user.controller");

router.post("/register", createUser);
router.post("/login", createUserLogin);

router.get("/profile", getUserInfo);



module.exports = router;