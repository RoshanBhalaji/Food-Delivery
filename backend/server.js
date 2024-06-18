import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js"; // Ensure .js is added to imports
import foodRouter from "./routes/foodRoute.js"; // Ensure .js is added to imports
import { userRouter } from "./routes/userRoutes.js"; // Ensure .js is added to imports
import 'dotenv/config';
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

// App config
const app = express();
const port = process.env.PORT || 5000; // Use environment variable for port

app.use(express.json());
app.use(cors());

connectDB();

// API endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static('uploads'));
app.use("/api/user", userRouter);
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
