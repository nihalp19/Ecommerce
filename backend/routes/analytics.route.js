import express from "express"
import { adminRoute,protectRoute } from "../middleware/auth.middleware.js"
import { getAnalyticalData } from "../controllers/analytical.controller.js"


const router = express.Router()
router.get("/",protectRoute,adminRoute,async (req,res) => {
    try {
        const analyticsData = await getAnalyticalData()

        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000)
        
        const dailySalesData = await getDailySalesData(startDate,endDate)

        res.json({
            analyticsData,
            dailySalesData
        })
    } catch (error) {
        console.log("error in analytics route",error.message)

        res.status(500).json({message : "Internal Server Error",error : error.message})
    }
})






export default router