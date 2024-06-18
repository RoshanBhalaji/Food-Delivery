import { userModel } from '../models/userModel.js';

const addToCart = async (req, res) => {
    try {
        // Find the user by their ID
        const userData = await userModel.findOne({ _id: req.body.userId });
        
        // Check if the user was found
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Access or initialize the user's cart data
        let cartData = userData.cartData || {};

        // Update the cart data with the new item
        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1;
        } else {
            cartData[req.body.itemId] += 1;
        }

        // Update the user's cart data in the database
        await userModel.findByIdAndUpdate(req.body.userId, { cartData });

        // Send a success response
        res.json({ success: true, message: "Item added to cart successfully" });
    } catch (error) {
        console.error("Error adding item to cart:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const removeFromCart = async (req, res) => {
    try {
        // Find the user by their ID
        const userData = await userModel.findOne({ _id: req.body.userId });

        // Check if the user was found
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Access or initialize the user's cart data
        let cartData = userData.cartData || {};

        // Remove the item from the cart or decrease its quantity
        if (cartData[req.body.itemId]) {
            if (cartData[req.body.itemId] > 1) {
                cartData[req.body.itemId] -= 1;
            }
        }

        // Update the user's cart data in the database
        await userModel.findByIdAndUpdate(req.body.userId, { cartData });

        // Send a success response
        res.json({ success: true, message: "Item removed from cart successfully" });
    } catch (error) {
        console.error("Error removing item from cart:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const getCart = async (req, res) => {
    try {
        // Find the user by their ID
        const userData = await userModel.findOne({ _id: req.body.userId });

        // Check if the user was found
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Access the user's cart data
        let cartData = userData.cartData || {};

        // Send the cart data in the response
        res.json({ success: true, cartData });
    } catch (error) {
        console.error("Error retrieving cart:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export { addToCart, removeFromCart, getCart };
