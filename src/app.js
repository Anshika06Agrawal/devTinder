const express=require("express");
const app=express()

app.get("/home",(req, res)=>{
    res.send({firstName:"Anshika" , lastname: "Agrawal"})
})
app.post("/update",async(req, res)=>{
    console.log(req.body)
    res.send("home bunny")
})


app.use("/login", (req,res)=>{
    res.send("bunny this is login page")
})  


app.use("/", (req,res)=>{
    res.send("bunny this is home page new page smjha n teko")
})


app.listen(3000,()=>{
console.log("server is sucessfully listen on port 3000")
})