import express from "express"

import {addToCart,removeAllFromCart,getCartProducts,updateQuantity} from "../controllers/cart.controllers.js"
import { protectRoute } from "../middleware/auth.middleware.js"

const router = express.Router()

router.put("/",protectRoute,getCartProducts)
router.post("/",protectRoute,addToCart)
router.delete("/",protectRoute,removeAllFromCart)
router.put("/",protectRoute,updateQuantity)


export default router