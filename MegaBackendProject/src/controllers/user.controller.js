import {asynchandler} from "../utils/asynchandler.js";

import {ApiError} from "../utils/ApiError.js"

import {User} from "../models/user.model.js"

import {uploadoncloudinary} from "../utils/cloudinary.js"

import { ApiResponse } from "../utils/ApiResponse.js";

import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false }) //matlab kuch validation lagane ki jarurat nhi hai....seedha save kar do....we will manage validations

        return {accessToken, refreshToken}

    } catch (error) {
        console.log("actual",error);
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}
 
const registerUser = asynchandler(async(req,res)=>{
    //get user details from frontend
    //validations(email shi hai ya nhi,etc)
    //check if user already exists
    //check for images,avatars
    //upload them to cloudinary
    //create user object-create user entry in db
    //remove password and refresh token field from the response
    //check for user creation
    //return res

    const {fullname,email,username,password} =req.body
    console.log(username,email)

     


    // if(fullname===""){
    //     throw new ApiError(400,"fullname is required")
    // }
    ////doing same thingon each parameter simultaneously....can do one by one too
    if(
        [fullname,email,username,password].some((field)=>
        field?.trim()==="")
    ){
        throw new ApiError(400,"All fields are required")
    }

    const existeUser=await User.findOne({
        $or:[{username},{email}]
    })
    if(existeUser){
        throw new ApiError(409,"user with email or username already exists")
    }

    const coverImageLocalPath= req.files?.avatar[0]?.path;

    //////when we do not upload cover image thiis line may causse problem so....do it in classic if-else way
    //const coverImageLocalPath= req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if(!avatarLocalPath) throw new ApiError(400,"Avatar file is required")
    
    //now we will upload images on cloudinary.....basic code is alredy written
    const avatar=await uploadoncloudinary(avatarLocalPath)
    const coverImage=await uploadoncloudinary(coverImageLocalPath)

    if(!avatar){  //manlo upload na hua ho to....we need to check as avatar is a required field
        throw new ApiError(400,"Avatar file upload failed")
    }

    const user=await User.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })
    const createdUser = await User.findById(user._id).select("-password -refreshToken")  //mongodb itself assigns an _id
    
    if(!createdUser){
        return new ApiError(400,"Something went wrong while registering the user")
    }
    return res.status(201).json(
        new ApiResponse(200,createdUser,"Created user successfully.")
    )
} )


const loginUser = asynchandler(async (req, res) =>{
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const {email, username, password} = req.body
    console.log(email);

    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }
    
    // Here is an alternative of above code based on logic discussed in video:
    // if (!(username || email)) {
    //     throw new ApiError(400, "username or email is required")
        
    // }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")  //jo cheejshum nhi chahte hi finally result me reflect ho unko select karte hain

    const options = {
        httpOnly: true,
        secure: true
    }    ///ye options enable karne ke baad these cookies can only be modified by the server not the frontend

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)    //cookies access kar pa rahe hain because we have used cookie parser
    .cookie("refreshToken", refreshToken, options) //ye saarei cheeze cookie me set kardiye
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken   //no necessary need to send refresh and access token here
            },
            "User logged In Successfully"
        )
    )

})

const logoutUser=asynchandler(async(req,res)=>{ //after injectinbg the jwtverify middle ware now we have the access of "req.user" as now we have access token
    User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true
        }
    )
    const options={
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200,"User logged-out successfully"))
})

const refreshaccessToken=asynchandler(async(req,res)=>{
    const incomingRefreshToken=req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401,"Unauthorised request")

    }
    try{
        const decodedToken=jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
        const user=await User.findById(decodedToken?._id)

        if(!user){
            throw new ApiError(401,"Invalid refresh Token")
        }
        if(incomingRefreshToken!==user?.refreshToken){
            throw new ApiResponse(401,"Refresh token expired")
        }
        const options={
            httpOnly:true,
            secure:true
        }
        const {access,refresh} =await generateAccessAndRefereshTokens(user._id)

        return res
        .status(200)
        .cookie("accessToken",access,options)
        .cookie("RefreashToken",refresh,options)
        .json(
            new ApiResponse(
                200,
                {access,refreshToken:refresh},
                "Access token refreshed successfully"
            )
        )
    }catch(error){
        throw new ApiError(401,error?.message || "Invalid refresh token")
    }
})

const changeCurrentPassword = asynchandler(async(req,res)=>{
    const {oldPassword,newPassword}=req.body

    const user=await User.findById(req.user?._id)

    const validpass=await user.isPasswordCorrect(oldPassword)

    if(!validpass){
        throw new ApiError(400,"Old password Incorrect")
    }
    user.password=newPassword
    await ser.save({validatebeforeSave:false})

    return res
    .status(200)
    .json(new ApiResponse(200,{},"Password changed successfully."))
})

const getCurrentUser=asynchandler(async(req,res)=>{
    return res
    .status(200)
    .json(new ApiResponse(200,req.user,"Current user fetched successfully"))
})

const updateAccountDetails=asynchandler(async(req,res)=>{
    const {fullName,email}=req.body //can add more fields

    if(!fullName || !email) {
        throw new ApiError(400,"All fiels are required")
    }
    const user=await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                fullName,
                email:email
            }
        },
        {new:true}
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200,user,"Credentials updated successfully"))
})

const updateAvatar=asynchandler(async(req,res)=>{  ////files wali cheeze preferably alg se hi update karani chahiyre....jaise ki photo chanage ki to wahi ka wahi save update ka option ho
    const avatarLocalPath=req.file?.path

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is missing")
    }

    const avatar=await uploadoncloudinary(avatarLocalPath)

    if(!avatar.url){
        throw new ApiError(400,"Error while uploading on avatar")
    }

    const user=await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                avatar:avatar.url  //avatar jo hai wo pura ek object hai jo ki cloudinary se mila hai
            }
        },
        {new:true}
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200,user,"Avatar updated successfully"))
})


//also try to delete old image from cloudinary....till now we havent done that
const updateCoverImage=asynchandler(async(req,res)=>{  ////files wali cheeze preferably alg se hi update karani chahiyre....jaise ki photo chanage ki to wahi ka wahi save update ka option ho
    const coverImageLocalPath=req.file?.path

    if(!coverImageLocalPath){
        throw new ApiError(400,"Cover Image file is missing")
    }

    const coverImage=await uploadoncloudinary(coverImageLocalPath)

    if(!coverImage.url){
        throw new ApiError(400,"Error while uploading on coverimage")
    }

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                coverImage:coverImage.url   
            }
        },
        {new:true}
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200,user,"CoverImage updated successfully"))
})

///////understand this aggregation pipeline properly from chatgpt once
const getUserChannelProfile = asynchandler(async(req, res) => {
    const {username} = req.params

    if (!username?.trim()) {
        throw new ApiError(400, "username is missing")
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()    //here we filterwd now we have only one document
            }
        },
        {   //////now we want to look for the details of a particular channel
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }///here we got all the subscribers
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullName: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1

            }
        }
    ])

    if (!channel?.length) {
        throw new ApiError(404, "channel does not exists")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, channel[0], "User channel fetched successfully")
    )
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshaccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateAvatar,
    updateCoverImage,
    getUserChannelProfile,
}

//jab bhi we are trying to get something from database always use async-await