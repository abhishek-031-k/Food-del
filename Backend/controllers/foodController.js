import foodModel from "../models/foodModel.js";
import cloudinary from "../config/cloudinaryConfig.js";

// 1. Create a free, empty memory variable outside the functions
let foodCache = null;

const addFood = async (req, res) => {
  try {
    console.log("=== ADD FOOD DEBUG ===");
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);
    console.log("======================");

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    // Upload image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "foodImages",
    });

    // Save food in MongoDB
    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: uploadResult.secure_url,
      imageId: uploadResult.public_id,
    });

    const savedFood = await food.save();

    // 🔥 CRITICAL: Reset the cache when new food is added
    // This forces the next visitor to fetch the fresh list from the database
    foodCache = null;

    res.status(201).json({
      success: true,
      message: "Food added successfully",
      data: savedFood,
    });
  } catch (error) {
    console.error("Add Food Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// All food list with memory cache optimization
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
    console.error("List Food Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(food.imageId);

    // Delete from MongoDB
    await foodModel.findByIdAndDelete(req.body.id);

    // 🔥 CRITICAL: Reset the cache when food is removed
    foodCache = null;

    res.json({
      success: true,
      message: "Food removed successfully",
    });
  } catch (error) {
    console.error("Remove Food Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { addFood, listFood, removeFood };
