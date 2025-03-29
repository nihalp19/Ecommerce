import { redis } from "../lib/redis.js"
import User from "../models/user.model.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const generateToken = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '15m'
    })
    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '7d'
    })

    return { accessToken, refreshToken }
}


const storeRefreshToken = async (userId, refreshToken) => {
    await redis.set(`refresh_token${userId}`, refreshToken, { ex: 7 * 24 * 60 * 60 })
}

const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 27 * 60 * 60 * 1000,
    })
}


export const singup = async (req, res) => {
    try {
        const { name, email, password } = req.body
        const userExits = await User.findOne({ email })

        if (userExits) {
            return res.status(400).json({ message: "User already exits" })
        }

        const user = await User.create({ name, email, password })

        const { accessToken, refreshToken } = generateToken(user._id)

        await storeRefreshToken(user._id, refreshToken)

        setCookies(res, accessToken, refreshToken)

        res.status(200).json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }, message: "user created Succcessfully"
        })


    } catch (error) {
        console.log("Error while singup", error.message)
        return res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}
export const login = async (req,res) => {
    try {

        const { email, password } = req.body

        const user = await User.findOne({ email })

        if (user && (await user.comparePassword(password))) {
            const { accessToken, refreshToken } = generateToken(user._id)
            storeRefreshToken(user._id, refreshToken)
            setCookies(res, accessToken, refreshToken)

            res.status(200).json({
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }, message: "user login Succcessfully"
            })

        }


    } catch (error) {
        console.log("error while login")
        res.status(500).json({message : "Internal Server Error",error : error.message})
    }
}

export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken
        if (refreshToken) {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
            await redis.del(`refresh_token${decoded.userId}`)
        }

        res.clearCookie("accessToken")
        res.clearCookie("RefreshToken")
        res.status(200).json({ message: "Logged Out successfully" })
    } catch (error) {
        console.log("error while login", error.message)
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}