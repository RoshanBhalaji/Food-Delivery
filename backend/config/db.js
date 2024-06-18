import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("DB Connected");
  } catch (error) {
    console.error("DB Connection Error: ", error);
    process.exit(1); 
  }
};
