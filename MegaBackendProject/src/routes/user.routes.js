import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, getUserChannelProfile, getWatchHistory, loginUser, logoutUser, refreshaccessToken, registerUser, updateAccountDetails, updateAvatar, updateCoverImage } from "../controllers/user.controller.js";

import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router()

router.route("/register").post(
    upload.fields([    ////now we can send images  using multer
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)

//secured routes                                      //aise comma laga laga ke jitne chahe utne middle ware de sakte hain
router.route("/logout").post(verifyJWT,logoutUser)  //bas yahi pe middleware ko inject kara dete hain
                                                     //middleware me jo next hota hai wahi batata hai...ki mera kaaam khatam now can move to next operation

router.route("/refresh-token").post(refreshaccessToken)
 ////how do we decide when to use verifyjwt???


router.route("/change-password").post(verifyJWT,changeCurrentPassword)

router.route("/current-user").get(verifyJWT,getCurrentUser)  //why get

router.route("/update-account").patch(verifyJWT,updateAccountDetails) //why patch

router.route("/avatar-update").patch(verifyJWT,upload.single("avatar"),updateAvatar)
router.route("/coverImage-update").patch(verifyJWT,upload.single("coverImage"),updateCoverImage)

router.route("/c/:username").get(verifyJWT, getUserChannelProfile)  // ???
router.route("/history").get(verifyJWT, getWatchHistory)         
 

export default router