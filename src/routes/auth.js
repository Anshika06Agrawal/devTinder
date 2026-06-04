const express = require("express");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
const { validateSingUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

authRouter.post("/signUp", async (req, res) => {
  try {
    //validate the Data
    validateSingUpData(req); //utils k andar validation file hai usme h yeh function

    // Encrpt the password validate password using bcrypt hash k form m password rakhte h database m
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    // creating instance of new user
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("User added sucessfully");
  } catch (err) {
    res.status(400).send("ERROR :  " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Email INVALID");
    }
    const isPasswordValid = await user.validatePassword(password); // yh vo pasword h user ne sent kiya h

    if (isPasswordValid) {
      //Creating JWT TOKEN  user._id object id h yh
      // iss line se const user = await User.findOne({ emailId: emailId }); email mile jo user m aai phir issi user se helper function k through humko ()JWT token generate karta hai) milega joki (userSchema hai user mein )
      const token = await user.getJWT();

      //add the token to cookie & send the espone back to user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send("LOGGED IN SUCCESFULLY");
    } else {
      throw new Error("Password INCORRECT");
    }
  } catch (err) {
    res.status(400).send("ERROR :  " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  //just expire token from cookie
  try {
    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.send("LOGGED OUT SCUCESSFULLY")
  } catch (err) {
    res.status(400).send("ERROR :  " + err.message);
  }
});



module.exports = authRouter;
