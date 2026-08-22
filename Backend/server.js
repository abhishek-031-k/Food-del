import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 10000;
app.set("trust proxy", 1);

app.use(express.json());

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "token"],
  })
);

/* -------------------- DATABASE -------------------- */
if (!process.env.MONGO_URL) {
  console.error(" MONGO_URL missing");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log(" MongoDB Connected"))
  .catch((err) => {
    console.error(" MongoDB Error:", err.message);
    process.exit(1);
  });

/* -------------------- ROUTES -------------------- */
app.get("/", (req, res) => {
  res.send("API is working");
});

app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

/* -------------------- ERROR HANDLER -------------------- */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message,
  });
});

/* -------------------- START SERVER -------------------- */
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
