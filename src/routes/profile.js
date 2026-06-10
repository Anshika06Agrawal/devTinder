const express = require("express");
const profileRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    //validate my token

    if (!user) {
      throw new Error("USER doesnot Exist");
    }

    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR :  " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("INVALID EDIT REQUEST");
    }
    const loggedInUser = req.user; //yh auth middleware se jo user aaya h vo h
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save(); // it will save my data inside my database
    res.send(`${loggedInUser.firstName} your Profile updated successfully`);
  } catch (err) {
    res.status(400).send("ERROR :  " + err.message);
  }
});

profileRouter.patch("/profile/editPassword", userAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const loggedInUser = req.user;
    //token problem resolved
    const isPasswordValid = await bcrypt.compare(
      oldPassword,
      loggedInUser.password,
    );
    if (!isPasswordValid) {
      throw new Error("ENTERED PASSWORD IS INCORRECT");
    }
    if (newPassword != confirmPassword) {
      throw new Error("Passwords do not match");
    }
    const passwordHash = await bcrypt.hash(newPassword, 10);
    loggedInUser.password = passwordHash;
    await loggedInUser.save();
    res.send("password updated successfully ");
  } catch (err) {
    res.status(400).send("ERROR :  " + err.message);
  }
});

module.exports = profileRouter;
