import { Router } from "express";
import { loginUser, logoutUser, refreshaccessToken, registerUser } from "../controllers/user.controller.js";

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

export default router