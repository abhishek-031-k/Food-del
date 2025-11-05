import Stripe from "stripe";
import dotenv from "dotenv";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
  const frontend_url = "https://classy-meerkat-73458d.netlify.app/";

  try {
    const userId = req.user.id || req.user.userId;
    const newOrder = new orderModel({
      userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price *83* 100),
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Delivery Charges" },
        unit_amount: 200,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Stripe error:", error.message);
    res.json({
      success: false,
      message: "Error creating Stripe session",
      error: error.message,
    });
  }
};

const verifyOrder = async(req,res)=>{
   const {orderId,success} = req.body;
  try{
    if(success == "true"){
    await orderModel.findByIdAndUpdate(orderId,{payment:true});
    res.json({success:true,message:"Paid"});
   }
   else{
    await orderModel.findByIdAndDelete(orderId);
    res.json({success:false,message:"Not paid"})
   }
  }
   catch(error){
   console.log();
   res.json({success:false,message:"Error"})
   }
}

// user orders for frontend

const userOrders = async(req, res)=>{
 try{
 const orders = await orderModel.find({userId:req.user.userId})
 res.json({success:true,data:orders})
 }
 catch(error){
 console.log(error);
 res.json({success:false,message:"Error"})
 
 }
}

// listing order for admin panel

const listOrders = async(req, res) =>{
try{
  const orders = await orderModel.find({});
  res.json({success:true,data:orders})
}
catch(error){
  console.log(error);
  res.json({success:false,message:"Error"})
}
}

// api for updating order status
const updateStatus = async(req, res)=>{
try{
await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
res.json({success:true,message:"Status Updated"})
}
catch(error){
console.log(error);
res.json({success:false,message:"Error"})

}
}

export { placeOrder,verifyOrder,userOrders,listOrders,updateStatus};


