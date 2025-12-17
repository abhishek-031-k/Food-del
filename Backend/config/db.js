import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGO_URL;

  if (!uri) {
    console.error("❌ ERROR: MONGO_URL is not defined in environment variables!");
    process.exit(1); 
  }

  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB Connected Successfully");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1);
  }
};
