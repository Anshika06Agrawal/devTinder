const express=require("express");
const app=express()

app.get("/user",(req, res)=>{
    console.log(req.query)
    res.send({firstName:"Anshika" , lastname: "Agrawal"})
})
app.post("/update",async(req, res)=>{
    console.log(req.body)
    res.send("home bunny")
})


app.use("/login", (req,res)=>{
    res.send("bunny this is login page")
})  

app.listen(3000,()=>{
console.log("server is sucessfully listen on port 3000")
})