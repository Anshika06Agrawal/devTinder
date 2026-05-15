const express = require("express");
const app = express();
const connectDb = require("./config/dataBase");
const User = require("./models/user");
app.use(express.json()); //POST request ka body read karta hai

//async use kiya kyunki DB operation time leta hai
app.post("/signUp", async (req, res) => {
  //creating a new instance of User model
  //User=({}) means User ko ek object pass kar rahe ho. object wrapped inside parentheses
  const user = new User(req.body); //ab pura data middleware se aarha
  //ek naya user document create ho raha hai
  try {
    await user.save();
    res.send("User added sucessfully");
  } catch (err) {
    res.status(400).send("error saving the user:" + err.message);
  }
});

connectDb()
  .then(() => {
    console.log("connection established successfully");
    app.listen(3000, () => {
      console.log("server is sucessfully listen on port 3000");
    });
  })
  .catch((err) => {
    console.log("error db not connected yet ");
  });
