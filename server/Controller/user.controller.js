const User = require("../Models/user.model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "c49w84d9c84w9dc8wdc7";

// userData
const userData = (req, res) => {
    try {
        const { token } = req.cookies

        jwt.verify(token, jwtSecret, async (err, user) => {
            if (err) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const userDoc = await User.findById(user.id)
            res.status(200).json(userDoc);
        });
    } catch (error) {
        console.error("Error getting user info:", error);
        res.status(500).json({ message: error.message })
    }
}

// Create a new user
const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        const user = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcryptSalt)
        })
        res.status(200).json(user)
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: error.message })
    }
}

// Login user
const createUserLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isValid = bcrypt.compareSync(password, user.password);
        if (!isValid) {
            return res.status(422).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ email: user.email, id: user._id, name: user.name }, jwtSecret, {}, (err, token) => {
            if (err) {
                throw err;
            }
            res.cookie("token", token, { httpOnly: true }).json(user);
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user info
const getUserInfo = async (req, res) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        res.status(200).json(user);
    });
};

// Logout user
const userLogOut = async (req, res) => {
    try {
        res.cookie('token', '', { httpOnly: true }).json(true);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createUser,
    createUserLogin,
    getUserInfo,
    userLogOut,
    userData
};
