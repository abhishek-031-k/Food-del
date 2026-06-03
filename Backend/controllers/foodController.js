import foodModel from "../models/foodModel.js";
import fs from 'fs';

// 1. Create a free, empty memory variable outside the function
let foodCache = null;

// All food list
const listFood = async (req, res) => {
    try {
        // 2. If memory already has the food list, send it instantly! 
        // This bypasses the database completely for users 2 to 500.
        if (foodCache) {
            return res.json({ success: true, data: foodCache });
        }

        // 3. If memory is empty, fetch it from the database (Only happens once)
        // Adding .lean() makes the query incredibly lightweight
        const foods = await foodModel.find({}).lean();

        // 4. Save the list to our memory cache for all future users
        foodCache = foods;

        res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// Keep the rest of your original functions (addFood, removeFood) down here unchanged
export { listFood };
