import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()
const url=process.env.DATABASEURL as string  

const mongodb =async()=>{
    try {
        await mongoose.connect(url)
        console.log("Database connected successfully");
        
    } catch (error:any) {
        console.error("Error connecting to MongoDB:", error.message);
            
    }
}

export default mongodb