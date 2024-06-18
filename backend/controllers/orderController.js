import orderModel from "../models/orderModel.js";
import {userModel} from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5173";

  try {
    // Create a new order document
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });

    // Save the new order to the database
    await newOrder.save();

    // Clear the user's cart after placing the order
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    // Prepare line items for Stripe session creation
    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "usd", // Assuming all items use USD
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // Add delivery charges as a single line item with the same currency
    line_items.push({
      price_data: {
        currency: "usd", // Assuming delivery charges are in USD
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: Math.round(2 * 100), // Adjust based on your pricing logic
      },
      quantity: 1,
    });

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    // Return session URL to the client
    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const verifyorder=async (req,res)=>{
    const {orderId,success}=req.body
    try {
        if(success=="true")
            {
                await orderModel.findByIdAndUpdate(orderId,{payment:true})
                res.json({success:true,message:"Paid"})
            }
        else{
            await orderModel.findByIdAndDelete(orderId)
            res.json({success:false,message:"Not Paid"})
        }
    } catch (error) {
        console.error("Error verifying order:", error);
        res.status(500).json({ success: false, error: error.message });
        
    }


}

//UserOrders for frontend
const userOrders = async (req, res) => {
  try {
    // Ensure userId is provided in the request body
    if (!req.body.userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    // Fetch orders for the given userId
    const orders = await orderModel.find({ userId: req.body.userId });

    // Respond with the fetched orders
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Error fetching orders', error: error.message });
  }
};
//listing orders for admin panel

 const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Error fetching orders', error });
  }
};
// api for updating orde Status
const updateStatus =async(req,res )=>
{
  try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
        res.json({success:true,message:"Order Status Updated Successfully"})
    
  } catch (error) {
    console.error('Error updating order status:', error);
    
  }

}  
export { placeOrder,verifyorder,userOrders,listOrders ,updateStatus};
