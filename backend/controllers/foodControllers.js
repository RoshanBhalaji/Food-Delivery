import foodmodel from "../models/foodModel.js"; // Ensure the .js extension is included
import fs from 'fs';

// Add food item
const addFood = async (req, res) => {
    let image_filename = `${req.file.filename}`;

    const food = new foodmodel({
        name: req.body.name, // Include the name field
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename
    });

    try {
        await food.save();
        res.json({ success: true, message: "Food Added" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const listFood=async (req,res)=>{
    try {
        const foods=await foodmodel.find({});
        res.json({success:true,data:foods})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
        
    }
    
}

const removeFood=async(req,res)=>{
    try {
        const food=await foodmodel.findById(req.body.id)
        fs.unlink(`uploads/${food.image}`,()=>{})
        await foodmodel.findByIdAndDelete(req.body.id)
        res.json({success:true,message:"Food Removed"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
        
    }

}
export { addFood,listFood,removeFood };
