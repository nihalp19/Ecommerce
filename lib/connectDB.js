import mongoose from "mongoose"


export const  connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECT_URI)
        console.log("MONGODB CONNECTED")
    } catch (error) {
        console.log("error while connecting the mongdb :",error.message)
    }
}