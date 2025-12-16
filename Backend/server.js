import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import 'dotenv/config';

// App config
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());

// ✅ CORS setup
// Replace with your deployed frontend URLs
const allowedOrigins = [
    "https://gleaming-gnome-2411aa.netlify.app",  // main frontend
    "https://rainbow-jelly-47aeb1.netlify.app",   // another frontend/admin
    "http://localhost:5173"                        // local frontend for testing
];

app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "token"],
    credentials: true
}));

// Database connection
connectDB();

// API Routes
app.use("/api/food", foodRouter);
app.use("/images", express.static('uploads'));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// Test routes
app.get("/", (req, res) => res.send("API Working"));
app.get("/test", (req, res) => res.send("Test route working!"));

// ✅ Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: err.message });
});

// Start server
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
