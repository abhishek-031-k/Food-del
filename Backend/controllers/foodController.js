import foodModel from "../models/foodModel.js";
import cloudinary from "../config/cloudinaryConfig.js";

const addFood = async (req, res) => {
  try {
    console.log("=== ADD FOOD DEBUG ===");
    console.log("req.body:", req.body); 
    console.log("req.file:", req.file); 
    console.log("======================");

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }

    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: req.file.path,       
      imageId: req.file.filename  
    });

    const savedFood = await food.save();

    res.json({
      success: true,
      message: "Food Added",
      data: savedFood
    });

  } catch (error) {
    console.log("Add Food Error:", error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log("List Food Error:", error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    if (!food) {
      return res.status(404).json({ success: false, message: "Food not found" });
    }

    if (food.imageId) {
      try {
        await cloudinary.uploader.destroy(food.imageId);
        console.log(`Cloudinary image ${food.imageId} deleted successfully.`);
      } catch (cloudErr) {
        console.log("Cloudinary delete error:", cloudErr);
      }
    }

    await foodModel.findByIdAndDelete(req.body.id);

    res.json({ success: true, message: "Food Removed" });

  } catch (error) {
    console.log("Remove Food Error:", error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

export { addFood, listFood, removeFood };
