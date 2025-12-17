import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());

// ✅ CORS configuration
const allowedOrigins = [
  "https://heartfelt-piroshki-c6a964.netlify.app", // your deployed frontend
  "http://localhost:5173"                           // local dev frontend
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "token"],
  credentials: true
}));

// Connect to MongoDB
connectDB();

// Routes
app.get("/", (req, res) => res.send("API Working")); // root route
app.get("/test", (req, res) => res.send("Test route working!")); // test route

app.use("/api/food", foodRouter);
app.use("/images", express.static('uploads'));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message });
});

// Start server
app.listen(port, () => console.log(`Server running on port ${port}`));
