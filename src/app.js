const express=require("express");
const app=express()

app.use("/home",(req, res)=>{
    res.send("home bunny")
})

app.use("/", (req,res)=>{
    res.send("bunny this is home page new page smjha n teko")
})

app.listen(3000,()=>{
console.log("server is sucessfully listen on port 3000")
})