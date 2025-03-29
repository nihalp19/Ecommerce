import express from "express"
import {singup,logout,login} from "../controllers/auth.controllers.js"


const router = express.Router()

router.post("/signup",singup)
router.post("/login",login)
router.post("/logout",logout)

export default router