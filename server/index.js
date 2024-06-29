const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const userRoutes = require('./Routes/user.routes.js')
const postRoutes = require('./Routes/post.routes.js')

dotenv.config()

// middleware
const app = express()
app.use(express.json())
app.use(cookieParser())
app.use("/uploads", express.static(__dirname + "/uploads"))
app.use(cors({
    credentials: true,
    origin: "http://localhost:5173"
}))

// routes
app.use("/", userRoutes)
app.use('/', postRoutes)

const PORT = process.env.PORT || 3002
// db connection
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Connected To Backend")
    app.listen(PORT, () => {
        console.log(`server is running on port ${PORT}`)
    })
})
    .catch((err) => {
        console.log(err)
    })


