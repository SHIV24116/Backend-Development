import mongoose,{Schema} from "mongoose"

const videoSchema=new Schema(
    {
        videoFile:{
            type:String,  //cloudinary URL
            required:true,
        },
        thumbnail:{
            type:String,  //cloudinary se url use karenge
            required:true,
        },
        title:{
            type:String,
            required:true
        },
        duration:{
            type:Number,  //clodinary se nikalenge
            required:true
        },
        views:{
            type:Number,
            default:0       
        },
        isPublished:{   
            type: Boolean ,
            default:true
        },
        owner:{    
            type: Schema.Types.ObjectId,
            ref:"User"
        }
    },{timestamps:true}
)

export const Video=mongoose.model("Video",videoSchema)