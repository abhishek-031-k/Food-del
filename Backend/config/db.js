import mongoose from "mongoose";

export const connectDB = async ()=> {
   await mongoose.connect('mongodb+srv://abhishkumar159:Abhishek123@cluster0.gy10sl1.mongodb.net/food-del')
   .then(()=>console.log("DB Connected"));
}
