import express from "express"

import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    Credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))

app.use(express.static("public"))

//////////////////////////////////////////////////////////////////////

//routes import
import userRouter from "./routes/user.routes.js"


//routes declaration
/////jab hum yahi pe routes and controllers ek sath likh rahe the to hum app.get() use karte the but  now we need middlewares...use app.use()
app.use("/api/v1/users",userRouter)   //this /api/v1/....is not necessary but its a good practice we we will create other versions of the api



////////////////////////////////////////////////////////////////////////////
export {app}