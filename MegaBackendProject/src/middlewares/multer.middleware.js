import multer from "multer"


//main code directly from multer npm
const storage = multer.diskStorage({
  destination: function (req, file, cb) {   //cb is callback.....multer gives access to this file thing
    cb(null, "./public/temp");   //will keep files in the public folder
  },
  filename: function (req, file, cb) {
    ////can do this too but for now doing it simply
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    // cb(null, file.fieldname + '-' + uniqueSuffix)]

    cb(null,file.originalname);  //jis name se user ne diya tha usse hi save kar do.....not a good procatice though
  }
})

export const upload = multer({ 
  storage,
})