import mongoose,{Schema} from "mongoose"

import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema=new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim: true,
            index:true,  //specially in mongodb if we want to implement searching....doing indexing is good        
        },
        fullname:{
            type:String,
            required:true,
            trim: true,
            index:true,  //specially in mongodb if we want to implement searching....doing indexing is good        
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim: true,
        },
        avatar:{
            type:String,  //cloudinary se url use karenge
            required:true,
        },
        coverImage:{
            type:String
        },
        watchHistory:[
            {
               type:Schema.Types.ObjectId,
               ref:"Video"
            }
        ],
        password:{
            type:String,
            required:[true,'password is required']        
        },
        refreshToken:{   //what are tockens??
            type: String  
        }
    },{timestamps:true}
)


userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password= await bcrypt.hash(this.password,10)
})

userSchema.methods.isPasswordCorrect =async function(password){
    return await bcrypt.compare(password,this.password)   //here this.password is encrypted password
}

userSchema.methods.generateAccessToken =function(){
    return jwt.sign(
        {                   //this is the payload....whatever parameters we want to pass
            _id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken =function(){
    return jwt.sign(
        {                   //this is the payload....whatever parameters we want to pass
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User=mongoose.model("User",userSchema)