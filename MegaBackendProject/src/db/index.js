import mongoose from "mongoose";
import { DB_name } from "../constants.js";

const connectDB=async()=>{
    try{
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_name}`)
        console.log(`\n MongoDB connected !! DB Host: ${connectionInstance.connection.host}`); //this shows which DB has actually been connected
    }catch(error){
        console.log("MONGODB connection error ",error);
        process.exit(1)  ///we can also write throw statement but node give use this process.exit(1/2/3...) too to exit
    }
}

export default connectDB