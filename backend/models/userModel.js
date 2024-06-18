import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,unique:true,required:true},
    password:{type:String,require:true,minlength:8},
    cartData:{type:Object,default:{}}

},{minimize:false})
const userModel=mongoose.models.user||mongoose.model("user",userSchema);

export {userModel}