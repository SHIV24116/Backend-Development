import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asynchandler } from "../utils/asynchandler.js";
import jwt  from "jsonwebtoken";


//ye authentication ki jarurat bahoyt jagaho par padegi...to get the access of used... is liye ek common function bana liya

export const verifyJWT = asynchandler(async(req,res,next)=>{
    try{
        console.log("Cookies:", req.cookies);
        console.log("Authorization Header:", req.header("Authorization"));

        const token =req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")

        if(!token){
            throw new ApiError(401,"Unauthorised request")
        }

        const decodedToken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
        const user=await User.findById(decodedToken?._id).select("-password -refreshToken")

        if(!user){
          //descussion upcoming
            throw new ApiError(401,"Invalid Access token")
        }

        req.user=user
        next()
    }catch(error){
        console.log(error);
        throw new ApiError(401,error?.message||"Invalid access token")
    }
})