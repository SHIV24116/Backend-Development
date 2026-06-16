////this is basically a server

require('dotenv').config()

const express =require('express')
const app=express();   ////can express different thimgs from express as app.___

//const port =4000   //virtual port
//defined in .env

app.get('/',(req,res)=>{
    res.send('Hello World')
})

app.get('/shiv',(req,res)=>{
    res.send('I am Shivendra')
})

app.get('/education',(req,res)=>{
    res.send('<h1>Btech in ECE at PDPM IIITDM Jabalpur</h1>')
})


app.listen(process.env.PORT,()=>{
    console.log(`Example app listening on port ${process.env.PORT}`)
})     ////////this is the listening function from a port


//noramally when we update the file we need to restart the server