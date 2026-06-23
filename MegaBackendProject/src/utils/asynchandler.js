
/////async await funct. method

// const asunchandler=(fn)=>async(req,res,next)=>{
//     try{
//        await fn(req,res,next)
//     }catch(error){
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }

////promise method
const asynchandler = (requesthandler)=>{
    (req,res,next)=>{
        Promise.resolve(requesthandler(req,res,next)).catch((err)=>next(err))
    }
}

export {asynchandler}

//ye utility function isliye banaya ki is structure ko commonly use kar sake different jagaho pe
