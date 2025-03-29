import express from "express"
import dotenv from "dotenv"
dotenv.config()
import authRoutes from "./routes/auth.routes.js"
import { connectDB } from "./lib/connectDB.js"
import cookieParse from "cookie-parser"

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json({limit : '50mb'}))
app.use(cookieParse())



app.get("/",async(req,res) => {
    res.send("SERVER IS STARTED ON PORT NO 3000")
})

app.use("/api/auth",authRoutes)

app.listen(PORT,() => {
    connectDB()
    console.log(`Server is started on PORT NO ${PORT}`)
})


