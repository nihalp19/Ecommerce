import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";


import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import couponsRoutes from "./routes/coupons.routes.js";
import paymentRoutes from "./routes/payment.route.js"

import { connectDB } from "./lib/connectDB.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json({ limit: "10mb" })); // allows you to parse the body of the request
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponsRoutes);
app.use("/api/payments", paymentRoutes);


app.listen(PORT, () => {
	console.log("Server is running on http://localhost:" + PORT);
	connectDB();
});