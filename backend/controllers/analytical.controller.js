import Product from "../models/product.model.js"
import User from "../models/user.model.js"
import Order from "../models/order.model.js"


export const getAnalyticalData = async (req, res) => {
    const totalUsers = await User.countDocuments()
    const totalProducts = await Product.countDocuments()

    const salesData = await Order.aggregate([
        {
            $group: {
                _id: null,
                totalSales: { $sum: 1 },
                totalRevenue: { $sum: "$totalAmount" }
            }
        }
    ])

    const { totalSales, totalRevence } = salesData[0] || { totalSales: 0, totalRevence: 0 }


    return {
        users: totalUsers,
        product: totalProducts,
        totalSales,
        totalRevence
    }

}

export const getDailySalesData = async (startDate, endDate) => {
    try {
        const dailySalesData = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startDate,
                        $lte: endDate,
                    }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    sales: { $sum: 1 },
                    revence: { $sum: "$totalAmount" }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ])

        const dateArray = getDatesInRange(startDate, endDate)
        console.log(dateArray)

        return dateArray.map(date => {
            const foundData = dailySalesData.find(item => item._id === date)

            return {
                date,
                sales: foundData?.sales || 0,
                sales: foundData?.revenue || 0,
            }
        })
    } catch (error) {
        console.log("error in getDailySalesdata",error.message)
    }

}



function getDatesInRange(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate)

    while (currentDate <= endDate) {
        dates.push(currentDate.toISOString().split("T")[0])
        currentDate.setDate(currentDate.getDate() + 1)
    }

    return dates;
}