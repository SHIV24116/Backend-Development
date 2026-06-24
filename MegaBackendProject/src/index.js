// require('dotenv').config({path : './env'});

import dotenv from "dotenv"
 

// import connectDB from "./db"; ............wrong
import connectDB from "./db/index.js";   //since we are using {type:module}.....ans ES module requires exact address of the file having that parameter

dotenv.config({
    path:"./.env"
});

import {app} from "./app.js"

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`server is running at port ${process.env.PORT}`);
    })
})
.catch((error)=>{
    console.log("MONGO DB connection failed !!!",error)
})














/////this is one approach but here we cluttered index a little
// import mongoose from "mongoose";
// import { DB_name } from "./constants";
// import express from "express";
// const app=express()

// //good to write it in a IIF(imidiately invoked function).....()()
// (async()=>{
//     try {
//        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_name}`)

//        //this is an event listener
//        app.on("error",(error)=>{    //Connection to hogaya but app can not talk
//         console.log("ERROR: ",error);
//         throw error
//        })
 
//        //listen function bhi yahi likh diya
//        app.listen(process.env.PORT,()=>{
//         console.log(`App is listening at port ${process.env.PORT}`)
//        })
//     }catch(error) {
//         console.log("Error: ",error)
//         throw error
//     }
// })()