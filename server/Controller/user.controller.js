const User = require("../Models/user.model.js")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")



const bcryptSalt = bcrypt.genSaltSync(10)
const jwtSecret = "c49w84d9c84w9dc8wdc7"


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
        res.status(500).json({ message: error.message })
    }
}

const createUserLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (user) {
            const isValid = bcrypt.compareSync(password, user.password)
            if (isValid) {
                jwt.sign({
                    email: user.email,
                    id: user._id,
                    name: user.name
                }, jwtSecret, {}, (err, token) => {
                    if (err) throw err
                    res.cookie("token", token).json(user)
                })
            } else {
                res.status(422).json("password not ok")
            }
        } else {
            res.status(404).json("not found")
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getUserInfo = async (req, res) => {
    try {
        const { token } = req.cookies
        if (token) {
            jwt.verify(token, jwtSecret, {}, (err, user) => {
                if (err) throw err
                res.status(200).json(user)
            })
        } else {
            res.status(401).json("Unauthorized")
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get all users
// exports.getAllUsers = async (req, res) => {
//     try {
//       const users = await User.find({});
//       res.json(users);
//     } catch (error) {
//       res.status(500).json({ message: 'Server error' });
//     }
//   };
  
//   // Delete user
//   exports.deleteUser = async (req, res) => {
//     try {
//       const user = await User.findById(req.params.id);
  
//       if (user) {
//         await user.remove();
//         res.json({ message: 'User removed' });
//       } else {
//         res.status(404).json({ message: 'User not found' });
//       }
//     } catch (error) {
//       res.status(500).json({ message: 'Server error' });
//     }
//   };

module.exports = {
    createUser,
    createUserLogin,
    getUserInfo
}